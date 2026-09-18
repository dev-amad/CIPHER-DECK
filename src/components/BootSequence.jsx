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

    const handleBoot = () => {
        sound.playDiskSeek();
        sound.playAccessGranted();
        onComplete();
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-amber-400 font-mono p-4 sm:p-8 flex flex-col justify-between select-none">
            <div className="max-w-4xl mx-auto w-full space-y-2 text-xs sm:text-sm">
                {/* Header Art */}
                <pre className="text-amber-500 font-bold text-[10px] sm:text-xs leading-tight mb-6 text-center sm:text-left drop-shadow-[0_0_8px_rgba(255,176,0,0.5)]">
                    {`
  ██████╗██╗██████╗ ██╗  ██╗███████╗██████╗       ██████╗ ███████╗ ██████╗██╗  ██╗
 ██╔════╝██║██╔══██╗██║  ██║██╔════╝██╔══██╗      ██╔══██╗██╔════╝██╔════╝██║ ██╔╝
 ██║     ██║██████╔╝███████║█████╗  ██████╔╝█████╗██║  ██║█████╗  ██║     █████╔╝ 
 ██║     ██║██╔═══╝ ██╔══██║██╔══╝  ██╔══██╗╚════╝██║  ██║██╔══╝  ██║     ██╔═██╗ 
 ╚██████╗██║██║     ██║  ██║███████╗██║  ██║      ██████╔╝███████╗╚██████╗██║  ██╗
  ╚═════╝╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝      ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝
`}
                </pre>

                {/* BIOS Log Lines */}
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
                                CHECKING BASE & EXTENDED RAM: <strong className="text-amber-400">{ramCounter} KB</strong>
                                {ramDone && <span className="text-emerald-400 font-bold ml-2">[OK]</span>}
                            </span>
                        </div>
                    )}

                    {ramDone && (
                        <div className="pt-2 text-amber-300 animate-fade-in space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-amber-500/70">{'>'}</span>
                                <span>SYSTEM IMAGE: CIPHER_DECK_SYS_DISK.IMG (SECTORS 01-05 READY)</span>
                            </div>
                            <div className="flex items-center space-x-2 text-cyan-300">
                                <span className="text-amber-500/70">{'>'}</span>
                                <span>SECURITY PROTOCOL: RESTRICTED ACCESS (TIER 1 REQUIRED)</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Prompt */}
            <div className="max-w-4xl mx-auto w-full pt-8 pb-4 text-center">
                {readyToLaunch ? (
                    <div className="space-y-4">
                        <div className="text-xs sm:text-sm text-neutral-400 animate-pulse">
                            [ FLOPPY DISK MOUNTED // READY TO EXECUTE TACTICAL DECK ]
                        </div>
                        <button
                            onClick={handleBoot}
                            className="px-8 py-3.5 bg-amber-500 text-neutral-950 font-bold tracking-widest text-sm sm:text-base rounded border-2 border-amber-300 shadow-[0_0_20px_rgba(255,176,0,0.6)] hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                        >
                            INITIALIZE CIPHER-DECK &gt;&gt;
                        </button>
                        <div className="text-[11px] text-neutral-500">
                            PRESS BUTTON TO COMMENCE SESSION
                        </div>
                    </div>
                ) : (
                    <div className="text-xs text-amber-500/60 flex items-center justify-center space-x-2">
                        <span className="animate-spin text-amber-400">/</span>
                        <span>SYSTEM HARDWARE DIAGNOSTIC IN PROGRESS...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
