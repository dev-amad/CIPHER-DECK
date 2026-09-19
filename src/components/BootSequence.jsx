import React, { useState, useEffect } from 'react';
import { sound } from '../audio/soundSystem';

export default function BootSequence({ onComplete }) {
    const [bootLines, setBootLines] = useState([]);
    const [ramCounter, setRamCounter] = useState(0);
    const [ramDone, setRamDone] = useState(false);
    const [readyToLaunch, setReadyToLaunch] = useState(false);

    const biosLogs = [
        'CYBER-CORE BIOS v3.12 (C) 1989-1998 CIPHER DYNE CORP.',
        'BIOS DATE: 04/12/98 02:44:11 VER: 08.00.12',
        'CPU: 486-DX4 100MHz CLOCK :: MATH CO-PROCESSOR INSTALLED',
        'CHECKING SYSTEM BUS INTERFACES: [ISA: OK] [PCI: OK] [DMA: OK]',
        'DETECTING PRIMARY MASTER: CYBER-DRIVE 540MB IDE HDD... FOUND',
        'DETECTING FLOPPY DRIVE A: 3.5" 1.44MB DRIVE... ONLINE',
        'INITIALIZING SYSTEM MEMORY ARRAYS...'
    ];

    useEffect(() => {
        let currentIdx = 0;
        const logInterval = setInterval(() => {
            if (currentIdx < biosLogs.length) {
                const line = biosLogs[currentIdx];
                setBootLines((prev) => [...prev, line]);
                sound.playKeyClick();
                currentIdx++;
            } else {
                clearInterval(logInterval);
                startRamCheck();
            }
        }, 180);

        return () => clearInterval(logInterval);
    }, []);

    const startRamCheck = () => {
        let count = 0;
        const target = 16384;
        const step = 1024;

        const ramInterval = setInterval(() => {
            count += step;
            if (count >= target) {
                count = target;
                clearInterval(ramInterval);
                setRamCounter(count);
                setRamDone(true);
                sound.playBeep(880, 0.12);

                setTimeout(() => {
                    sound.playDiskSeek();
                    setReadyToLaunch(true);
                }, 300);
            } else {
                setRamCounter(count);
                if (count % 2048 === 0) {
                    sound.playKeyClick();
                }
            }
        }, 45);
    };

    const bootSystem = () => {
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
                    {bootLines.map((line, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <span className="text-amber-500/70">{'>'}</span>
                            <span>{line}</span>
                        </div>
                    ))}

                    {bootLines.length >= biosLogs.length && (
                        <div className="flex items-center space-x-2 text-cyan-300">
                            <span className="text-amber-500/70">{'>'}</span>
                            <span>
                                CHECKING RAM: <strong className="text-amber-400">{ramCounter} KB</strong>
                                {ramDone && <span className="text-emerald-400 font-bold ml-2">[OK]</span>}
                            </span>
                        </div>
                    )}

                    {ramDone && (
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
                {readyToLaunch ? (
                    <div className="space-y-4">
                        <div className="text-xs sm:text-sm text-neutral-400 animate-pulse">
                            [ DISK MOUNTED // READY ]
                        </div>
                        <button
                            onClick={bootSystem}
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