import React from 'react';
import { sound } from '../audio/soundSystem';

export default function DeckDashboard({
    sectors,
    solvedSectors,
    clearanceTier,
    onSelectSector
}) {
    const getArchetypeBadge = (archetype) => {
        switch (archetype) {
            case 'SYNTAX_FIX':
                return { label: 'SYNTAX PATCH', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' };
            case 'LOGIC_GATE':
                return { label: 'CIRCUIT LOGIC', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' };
            case 'CIPHER':
                return { label: 'CIPHER DECRYPT', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' };
            default:
                return { label: 'PUZZLE', color: 'text-neutral-400 border-neutral-600 bg-neutral-800' };
        }
    };

    const integrityPct = Math.round(((sectors.length - solvedSectors.length) / sectors.length) * 100);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="bg-[#121417]/80 border border-amber-500/30 rounded p-2.5">
                    <div className="text-[10px] text-neutral-400">DEFENSE INTEGRITY</div>
                    <div className="text-base sm:text-lg font-bold text-amber-400 flex items-center justify-between">
                        <span>{integrityPct}%</span>
                        <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-400 transition-all duration-500"
                                style={{ width: `${integrityPct}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-[#121417]/80 border border-cyan-500/30 rounded p-2.5">
                    <div className="text-[10px] text-neutral-400">SUBROUTINE NODES</div>
                    <div className="text-base sm:text-lg font-bold text-cyan-300">
                        {solvedSectors.length} / {sectors.length} OVERRIDDEN
                    </div>
                </div>

                <div className="bg-[#121417]/80 border border-amber-500/30 rounded p-2.5">
                    <div className="text-[10px] text-neutral-400">CLEARANCE RATING</div>
                    <div className="text-base sm:text-lg font-bold text-amber-300">
                        TIER-{clearanceTier}
                    </div>
                </div>

                <div className="bg-[#121417]/80 border border-emerald-500/30 rounded p-2.5">
                    <div className="text-[10px] text-neutral-400">CORE STATUS</div>
                    <div className="text-base sm:text-lg font-bold text-emerald-400 truncate">
                        {solvedSectors.length === sectors.length ? 'CAPTURED' : 'UNCONTAINED'}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3 font-mono">
                    <h2 className="text-sm font-bold text-amber-400 tracking-wider flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>SECURITY SECTOR MATRIX</span>
                    </h2>
                    <span className="text-[11px] text-neutral-400">
                        SELECT ACTIVE NODE TO INITIATE BREACH
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
                    {sectors.map((sec, idx) => {
                        const isSolved = solvedSectors.includes(sec.id);
                        const isUnlocked = sec.tier <= clearanceTier;
                        const isCurrentTarget = isUnlocked && !isSolved;
                        const badge = getArchetypeBadge(sec.archetype);

                        return (
                            <div
                                key={sec.id}
                                className={`relative rounded-lg border p-4 transition-all duration-200 flex flex-col justify-between ${isSolved ? 'border-cyan-500/60 bg-[#0e171b]/90 shadow-[0_0_12px_rgba(0,232,198,0.15)]' : isCurrentTarget ? 'border-amber-400 bg-[#16140e]/95 shadow-[0_0_15px_rgba(255,176,0,0.25)] ring-1 ring-amber-400/50' : 'border-neutral-800 bg-[#0e1115]/50 opacity-60'}`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] tracking-wider text-neutral-400">
                                            0{idx + 1} // {sec.id}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                    </div>

                                    <h3 className={`text-base font-bold tracking-wide mb-1 ${isSolved ? 'text-cyan-300' : isCurrentTarget ? 'text-amber-400' : 'text-neutral-400'}`}>
                                        {sec.name}
                                    </h3>

                                    <div className="text-[11px] text-neutral-400 font-mono mb-3">
                                        PORT: <span className="text-neutral-300">{sec.nodeAddress}</span>
                                    </div>

                                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                                        {sec.description}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                                    <div className="text-[11px]">
                                        {isSolved ? (
                                            <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                <span>BREACHED</span>
                                            </span>
                                        ) : isCurrentTarget ? (
                                            <span className="text-amber-400 font-bold flex items-center space-x-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                                <span>READY</span>
                                            </span>
                                        ) : (
                                            <span className="text-neutral-400 flex items-center space-x-1.5">
                                                <span>LOCKED (TIER-{sec.tier})</span>
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        disabled={!isUnlocked}
                                        onClick={() => {
                                            if (isUnlocked) {
                                                sound.playDiskSeek();
                                                onSelectSector(sec);
                                            } else {
                                                sound.playError();
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded text-xs font-bold tracking-wider transition-all duration-150 ${isSolved ? 'border border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/40 cursor-pointer' : isCurrentTarget ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-[0_0_10px_rgba(255,176,0,0.5)] cursor-pointer hover:scale-105 active:scale-95' : 'border border-neutral-800 text-neutral-600 cursor-not-allowed'}`}
                                    >
                                        {isSolved ? 'REVIEW' : isCurrentTarget ? 'BREACH >>' : 'RESTRICTED'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}