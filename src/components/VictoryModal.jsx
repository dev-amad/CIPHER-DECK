import React, { useEffect } from 'react';
import { sound } from '../audio/soundSystem';

export default function VictoryModal({ sector, onNextSector, onClose, isLastSector }) {
    useEffect(() => {
        sound.playAccessGranted();
    }, []);

    const handleExit = () => {
        sound.playKeyClick();
        onClose();
    };

    const handleAdvance = () => {
        sound.playDiskSeek();
        onNextSector();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-mono">
            <div className="bg-[#0e1217] border-2 border-amber-400 rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-[0_0_30px_rgba(255,176,0,0.4)] space-y-4 animate-fade-in relative overflow-hidden">
                <div className="border-b border-amber-500/30 pb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-amber-400 font-bold tracking-widest text-sm sm:text-base">
                            ACCESS GRANTED // {sector.id}
                        </span>
                    </div>
                    <span className="text-xs text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/40">
                        BREACH TOKEN ACQUIRED
                    </span>
                </div>

                <div className="bg-[#070a0e] border border-amber-500/20 rounded-lg p-3 text-center overflow-x-auto">
                    <pre className="text-amber-400 text-[10px] sm:text-xs font-bold leading-tight inline-block drop-shadow-[0_0_8px_rgba(255,176,0,0.5)]">
                        {sector.asciiArt}
                    </pre>
                </div>

                <div className="bg-[#0b0e13] border border-cyan-500/30 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 text-neutral-400 text-[11px]">
                        <span className="text-cyan-400 font-bold">LOG: {sector.rewardLog.file}</span>
                        <span>{sector.rewardLog.timestamp}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap text-[11px] sm:text-xs">
                        {sector.rewardLog.content}
                    </p>
                </div>

                <div className="bg-amber-950/20 border border-amber-500/40 rounded p-2.5 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-bold">CLEARANCE UPDATED:</span>
                    <span className="text-amber-400 font-mono font-bold tracking-wider">
                        {sector.tierName}
                    </span>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
                    <button
                        onClick={handleExit}
                        className="px-4 py-2 rounded border border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 text-xs transition-colors cursor-pointer"
                    >
                        CLOSE TO DECK
                    </button>

                    <button
                        onClick={handleAdvance}
                        className="px-6 py-2 rounded bg-amber-500 text-neutral-950 font-bold text-xs sm:text-sm hover:bg-amber-400 shadow-[0_0_15px_rgba(255,176,0,0.5)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                        {isLastSector ? 'VIEW ROOT MANIFEST >>' : 'ADVANCE TO NEXT SECTOR >>'}
                    </button>
                </div>
            </div>
        </div>
    );
}