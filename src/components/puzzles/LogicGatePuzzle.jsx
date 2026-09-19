import React, { useState } from 'react';
import { evaluateCircuit } from '../../data/puzzles';
import { sound } from '../../audio/soundSystem';

export default function LogicGatePuzzle({ puzzle, sector, onSolve, onBack }) {
    const [gateConfig, setGateConfig] = useState(() => {
        const init = {};
        puzzle.gateSlots.forEach((slot) => {
            init[slot.id] = slot.defaultType;
        });
        return init;
    });

    const [diagnosticResults, setDiagnosticResults] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const cycleGate = (gateId) => {
        sound.playToggle();
        const slot = puzzle.gateSlots.find((s) => s.id === gateId);
        if (!slot) return;

        const currentType = gateConfig[gateId];
        const currentIndex = slot.allowedTypes.indexOf(currentType);
        const nextIndex = (currentIndex + 1) % slot.allowedTypes.length;
        const nextType = slot.allowedTypes[nextIndex];

        setGateConfig((prev) => ({ ...prev, [gateId]: nextType }));
        setDiagnosticResults(null);
    };

    const handleRunDiagnostic = () => {
        sound.playDiskSeek();
        setIsSimulating(true);
        setDiagnosticResults(null);

        setTimeout(() => {
            const evaluation = evaluateCircuit(puzzle, gateConfig);
            setDiagnosticResults(evaluation);
            setIsSimulating(false);

            if (evaluation.allPassed) {
                sound.playSuccess();
                setTimeout(() => {
                    onSolve();
                }, 900);
            } else {
                sound.playError();
            }
        }, 400);
    };

    return (
        <div className="space-y-6 font-mono max-w-5xl mx-auto">

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
                <div>
                    <div className="flex items-center space-x-2 text-xs text-neutral-400">
                        <button
                            onClick={() => {
                                sound.playKeyClick();
                                onBack();
                            }}
                            className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                        >
                            &lt;&lt; RETURN TO DECK
                        </button>
                        <span>/</span>
                        <span className="text-cyan-400 font-bold">{sector.name}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-cyan-300 drop-shadow-[0_0_8px_rgba(0,232,198,0.4)]">
                        CIRCUIT FLOW: {puzzle.title}
                    </h2>
                </div>






                <div className="text-right text-xs">
                    <div className="text-neutral-400">TARGET BUS STATUS</div>
                    <div className="text-emerald-400 font-bold">ALL VECTORS HIGH [1]</div>
                </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#121417]/80 p-3 rounded border border-cyan-500/20">
                {puzzle.description}
            </p>


            <div className="bg-[#0b0e14] border-2 border-cyan-500/40 rounded-xl p-4 sm:p-6 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00e8c608_1px,transparent_1px),linear-gradient(to_bottom,#00e8c608_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="text-xs font-bold text-cyan-400 tracking-wider flex items-center justify-between">
                        <span>[ LOGIC RELAY TOPOLOGY // INTERACTIVE GATES ]</span>
                        <span className="text-amber-400 text-[11px] animate-pulse">CLICK ANY GATE TO ROTATE TYPE</span>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {puzzle.gateSlots.map((slot) => {
                            const currentType = gateConfig[slot.id];
                            return (
                                <div
                                    key={slot.id}
                                    onClick={() => cycleGate(slot.id)}
                                    className="bg-[#131922] border-2 border-cyan-500/50 hover:border-cyan-300 rounded-lg p-3 transition-all duration-150 cursor-pointer group shadow-[0_0_10px_rgba(0,232,198,0.1)] hover:shadow-[0_0_15px_rgba(0,232,198,0.3)] hover:-translate-y-0.5 select-none"
                                >
                                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2">
                                        <span className="font-bold text-neutral-300">{slot.id}</span>
                                        <span className="text-[10px] text-cyan-400/80">IN: [{slot.inputs.join(', ')}]</span>
                                    </div>

                                    <div className="bg-[#090d13] border border-cyan-500/40 rounded py-3 px-2 text-center group-hover:border-cyan-300 transition-colors">
                                        <div className="text-lg sm:text-xl font-black text-cyan-300 tracking-wider">
                                            {currentType}
                                        </div>
                                        <div className="text-[10px] text-neutral-400 mt-1">
                                            LOGIC GATE
                                        </div>
                                    </div>

                                    <div className="mt-2.5 flex items-center justify-center space-x-1 text-[9px] text-neutral-400">
                                        {slot.allowedTypes.map((t) => (
                                            <span
                                                key={t}
                                                className={`px-1 py-0.5 rounded ${t === currentType
                                                    ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/50'
                                                    : 'text-neutral-500'
                                                    }`}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>


                    <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-neutral-400">
                            STATE: <span className="text-cyan-400 font-bold">READY TO TRANSMIT SIGNAL</span>
                        </div>

                        <button
                            onClick={handleRunDiagnostic}
                            disabled={isSimulating}
                            className={`px-6 py-2.5 rounded font-bold tracking-wider text-xs sm:text-sm transition-all duration-150 cursor-pointer ${isSimulating
                                ? 'bg-neutral-800 text-neutral-500 cursor-wait'
                                : 'bg-cyan-500 text-neutral-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,232,198,0.5)] active:scale-95'
                                }`}
                        >
                            {isSimulating ? '[ PROPAGATING CURRENT... ]' : 'RUN_DIAGNOSTIC >>'}
                        </button>
                    </div>
                </div>
            </div>


            {diagnosticResults && (
                <div className="bg-[#121417] border border-cyan-500/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-cyan-300">DIAGNOSTIC TEST VECTOR RESULTS:</span>
                        <span className={diagnosticResults.allPassed ? 'text-emerald-400' : 'text-red-400'}>
                            {diagnosticResults.allPassed ? '>>> ALL VECTORS PASSED (CIRCUIT STABLE)' : '>>> CIRCUIT DRIFT DETECTED (MISMATCH)'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        {diagnosticResults.results.map((res, i) => (
                            <div
                                key={i}
                                className={`p-2.5 rounded text-xs flex flex-wrap items-center justify-between gap-2 border ${res.passed
                                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                                    : 'border-red-500/40 bg-red-950/20 text-red-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="font-bold">{res.vectorName}:</span>
                                    <span className="text-neutral-400">
                                        INPUTS: {JSON.stringify(res.inputs)}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <span>OUT: <strong>{res.actualOutput}</strong> (EXP: {res.expectedOutput})</span>
                                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${res.passed ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'
                                        }`}>
                                        {res.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
