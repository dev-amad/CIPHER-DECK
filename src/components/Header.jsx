import React from 'react';
import { sound } from '../audio/soundSystem';

export default function Header({
    clearanceTier,
    isDiskBusy,
    soundMuted,
    onToggleSound,
    onResetTerminal
}) {
    const getClearanceBadge = (tier) => {
        switch (tier) {
            case 1:
                return { label: 'TIER-1 :: GUEST', color: 'border-amber-600/60 text-amber-400 bg-amber-950/30' };
            case 2:
                return { label: 'TIER-2 :: OPERATOR', color: 'border-amber-500 text-amber-300 bg-amber-950/40' };
            case 3:
                return { label: 'TIER-3 :: SYSADMIN', color: 'border-cyan-500 text-cyan-300 bg-cyan-950/40' };
            case 4:
                return { label: 'TIER-4 :: ROOT_KERNEL', color: 'border-cyan-400 text-cyan-200 bg-cyan-950/60' };
            case 5:
                return { label: 'TIER-5 :: BLACK_ICE', color: 'border-red-500 text-red-300 bg-red-950/50 shadow-[0_0_12px_rgba(255,77,77,0.4)]' };
            default:
                return { label: 'TIER-1 :: GUEST', color: 'border-amber-600/60 text-amber-400 bg-amber-950/30' };
        }
    };

    const badge = getClearanceBadge(clearanceTier);

    return (
        <header className="border-b border-amber-500/30 bg-[#0d1117]/95 px-4 py-3 select-none backdrop-blur-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono text-xs sm:text-sm">

                {/* Left: Deck Identity & Disk Indicator */}
                <div className="flex items-center space-x-3">
                    {/* Retro Floppy Disk Visual */}
                    <div
                        className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[#161b22] border border-amber-500/30 group"
                        title={isDiskBusy ? "DISK I/O ACTIVE" : "DRIVE A: READY"}
                    >
                        {/* Floppy SVG */}
                        <svg
                            className={`w-5 h-5 transition-transform duration-300 ${isDiskBusy ? 'animate-bounce text-amber-400' : 'text-amber-500/80'}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>

                        {/* LED Indicator Light */}
                        <div className="flex items-center space-x-1.5">
                            <span
                                className={`w-2 h-2 rounded-full transition-all duration-150 ${isDiskBusy
                                        ? 'bg-amber-400 shadow-[0_0_8px_#ffb000] animate-pulse'
                                        : 'bg-emerald-500/80 shadow-[0_0_4px_#10b981]'
                                    }`}
                            />
                            <span className="text-[10px] tracking-wider text-neutral-400">
                                {isDiskBusy ? 'R/W' : 'RDY'}
                            </span>
                        </div>
                    </div>

                    {/* System Title */}
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="text-amber-400 font-bold tracking-widest text-sm sm:text-base drop-shadow-[0_0_8px_rgba(255,176,0,0.6)]">
                                CIPHER-DECK
                            </span>
                            <span className="text-[10px] text-cyan-400/80 px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                                v2.4.0
                            </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 hidden sm:block">
                            TACTICAL RETRO-MAINFRAME BYPASS SHELL
                        </p>
                    </div>
                </div>

                {/* Center: Security Clearance Badge */}
                <div className="flex items-center space-x-2">
                    <span className="text-neutral-400 text-xs hidden md:inline">AUTH:</span>
                    <div className={`px-2.5 py-1 rounded border font-semibold tracking-wider text-xs flex items-center space-x-2 ${badge.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                        <span>{badge.label}</span>
                    </div>
                </div>

                {/* Right: Sound & System Controls */}
                <div className="flex items-center space-x-2">
                    {/* Audio Toggle */}
                    <button
                        onClick={() => {
                            sound.playKeyClick();
                            onToggleSound();
                        }}
                        className={`px-2.5 py-1 rounded border text-xs flex items-center space-x-1.5 transition-colors ${soundMuted
                                ? 'border-neutral-700 text-neutral-500 hover:border-neutral-600'
                                : 'border-amber-500/60 text-amber-400 bg-amber-950/30 hover:bg-amber-900/40 shadow-[0_0_8px_rgba(255,176,0,0.2)]'
                            }`}
                        title="Toggle Synthesized Audio"
                    >
                        <span>{soundMuted ? 'MUTED' : 'AUDIO [ON]'}</span>
                    </button>

                    {/* Reset Terminal */}
                    <button
                        onClick={() => {
                            sound.playError();
                            onResetTerminal();
                        }}
                        className="px-2.5 py-1 rounded border border-red-500/40 text-red-400 bg-red-950/20 hover:bg-red-900/40 hover:border-red-400 transition-colors text-xs cursor-pointer"
                        title="Wipe Session State & Reset Terminal"
                    >
                        RESET_TERM
                    </button>
                </div>

            </div>
        </header>
    );
}
