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

const SAVE_KEY = 'cipher_deck_save_v2';

export default function App() {
    const [stage, setStage] = useState('BOOT');
    const [activeSector, setActiveSector] = useState(null);
    const [clearanceTier, setClearanceTier] = useState(1);
    const [solvedSectors, setSolvedSectors] = useState([]);
    const [isDiskBusy, setIsDiskBusy] = useState(false);
    const [soundMuted, setSoundMuted] = useState(false);
    const [victoryModalSector, setVictoryModalSector] = useState(null);

    // load save on boot
    useEffect(() => {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            if (saved) {
                const p = JSON.parse(saved);
                if (p.solvedSectors) setSolvedSectors(p.solvedSectors);
                if (p.clearanceTier) setClearanceTier(p.clearanceTier);
                if (p.soundMuted !== undefined) {
                    setSoundMuted(p.soundMuted);
                    sound.setMuted(p.soundMuted);
                }
            }
        } catch (err) {
            console.log('load failed lol:', err);
        }
    }, []);

    const saveState = (solved, tier) => {
        setIsDiskBusy(true);
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                solvedSectors: solved,
                clearanceTier: tier,
                soundMuted
            }));
        } catch (e) {
            console.log('storage broke', e);
        }
        setTimeout(() => setIsDiskBusy(false, 450)); // fake floppy drive delay
    };

    const toggleAudio = () => {
        const next = !soundMuted;
        setSoundMuted(next);
        sound.setMuted(next);
        try {
            const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
            saved.soundMuted = next;
            localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
        } catch (e) { }
    };

    const nukeSave = () => {
        localStorage.removeItem(SAVE_KEY);
        setSolvedSectors([]);
        setClearanceTier(1);
        setActiveSector(null);
        setVictoryModalSector(null);
        setStage('BOOT');
    };

    const solveSector = () => {
        if (!activeSector) return;
        const id = activeSector.id;
        let newSolved = solvedSectors;
        if (!solvedSectors.includes(id)) {
            newSolved = [...solvedSectors, id];
            setSolvedSectors(newSolved);
        }

        const nextTier = Math.min(5, activeSector.tier + 1);
        const updatedTier = Math.max(clearanceTier, nextTier);
        setClearanceTier(updatedTier);

        saveState(newSolved, updatedTier);
        setVictoryModalSector(activeSector);
    };

    const nextSector = () => {
        const idx = SECTORS.findIndex(s => s.id === victoryModalSector.id);
        setVictoryModalSector(null);

        if (solvedSectors.length >= SECTORS.length || idx === SECTORS.length - 1) {
            setStage('WIN');
            return;
        }

        const next = SECTORS[idx + 1];
        if (next) {
            setActiveSector(next);
            setStage('PUZZLE');
        } else {
            setStage('DASHBOARD');
        }
    };

    // render current puzzle based on archetype
    const getPuzzleComponent = () => {
        if (!activeSector) return null;
        const p = PUZZLES[activeSector.puzzleId];
        if (!p) return <div>Missing puzzle data</div>;

        if (p.archetype === 'LOGIC_GATE') return <LogicGatePuzzle puzzle={p} sector={activeSector} onSolve={solveSector} onBack={() => setStage('DASHBOARD')} />;
        if (p.archetype === 'CIPHER') return <CipherPuzzle puzzle={p} sector={activeSector} onSolve={solveSector} onBack={() => setStage('DASHBOARD')} />;
        if (p.archetype === 'SYNTAX_FIX') return <SyntaxFixPuzzle puzzle={p} sector={activeSector} onSolve={solveSector} onBack={() => setStage('DASHBOARD')} />;
        return <div>unknown puzzle archetype</div>;
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-amber-400 font-mono relative selection:bg-amber-500 selection:text-neutral-950">
            <CrtOverlay />

            {stage === 'BOOT' && <BootSequence onComplete={() => setStage('DASHBOARD')} />}
            {stage === 'WIN' && <WinScreen onRestart={nukeSave} />}

            {(stage === 'DASHBOARD' || stage === 'PUZZLE') && (
                <div className="flex flex-col min-h-screen">
                    <Header
                        clearanceTier={clearanceTier}
                        isDiskBusy={isDiskBusy}
                        soundMuted={soundMuted}
                        onToggleSound={toggleAudio}
                        onResetTerminal={nukeSave}
                    />

                    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
                        {stage === 'DASHBOARD' && (
                            <div className="space-y-6">
                                <DeckDashboard
                                    sectors={SECTORS}
                                    solvedSectors={solvedSectors}
                                    clearanceTier={clearanceTier}
                                    onSelectSector={(sec) => { setActiveSector(sec); setStage('PUZZLE'); }}
                                />
                                <TerminalShell
                                    clearanceTier={clearanceTier}
                                    solvedSectors={solvedSectors}
                                    sectors={SECTORS}
                                    onLaunchSector={(sec) => { setActiveSector(sec); setStage('PUZZLE'); }}
                                    onResetTerminal={nukeSave}
                                    onToggleSound={toggleAudio}
                                    soundMuted={soundMuted}
                                />
                            </div>
                        )}

                        {stage === 'PUZZLE' && getPuzzleComponent()}
                    </main>

                    <footer className="border-t border-amber-500/20 py-2.5 px-4 text-center text-[10px] text-neutral-400">
                        <span>CIPHER-DECK TERMINAL // RING-0 EMULATION ACTIVE</span>
                    </footer>
                </div>
            )}

            {victoryModalSector && (
                <VictoryModal
                    sector={victoryModalSector}
                    onNextSector={nextSector}
                    onClose={() => setVictoryModalSector(null)}
                    isLastSector={victoryModalSector.tier === 5}
                />
            )}
        </div>
    );
}