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
    const [view, setView] = useState('BOOT');
    const [currSector, setCurrSector] = useState(null);
    const [authTier, setAuthTier] = useState(1);
    const [clearedNodes, setClearedNodes] = useState([]);
    const [ioActive, setIoActive] = useState(false);
    const [audioMuted, setAudioMuted] = useState(false);
    const [modalSector, setModalSector] = useState(null);

    useEffect(() => {
        try {
            const rawData = localStorage.getItem(STORAGE_KEY);
            if (rawData) {
                const parsed = JSON.parse(rawData);
                if (parsed.solvedSectors) setClearedNodes(parsed.solvedSectors);
                if (parsed.clearanceTier) setAuthTier(parsed.clearanceTier);
                if (parsed.soundMuted !== undefined) {
                    setAudioMuted(parsed.soundMuted);
                    sound.setMuted(parsed.soundMuted);
                }
            }
        } catch (ex) {
            console.log('load failed lol:', ex);
        }
    }, []);

    const commitSave = (nodesList, tierNum) => {
        setIoActive(true);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                solvedSectors: nodesList,
                clearanceTier: tierNum,
                soundMuted: audioMuted
            }));
        } catch (err) {
            console.log('storage broke', err);
        }
        setTimeout(() => setIoActive(false), 450);
    };

    const switchAudio = () => {
        const toggled = !audioMuted;
        setAudioMuted(toggled);
        sound.setMuted(toggled);
        try {
            const temp = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            temp.soundMuted = toggled;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(temp));
        } catch (e) { }
    };

    const wipeApp = () => {
        localStorage.removeItem(STORAGE_KEY);
        setClearedNodes([]);
        setAuthTier(1);
        setCurrSector(null);
        setModalSector(null);
        setView('BOOT');
    };

    const completeSector = () => {
        if (!currSector) return;
        const targetId = currSector.id;
        let updatedList = clearedNodes;
        if (!clearedNodes.includes(targetId)) {
            updatedList = [...clearedNodes, targetId];
            setClearedNodes(updatedList);
        }

        const nextT = Math.min(5, currSector.tier + 1);
        const finalT = Math.max(authTier, nextT);
        setAuthTier(finalT);

        commitSave(updatedList, finalT);
        setModalSector(currSector);
    };

    const advanceSector = () => {
        const itemIdx = SECTORS.findIndex(s => s.id === modalSector.id);
        setModalSector(null);

        if (clearedNodes.length >= SECTORS.length || itemIdx === SECTORS.length - 1) {
            setView('WIN');
            return;
        }

        const nextObj = SECTORS[itemIdx + 1];
        if (nextObj) {
            setCurrSector(nextObj);
            setView('PUZZLE');
        } else {
            setView('DASHBOARD');
        }
    };

    const renderPuzzleView = () => {
        if (!currSector) return null;
        const pz = PUZZLES[currSector.puzzleId];
        if (!pz) return <div>Missing puzzle data</div>;

        if (pz.archetype === 'LOGIC_GATE') return <LogicGatePuzzle puzzle={pz} sector={currSector} onSolve={completeSector} onBack={() => setView('DASHBOARD')} />;
        if (pz.archetype === 'CIPHER') return <CipherPuzzle puzzle={pz} sector={currSector} onSolve={completeSector} onBack={() => setView('DASHBOARD')} />;
        if (pz.archetype === 'SYNTAX_FIX') return <SyntaxFixPuzzle puzzle={pz} sector={currSector} onSolve={completeSector} onBack={() => setView('DASHBOARD')} />;
        return <div>unknown puzzle archetype</div>;
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-amber-400 font-mono relative selection:bg-amber-500 selection:text-neutral-950">
            <CrtOverlay />

            {view === 'BOOT' && <BootSequence onComplete={() => setView('DASHBOARD')} />}
            {view === 'WIN' && <WinScreen onRestart={wipeApp} />}

            {(view === 'DASHBOARD' || view === 'PUZZLE') && (
                <div className="flex flex-col min-h-screen">
                    <Header
                        clearanceTier={authTier}
                        isDiskBusy={ioActive}
                        soundMuted={audioMuted}
                        onToggleSound={switchAudio}
                        onResetTerminal={wipeApp}
                    />

                    <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
                        {view === 'DASHBOARD' && (
                            <div className="space-y-6">
                                <DeckDashboard
                                    sectors={SECTORS}
                                    solvedSectors={clearedNodes}
                                    clearanceTier={authTier}
                                    onSelectSector={(sec) => { setCurrSector(sec); setView('PUZZLE'); }}
                                />
                                <TerminalShell
                                    clearanceTier={authTier}
                                    solvedSectors={clearedNodes}
                                    sectors={SECTORS}
                                    onLaunchSector={(sec) => { setCurrSector(sec); setView('PUZZLE'); }}
                                    onResetTerminal={wipeApp}
                                    onToggleSound={switchAudio}
                                    soundMuted={audioMuted}
                                />
                            </div>
                        )}

                        {view === 'PUZZLE' && renderPuzzleView()}
                    </main>

                    <footer className="border-t border-amber-500/20 py-2.5 px-4 text-center text-[10px] text-neutral-400">
                        <span>CIPHER-DECK TERMINAL // RING-0 EMULATION ACTIVE</span>
                    </footer>
                </div>
            )}

            {modalSector && (
                <VictoryModal
                    sector={modalSector}
                    onNextSector={advanceSector}
                    onClose={() => setModalSector(null)}
                    isLastSector={modalSector.tier === 5}
                />
            )}
        </div>
    );
}