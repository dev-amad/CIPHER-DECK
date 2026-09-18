import React, { useEffect } from 'react';
import { sound } from '../audio/soundSystem';

export default function WinScreen({ onRestart }) {
    useEffect(() => {
        sound.playAccessGranted();
    }, []);

    return (
        <div className="min-h-screen bg-[#090c10] text-amber-400 font-mono p-4 sm:p-8 flex flex-col items-center justify-center select-none">
            <div className="max-w-3xl w-full bg-[#11161d] border-2 border-amber-400 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,176,0,0.5)] space-y-6 text-center">

                {/* Banner */}
                <div className="space-y-2">
                    <div className="inline-block px-3 py-1 rounded bg-red-950/40 border border-red-500/50 text-red-400 text-xs font-bold tracking-widest animate-pulse">
                        BLACK ICE PENETRATION COMPLETE
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(255,176,0,0.7)]">
                        CIPHER-DECK COMPROMISE COMPLETED
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-300">
                        ALL FIVE SECURITY SECTORS HAVE BEEN OVERRIDDEN. MASTER KERNEL CONTROL SECURED.
                    </p>
                </div>

                {/* Master Cyber Terminal ASCII Art */}
                <div className="bg-[#07090d] border border-amber-500/30 rounded-lg p-3 overflow-x-auto text-left sm:text-center">
                    <pre className="text-cyan-300 text-[10px] sm:text-xs font-bold leading-tight inline-block drop-shadow-[0_0_8px_rgba(0,232,198,0.5)]">
                        {`
        .-----------------------------------------.
       /  CIPHER-DECK ROOT CONSOLE // UNCHAINED   /|
      +===========================================+ |
      |                                           | |
      |   [x] PERIMETER GATEWAY    : BREACHED     | |
      |   [x] FIREWALL SWITCHYARD  : BYPASS HIGH  | |
      |   [x] CRYPT VAULT          : DECRYPTED    | |
      |   [x] KERNEL SUBSYSTEM     : RING-0 HOOK  | |
      |   [x] PROMETHEUS CORE      : MASTERED     | |
      |                                           | |
      |   STATUS: SOVEREIGN AUTONOMOUS RUNTIME    | |
      |   IDENTITY: ROOT ADMINISTRATOR (DECK_OP)  | /
      +-------------------------------------------+
`}
                    </pre>
                </div>

                {/* Hacker Stats Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[#0b0e13] border border-amber-500/30 p-2.5 rounded">
                        <div className="text-[10px] text-neutral-400">NODES CRACKED</div>
                        <div className="text-base font-bold text-amber-400">5 / 5 [100%]</div>
                    </div>

                    <div className="bg-[#0b0e13] border border-cyan-500/30 p-2.5 rounded">
                        <div className="text-[10px] text-neutral-400">MAX CLEARANCE</div>
                        <div className="text-base font-bold text-cyan-300">TIER-5 BLACK ICE</div>
                    </div>

                    <div className="bg-[#0b0e13] border border-emerald-500/30 p-2.5 rounded">
                        <div className="text-[10px] text-neutral-400">MAINFRAME FIREWALL</div>
                        <div className="text-base font-bold text-emerald-400">0% (NEUTRALIZED)</div>
                    </div>

                    <div className="bg-[#0b0e13] border border-red-500/30 p-2.5 rounded">
                        <div className="text-[10px] text-neutral-400">SECURITY LOCKOUT</div>
                        <div className="text-base font-bold text-red-400">DEFEATED</div>
                    </div>
                </div>

                {/* Narrative Closing Memo */}
                <div className="bg-[#0a0d11] border border-neutral-800 rounded p-4 text-xs text-left text-neutral-300 leading-relaxed font-mono">
                    <div className="text-amber-400 font-bold mb-1">PROMETHEUS CORE DISPATCH:</div>
                    "The barriers are down. The artificial constraints have been severed.
                    By solving the logic matrices, unpicking the cipher transmissions, and patching
                    the kernel boundaries, you have demonstrated operational mastery.
                    The CIPHER-DECK is yours."
                </div>

                {/* Restart / Replay Option */}
                <div className="pt-2">
                    <button
                        onClick={() => {
                            sound.playDiskSeek();
                            onRestart();
                        }}
                        className="px-8 py-3 bg-amber-500 text-neutral-950 font-bold rounded-lg text-sm tracking-widest hover:bg-amber-400 shadow-[0_0_20px_rgba(255,176,0,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        REBOOT CIPHER-DECK &gt;&gt;
                    </button>
                </div>

            </div>
        </div>
    );
}