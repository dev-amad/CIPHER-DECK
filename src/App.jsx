import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CrtOverlay from './components/CrtOverlay';
import BootSequence from './components/BootSequence';
import DeckDashboard from './components/DeckDashboard';
import TerminalShell from './components/TerminalShell';
import LogicGatePuzzle from './components/puzzles/LogicGatePuzzle';
import CipherPuzzle from './components/puzzles/CipherPuzzle';
import SyntaxFixPuzzle from './components/puzzles/SyntaxFixPuzzle';
import VictoryModal from './components/VictoryModal';
import WinScreen from './components/WinScreen';

import { SECTORS } from './data/sectors';
import { PUZZLES } from './data/puzzles';
import { sound } from './audio/soundSystem';

const STORAGE_KEY = 'cipher_deck_save_v2';

export default function App() {
    const [stage, setStage] = useState('BOOT');
    const [activeSector, setActiveSector] = useState(null);
    const [clearanceTier, setClearanceTier] = useState(1);
    const [solvedSectors, setSolvedSectors] = useState([]);
    const [isDiskBusy, setIsDiskBusy] = useState(false);
    const [soundMuted, setSoundMuted] = useState(false);
    const [victoryModalSector, setVictoryModalSector] = useState(null);

    // Load saved game from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.solvedSectors) setSolvedSectors(parsed.solvedSectors);
                if (parsed.clearanceTier) setClearanceTier(parsed.clearanceTier);
                if (parsed.soundMuted !== undefined) {
                    setSoundMuted(parsed.soundMuted);
                    sound.setMuted(parsed.soundMuted);
                }
            }
        } catch (e) {
            console.warn('Failed to load local storage save', e);
        }
    }, []);

    // Save game changes to localStorage with floppy drive I/O simulation
    const saveState = (newSolved, newTier) => {
        setIsDiskBusy(true);
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    solvedSectors: newSolved,
                    clearanceTier: newTier,
                    soundMuted
                })
            );
        } catch (e) {
            console.warn('Failed to save to local storage', e);
        }

        setTimeout(() => {
            setIsDiskBusy(false);
        }, 450);
    };

    const handleToggleSound = () => {
        const nextState = !soundMuted;
        setSoundMuted(nextState);
        sound.setMuted(nextState);
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : {};
            parsed.soundMuted = nextState;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) { }
    };

    const handleResetTerminal = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (e) { }
        setSolvedSectors([]);
        setClearanceTier(1);
        setActiveSector(null);
        setVictoryModalSector(null);
        setStage('BOOT');
    };

    const handleSelectSector = (sector) => {
        setActiveSector(sector);
        setStage('PUZZLE');
    };

    const handleSolveSector = () => {
        if (!activeSector) return;

        const sectorId = activeSector.id;
        let newSolved = solvedSectors;
        if (!solvedSectors.includes(sectorId)) {
            newSolved = [...solvedSectors, sectorId];
            setSolvedSectors(newSolved);
        }

        // Elevate tier
        const nextTier = Math.min(5, activeSector.tier + 1);
        const updatedTier = Math.max(clearanceTier, nextTier);
        setClearanceTier(updatedTier);

        saveState(newSolved, updatedTier);
        setVictoryModalSector(activeSector);
    };

    const handleNextSectorAfterVictory = () => {
        const currentIdx = SECTORS.findIndex((s) => s.id === victoryModalSector.id);
        setVictoryModalSector(null);

        // If solved all 5 sectors, trigger Win screen
        if (solvedSectors.length >= SECTORS.length || currentIdx === SECTORS.length - 1) {
            setStage('WIN');
            return;
        }

        const nextSec = SECTORS[currentIdx + 1];
        if (nextSec) {
            setActiveSector(nextSec);
            setStage('PUZZLE');
        } else {
            setStage('DASHBOARD');
        }
    };

    const renderActivePuzzle = () => {
        if (!activeSector) return null;
        const puzzle = PUZZLES[activeSector.puzzleId];
        if (!puzzle) return <div>Puzzle definition not found.</div>;

        switch (puzzle.archetype) {
            case 'LOGIC_GATE':
                return (
                    <LogicGatePuzzle
                        puzzle={puzzle}
                        sector={activeSector}
                        onSolve={handleSolveSector}
                        onBack={() => setStage('DASHBOARD')}
                    />
                );
            case 'CIPHER':
                return (
                    <CipherPuzzle
                        puzzle={puzzle}
                        sector={activeSector}
                        onSolve={handleSolveSector}
                        onBack={() => setStage('DASHBOARD')}
                    />
                );
            case 'SYNTAX_FIX':
                return (
                    <SyntaxFixPuzzle
                        puzzle={puzzle}
                        sector={activeSector}
                        onSolve={handleSolveSector}
                        onBack={() => setStage('DASHBOARD')}
                    />
                );
            default:
                return <div>Unknown puzzle type.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-amber-400 font-mono relative selection:bg-amber-500 selection:text-neutral-950">
            {/* Vintage CRT Scanlines and Bloom Overlay */}
            <CrtOverlay />

            {stage === 'BOOT' && (
                <BootSequence onComplete={() => setStage('DASHBOARD')} />
            )}

            {stage === 'WIN' && (
                <WinScreen onRestart={handleResetTerminal} />
            )}

            {(stage === 'DASHBOARD' || stage === 'PUZZLE') && (
                <div className="flex flex-col min-h-screen">
                    {/* Header Bar */}
                    <Header
                        clearanceTier={clearanceTier}
                        isDiskBusy={isDiskBusy}
                        soundMuted={soundMuted}
                        onToggleSound={handleToggleSound}
                        onResetTerminal={handleResetTerminal}
                    />

                    {/* Main Workspace */}
                    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
                        {stage === 'DASHBOARD' && (
                            <div className="space-y-6">
                                {/* Sector Grid ("The Deck") */}
                                <DeckDashboard
                                    sectors={SECTORS}
                                    solvedSectors={solvedSectors}
                                    clearanceTier={clearanceTier}
                                    onSelectSector={handleSelectSector}
                                />

                                {/* Interactive Terminal CLI */}
                                <div>
                                    <TerminalShell
                                        clearanceTier={clearanceTier}
                                        solvedSectors={solvedSectors}
                                        sectors={SECTORS}
                                        onLaunchSector={handleSelectSector}
                                        onResetTerminal={handleResetTerminal}
                                        onToggleSound={handleToggleSound}
                                        soundMuted={soundMuted}
                                    />
                                </div>
                            </div>
                        )}

                        {stage === 'PUZZLE' && renderActivePuzzle()}
                    </main>

                    {/* Bottom Footer */}
                    <footer className="border-t border-amber-500/20 py-2.5 px-4 text-center text-[10px] text-neutral-400">
                        <span>CIPHER-DECK TERMINAL ENVIRONMENT // AUTH: RING-0 EMULATION // NO EXTERNAL LEAKS DETECTED</span>
                    </footer>
                </div>
            )}

            {/* Victory Modal with ASCII Art & Recovered Log Excerpt */}
            {victoryModalSector && (
                <VictoryModal
                    sector={victoryModalSector}
                    onNextSector={handleNextSectorAfterVictory}
                    onClose={() => setVictoryModalSector(null)}
                    isLastSector={victoryModalSector.tier === 5}
                />
            )}
        </div>
    );
}
