import React, { useState } from 'react';
import { sound } from '../../audio/soundSystem';

export default function SyntaxFixPuzzle({ puzzle, sector, onSolve, onBack }) {
    const [selectedOptionId, setSelectedOptionId] = useState(null);
    const [compilerLogs, setCompilerLogs] = useState([
        `[COMPILER INIT] Target: ${puzzle.filename}`,
        `[DIAGNOSTIC] ${puzzle.compilerDiagnostic}`
    ]);
    const [isCompiling, setIsCompiling] = useState(false);
    const [patchApplied, setPatchApplied] = useState(false);

    const handleSelectOption = (optId) => {
        sound.playKeyClick();
        setSelectedOptionId(optId);
    };

    const handleApplyPatch = () => {
        if (!selectedOptionId) return;

        sound.playDiskSeek();
        setIsCompiling(true);
        setPatchApplied(false);

        const chosen = puzzle.options.find((o) => o.id === selectedOptionId);

        setTimeout(() => {
            setIsCompiling(false);

            if (chosen.correct) {
                sound.playSuccess();
                setPatchApplied(true);
                setCompilerLogs([
                    `[PATCH DEPLOY] Applying patch candidate: "${chosen.label}"`,
                    `[COMPILING] ${puzzle.filename} ... OK`,
                    `[TEST HARNESS] Executing regression test vectors ...`,
                    `>>> [PASSED] Memory safe. Zero syntax exceptions encountered.`,
                    `>>> [STATUS] INGRESS AUTHENTICATION OVERRIDE SUCCESSFUL.`
                ]);
                setTimeout(() => {
                    onSolve();
                }, 1100);
            } else {
                sound.playError();
                setCompilerLogs([
                    `[PATCH DEPLOY] Applying patch candidate: "${chosen.label}"`,
                    `[COMPILER REJECT] Fatal syntax error: ${chosen.explanation}`,
                    `[STATUS] Patch rejected by compiler daemon. Review language specification.`
                ]);
            }
        }, 450);
    };

    return (
        <div className="space-y-6 font-mono max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
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
                        <span className="text-amber-400 font-bold">{sector.name}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(255,176,0,0.4)]">
                        SYNTAX PATCH: {puzzle.title}
                    </h2>
                </div>

                <div className="text-xs text-neutral-400">
                    SOURCE: <span className="text-amber-300 font-bold">{puzzle.filename}</span> ({puzzle.language.toUpperCase()})
                </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#121417]/80 p-3 rounded border border-amber-500/20">
                {puzzle.description}
            </p>


            <div className="bg-[#0c0f14] border-2 border-amber-500/40 rounded-xl overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">

                <div className="bg-[#151a22] border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                        <span className="ml-2 text-neutral-300 font-bold">{puzzle.filename}</span>
                    </div>
                    <span className="text-[11px] text-red-400">FAULT DETECTED AT LINE {puzzle.errorLine}</span>
                </div>


                <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                    {puzzle.codeLines.map((item) => {
                        const isBugLine = item.line === puzzle.errorLine;
                        const chosen = puzzle.options.find((o) => o.id === selectedOptionId);

                        return (
                            <div
                                key={item.line}
                                className={`flex items-center space-x-4 py-0.5 px-2 rounded ${isBugLine
                                    ? patchApplied
                                        ? 'bg-emerald-950/40 border-l-4 border-emerald-500 text-emerald-300'
                                        : 'bg-red-950/40 border-l-4 border-red-500 text-red-200'
                                    : 'text-neutral-300 hover:bg-neutral-800/30'
                                    }`}
                            >
                                <span className="w-8 text-neutral-600 select-none text-right text-xs">
                                    {item.line}
                                </span>
                                <span className="flex-1 whitespace-pre">
                                    {isBugLine && patchApplied && chosen
                                        ? item.text.replace(puzzle.codeLines.find(l => l.line === puzzle.errorLine).text.trim(), chosen.label)
                                        : item.text}
                                </span>
                                {isBugLine && (
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded select-none ${patchApplied ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300 animate-pulse'
                                        }`}>
                                        {patchApplied ? '[PATCHED]' : '[SYNTAX_ERR]'}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>








            
            <div className="bg-[#090b0e] border border-red-500/30 rounded-lg p-3 font-mono text-xs space-y-1">
                <div className="text-[10px] font-bold text-neutral-400 border-b border-neutral-800 pb-1 flex justify-between">
                    <span>COMPILER DIAGNOSTIC TRACE</span>
                    <span className="text-red-400">FATAL_ERROR</span>
                </div>
                <div className="space-y-1 text-red-300/90 whitespace-pre-wrap pt-1 text-[11px] sm:text-xs">
                    {compilerLogs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                    ))}
                </div>
            </div>

            

            
            <div className="bg-[#121417] border border-amber-500/40 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-400">SELECT CANDIDATE CODE PATCH:</span>
                    <span className="text-neutral-400 text-[11px]">CHOOSE SYNTAX FIX FOR LINE {puzzle.errorLine}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {puzzle.options.map((opt) => {
                        const isSelected = selectedOptionId === opt.id;
                        return (
                            <div
                                key={opt.id}
                                onClick={() => handleSelectOption(opt.id)}
                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all duration-150 select-none ${isSelected
                                    ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_10px_rgba(255,176,0,0.3)] ring-1 ring-amber-400/50'
                                    : 'border-neutral-800 bg-[#161a21] hover:border-neutral-700'
                                    }`}
                            >
                                <div className="flex items-center space-x-2 mb-1.5">
                                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-bold ${isSelected ? 'border-amber-400 bg-amber-400 text-neutral-950' : 'border-neutral-600 text-neutral-400'
                                        }`}>
                                        {isSelected ? '✓' : ''}
                                    </span>
                                    <code className="text-amber-300 font-bold bg-[#0a0d12] px-2 py-0.5 rounded border border-neutral-700">
                                        {opt.label}
                                    </code>
                                </div>
                                <p className="text-[11px] text-neutral-400 pl-5 leading-relaxed">
                                    {opt.explanation}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-end">
                    <button
                        onClick={handleApplyPatch}
                        disabled={!selectedOptionId || isCompiling}
                        className={`px-6 py-2.5 rounded font-bold tracking-wider text-xs sm:text-sm transition-all cursor-pointer ${!selectedOptionId || isCompiling
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-[0_0_15px_rgba(255,176,0,0.5)] active:scale-95'
                            }`}
                    >
                        {isCompiling ? '[ COMPILING PATCH... ]' : 'COMPILE & TEST PATCH >>'}
                    </button>
                </div>
            </div>
        </div>
    );
}
