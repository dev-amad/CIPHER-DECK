import React, { useState, useEffect } from 'react';
import { sound } from '../audio/soundSystem';

const BIOS_DATA = [
    'CYBER-CORE BIOS v3.12 (C) 1989-1998 CIPHER DYNE CORP.',
    'BIOS DATE: 04/12/98 02:44:11 VER: 08.00.12',
    'CPU: 486-DX4 100MHz CLOCK :: MATH CO-PROCESSOR INSTALLED',
    'CHECKING SYSTEM BUS INTERFACES: [ISA: OK] [PCI: OK] [DMA: OK]',
    'DETECTING PRIMARY MASTER: CYBER-DRIVE 540MB IDE HDD... FOUND',
    'DETECTING FLOPPY DRIVE A: 3.5" 1.44MB DRIVE... ONLINE',
    'INITIALIZING SYSTEM MEMORY ARRAYS...'
];

export default function BootSequence({ onComplete }) {
    const [screenLogs, setScreenLogs] = useState([]);
    const [memCount, setMemCount] = useState(0);
    const [memOk, setMemOk] = useState(false);
    const [booted, setBooted] = useState(false);

    useEffect(() => {
        let i = 0;
        const t = setInterval(() => {
            if (i < BIOS_DATA.length) {
                setScreenLogs(prev => [...prev, BIOS_DATA[i]]);
                sound.playKeyClick();
                i++;
            } else {
                clearInterval(t);
                runMemoryCheck();
            }
        }, 180);

        return () => clearInterval(t);
    }, []);

    const runMemoryCheck = () => {
        let val = 0;
        const maxVal = 16384;
        const chunk = 1024;

        const memTimer = setInterval(() => {
            val += chunk;
            if (val >= maxVal) {
                val = maxVal;
                clearInterval(memTimer);
                setMemCount(val);
                setMemOk(true);
                sound.playBeep(880, 0.12);

                setTimeout(() => {
                    sound.playDiskSeek();
                    setBooted(true);
                }, 300);
            } else {
                setMemCount(val);
                if (val % 2048 === 0) {
                    sound.playKeyClick();
                }
            }
        }, 45);
    };

    const handleStart = () => {
        sound.playDiskSeek();
        sound.playAccessGranted();
        onComplete();
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-amber-400 font-mono p-4 sm:p-8 flex flex-col justify-between select-none">
            <div className="max-w-4xl mx-auto w-full space-y-2 text-xs sm:text-sm">
                <pre className="text-amber-500 font-bold text-[10px] sm:text-xs leading-tight mb-6 text-center sm:text-left drop-shadow-[0_0_8px_rgba(255,176,0,0.5)]">
                    {`
 ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗     ██████╗ ███████╗ ██████╗██╗  ██╗
██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗    ██╔══██╗██╔════╝██╔════╝██║ ██╔╝
██║     ██║██████╔╝███████║█████╗  ██████╔╝█████╗██║  ██║█████╗  ██║     █████╔╝ 
██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗╚════╝██║  ██║██╔══╝  ██║     ██╔═██╗ 
╚██████╗██║██║     ██║  ██║███████╗██║  ██║     ██████╔╝███████╗╚██████╗██║  ██╗
 ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝
`}
                </pre>

                <div className="space-y-1 text-neutral-300">
                    {screenLogs.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <span className="text-amber-500/70">{'>'}</span>
                            <span>{item}</span>
                        </div>
                    ))}

                    {screenLogs.length >= BIOS_DATA.length && (
                        <div className="flex items-center space-x-2 text-cyan-300">
                            <span className="text-amber-500/70">{'>'}</span>
                            <span>
                                CHECKING RAM: <strong className="text-amber-400">{memCount} KB</strong>
                                {memOk && <span className="text-emerald-400 font-bold ml-2">[OK]</span>}
                            </span>
                        </div>
                    )}

                    {memOk && (
                        <div className="pt-2 text-amber-300 space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-amber-500/70">{'>'}</span>
                                <span>SYS IMAGE: CIPHER_DECK_SYS.IMG (READY)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-cyan-300">
                                <span className="text-amber-500/70">{'>'}</span>
                                <span>SECURITY: RESTRICTED ACCESS (TIER 1)</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto w-full pt-8 pb-4 text-center">
                {booted ? (
                    <div className="space-y-4">
                        <div className="text-xs sm:text-sm text-neutral-400 animate-pulse">
                            [ DISK MOUNTED // READY ]
                        </div>
                        <button
                            onClick={handleStart}
                            className="px-8 py-3.5 bg-amber-500 text-neutral-950 font-bold tracking-widest text-sm sm:text-base rounded border-2 border-amber-300 shadow-[0_0_20px_rgba(255,176,0,0.6)] hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                        >
                            INITIALIZE CIPHER-DECK &gt;&gt;
                        </button>
                    </div>
                ) : (
                    <div className="text-xs text-amber-500/60 flex items-center justify-center space-x-2">
                        <span className="animate-spin text-amber-400">/</span>
                        <span>RUNNING HARDWARE DIAGNOSTICS...</span>
                    </div>
                )}
            </div>
        </div>
    );
}