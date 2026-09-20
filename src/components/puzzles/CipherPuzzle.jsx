import React, { useState, useMemo } from 'react';
import { ENGLISH_FREQUENCIES } from '../../data/puzzles';
import { sound } from '../../audio/soundSystem';

export default function CipherPuzzle({ puzzle, sector, onSolve, onBack }) {
    const [map, setMap] = useState({});
    const [activeChar, setActiveChar] = useState(null);
    const [hintStep, setHintStep] = useState(0);
    const [notice, setNotice] = useState(null);

    const freqData = useMemo(() => {
        const tally = {};
        let total = 0;
        const text = puzzle.ciphertext.toUpperCase().replace(/[^A-Z]/g, '');

        for (const char of text) {
            tally[char] = (tally[char] || 0) + 1;
            total++;
        }

        const stats = {};
        for (const [k, v] of Object.entries(tally)) {
            stats[k] = {
                count: v,
                percent: ((v / total) * 100).toFixed(1)
            };
        }
        return stats;
    }, [puzzle.ciphertext]);

    const sortedChars = useMemo(() => {
        return Object.keys(freqData).sort((x, y) => freqData[y].count - freqData[x].count);
    }, [freqData]);

    const applyMapping = (cipherLetter, plainLetter) => {
        sound.playKeyClick();
        const upper = plainLetter.toUpperCase();
        if (!upper || /^[A-Z]$/.test(upper)) {
            setMap((prev) => {
                const clone = { ...prev };
                if (!upper) {
                    delete clone[cipherLetter];
                } else {
                    clone[cipherLetter] = upper;
                }
                return clone;
            });
            setNotice(null);
        }
    };

    const handleHint = () => {
        if (hintStep < puzzle.hints.length) {
            const h = puzzle.hints[hintStep];
            applyMapping(h.cipherChar, h.plainChar);
            setHintStep((curr) => curr + 1);
            sound.playDiskSeek();
            sound.playBeep(900, 0.08);
            setNotice({
                type: 'info',
                text: `HINT [${hintStep + 1}/${puzzle.hints.length}]: ${h.cipherChar} -> ${h.plainChar}`
            });
        } else {
            sound.playBeep(400, 0.1);
            setNotice({
                type: 'info',
                text: 'No hints left lol. Try auto-correlate if stuck.'
            });
        }
    };

    const handleAutoMap = () => {
        const completeMap = {};
        for (const [p, c] of Object.entries(puzzle.cipherKey)) {
            completeMap[c] = p;
        }
        setMap(completeMap);
        sound.playDiskSeek();
        sound.playSuccess();
        setNotice({
            type: 'info',
            text: '[OVERRIDE] Auto-mapped all transposition vectors.'
        });
    };

    const handleVerify = () => {
        sound.playDiskSeek();
        const expected = puzzle.plaintext.toUpperCase().replace(/[^A-Z]/g, '');
        let outputStr = '';

        for (const ch of puzzle.ciphertext.toUpperCase()) {
            if (/[A-Z]/.test(ch)) {
                outputStr += map[ch] || '_';
            }
        }

        if (outputStr.includes('_')) {
            sound.playError();
            setNotice({
                type: 'error',
                text: '[INCOMPLETE] Fill in all the blank letters first!'
            });
            return;
        }

        if (outputStr === expected) {
            sound.playSuccess();
            setNotice({
                type: 'success',
                text: '[SUCCESS] Cipher decrypted successfully!'
            });
            setTimeout(() => {
                onSolve();
            }, 1000);
        } else {
            sound.playError();
            setNotice({
                type: 'error',
                text: '[MISMATCH] Decrypted text doesn’t match the target signature.'
            });
        }
    };

    return (
        <div className="space-y-6 font-mono max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/30 pb-3">
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
                        <span className="text-emerald-400 font-bold">{sector.name}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                        CIPHER DECRYPT: {puzzle.title}
                    </h2>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleHint}
                        className="px-3 py-1.5 rounded border border-amber-500/50 text-amber-400 bg-amber-950/30 hover:bg-amber-900/40 text-xs font-bold transition-all cursor-pointer"
                    >
                        HINT ({Math.max(0, puzzle.hints.length - hintStep)} LEFT)
                    </button>
                    <button
                        onClick={handleAutoMap}
                        className="px-3 py-1.5 rounded border border-cyan-500/50 text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/40 text-xs font-bold transition-all cursor-pointer"
                    >
                        AUTO-CORRELATE
                    </button>
                </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-[#121417]/80 p-3 rounded border border-emerald-500/20">
                {puzzle.description}
            </p>

            <div className="bg-[#0e1411] border-2 border-emerald-500/40 rounded-xl p-4 sm:p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] space-y-6">
                <div className="text-xs font-bold text-emerald-400 tracking-wider flex items-center justify-between">
                    <span>[ CIPHERTEXT STREAM ]</span>
                    <span className="text-neutral-400 text-[11px]">CLICK A LETTER OR TYPE BELOW</span>
                </div>

                <div className="bg-[#080d0a] border border-emerald-500/30 rounded-lg p-4 leading-loose overflow-x-auto">
                    <div className="flex flex-wrap gap-x-3 gap-y-4">
                        {puzzle.ciphertext.split(' ').map((wordToken, wIdx) => (
                            <div key={wIdx} className="flex items-center space-x-1">
                                {wordToken.split('').map((charSymbol, cIdx) => {
                                    const upperSymbol = charSymbol.toUpperCase();
                                    const isAlpha = /[A-Z]/.test(upperSymbol);
                                    const resolved = map[upperSymbol];

                                    if (!isAlpha) {
                                        return <span key={cIdx} className="text-neutral-500 font-bold px-0.5">{charSymbol}</span>;
                                    }

                                    return (
                                        <div
                                            key={cIdx}
                                            onClick={() => {
                                                sound.playKeyClick();
                                                setActiveChar(upperSymbol);
                                            }}
                                            className={`flex flex-col items-center cursor-pointer transition-transform ${activeChar === upperSymbol ? 'scale-110' : ''}`}
                                        >
                                            <span className={`text-base sm:text-lg font-bold h-6 flex items-center justify-center ${resolved ? 'text-cyan-300 drop-shadow-[0_0_6px_rgba(0,232,198,0.6)]' : 'text-amber-500/40'}`}>
                                                {resolved || '_'}
                                            </span>
                                            <span className={`text-xs px-1.5 py-0.5 rounded border text-center min-w-[22px] ${activeChar === upperSymbol ? 'border-amber-400 bg-amber-500/30 text-amber-200 font-bold' : resolved ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300' : 'border-neutral-800 bg-neutral-900 text-neutral-400'}`}>
                                                {upperSymbol}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                        <span>KEY MAPPINGS:</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
                        {sortedChars.map((cipherCh) => {
                            const val = map[cipherCh] || '';
                            const fMeta = freqData[cipherCh];
                            const highlighted = activeChar === cipherCh;

                            return (
                                <div
                                    key={cipherCh}
                                    className={`border rounded p-2 text-center transition-all ${highlighted ? 'border-amber-400 bg-amber-950/40' : val ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-neutral-800 bg-[#0d120f]'}`}
                                >
                                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                                        <span className="font-bold text-amber-400">{cipherCh}</span>
                                        <span className="text-neutral-400">{fMeta?.count}x</span>
                                    </div>

                                    <input
                                        type="text"
                                        maxLength={1}
                                        value={val}
                                        onChange={(e) => applyMapping(cipherCh, e.target.value)}
                                        onFocus={() => setActiveChar(cipherCh)}
                                        placeholder="?"
                                        className="w-full text-center bg-[#060a08] border border-emerald-500/30 text-cyan-300 font-bold text-sm py-1 rounded outline-none uppercase focus:border-cyan-400"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="border border-emerald-500/20 rounded-lg p-3 bg-[#0a0f0d] space-y-2">
                    <div className="text-[11px] font-bold text-neutral-400 flex items-center justify-between">
                        <span>FREQUENCY ANALYSIS</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-[10px]">
                        {sortedChars.slice(0, 6).map((ch) => {
                            const itemFreq = freqData[ch];
                            return (
                                <div key={ch} className="bg-neutral-900/60 p-1.5 rounded border border-neutral-800">
                                    <div className="flex justify-between text-neutral-300">
                                        <strong className="text-amber-400">{ch}</strong>
                                        <span>{itemFreq.percent}%</span>
                                    </div>
                                    <div className="w-full bg-neutral-800 h-1 rounded mt-1 overflow-hidden">
                                        <div
                                            className="bg-emerald-400 h-full"
                                            style={{ width: `${Math.min(100, parseFloat(itemFreq.percent) * 6)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {notice && (
                    <div className={`p-2.5 rounded text-xs border font-semibold ${notice.type === 'success' ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' : notice.type === 'error' ? 'border-red-500/50 bg-red-950/30 text-red-300' : 'border-amber-500/50 bg-amber-950/30 text-amber-300'}`}>
                        {notice.text}
                    </div>
                )}

                <div className="pt-2 border-t border-neutral-800 flex justify-end">
                    <button
                        onClick={handleVerify}
                        className="px-6 py-2.5 rounded bg-emerald-500 text-neutral-950 font-bold tracking-wider text-xs sm:text-sm hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer"
                    >
                        VERIFY DECRYPTION &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
}