import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../audio/soundSystem';

export default function TerminalShell({ clearanceTier, solvedSectors, sectors, onLaunchSector, onResetTerminal, onToggleSound, soundMuted }) {
    const [logs, setLogs] = useState([
        { type: 'sys', text: 'CIPHER-DECK CLI SHELL [SYSTEM READY]' },
        { type: 'sys', text: 'Type "help" to display operational commands or "status" for sector health.' }
    ]);
    const [input, setInput] = useState('');
    const [pastCmds, setPastCmds] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);

    const bottomRef = useRef(null);
    const boxRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const processCommand = (e) => {
        e.preventDefault();
        const raw = input.trim();
        if (!raw) return;

        sound.playKeyClick();
        const updated = [...logs, { type: 'user', text: `op@deck:~$ ${raw}` }];
        setPastCmds(prev => [...prev, raw]);
        setHistoryIdx(-1);

        const tokens = raw.split(/\s+/);
        const action = tokens[0].toLowerCase();
        arg = tokens[1]?.toLowerCase();
        let arg = tokens[1]?.toLowerCase();

        switch (action) {
            case 'help':
                updated.push({
                    type: 'response',
                    text: `AVAILABLE COMMANDS:\n  help              - Display command reference manual\n  status            - Show clearance tier & compromised sector nodes\n  sectors           - List all network sectors & lock states\n  sector <1-5>      - Breach target sector (e.g. "sector 1")\n  breach <1-5>      - Alias for sector command\n  logs              - View all acquired classified server logfiles\n  cat <filename>    - Read decrypted log file contents\n  scan              - Perform diagnostic scan of subnet\n  sound <on|off>    - Toggle terminal sound effects\n  whoami            - Display current session privilege\n  clear             - Wipe terminal screen buffer\n  reset             - Factory wipe session & reset terminal`
                });
                sound.playBeep(600, 0.05);
                break;

            case 'status':
                updated.push({
                    type: 'response',
                    text: `[SYSTEM STATUS]\nCURRENT CLEARANCE : TIER-${clearanceTier}\nCOMPROMISED NODES : ${solvedSectors.length} / ${sectors.length}\nCURRENT OBJECTIVE : ${solvedSectors.length === sectors.length ? 'ALL NODES OVERRIDDEN. SYSTEM UNLOCKED.' : `BREACH SECTOR 0${solvedSectors.length + 1}`}`
                });
                sound.playBeep(700, 0.05);
                break;

            case 'sectors':
            case 'map': {
                const listStr = sectors.map((s, i) => {
                    const done = solvedSectors.includes(s.id);
                    const open = s.tier <= clearanceTier;
                    const st = done ? '[COMPROMISED]' : open ? '[READY]' : '[LOCKED]';
                    return `  0${i + 1}. [${s.id}] ${s.name.padEnd(22, ' ')} : ${st}`;
                }).join('\n');
                updated.push({ type: 'response', text: `GRID ARCHITECTURE:\n${listStr}` });
                sound.playBeep(750, 0.05);
                break;
            }

            case 'sector':
            case 'breach': {
                const idxNum = parseInt(arg, 10);
                if (!idxNum || idxNum < 1 || idxNum > sectors.length) {
                    updated.push({ type: 'error', text: `[ERROR] Invalid sector index. Usage: sector <1-${sectors.length}>` });
                    sound.playError();
                } else {
                    const target = sectors[idxNum - 1];
                    if (target.tier > clearanceTier) {
                        updated.push({ type: 'error', text: `[ACCESS DENIED] Sector 0${idxNum} requires Tier-${target.tier} clearance. Current: Tier-${clearanceTier}.` });
                        sound.playError();
                    } else {
                        updated.push({ type: 'response', text: `[INITIALIZING INGRESS] Launching interface for ${target.name}...` });
                        sound.playDiskSeek();
                        onLaunchSector(target);
                    }
                }
                break;
            }

            case 'logs': {
                const collected = sectors.filter(s => solvedSectors.includes(s.id)).map(s => `  * ${s.rewardLog.file} (from ${s.name})`);
                if (collected.length === 0) {
                    updated.push({ type: 'response', text: '[LOG STORE EMPTY] Solve security sectors to capture leaked memos.' });
                } else {
                    updated.push({ type: 'response', text: `DECRYPTED LOG ARCHIVE:\n${collected.join('\n')}\nUse "cat <filename>" to view contents.` });
                }
                sound.playBeep(700, 0.05);
                break;
            }

            case 'cat': {
                if (!arg) {
                    updated.push({ type: 'error', text: '[ERROR] Missing argument. Usage: cat <filename>' });
                    sound.playError();
                    break;
                }
                const match = sectors.find(s => s.rewardLog.file.toLowerCase() === arg && solvedSectors.includes(s.id));
                if (!match) {
                    updated.push({ type: 'error', text: `[FILE NOT FOUND] "${arg}" is not decrypted or does not exist.` });
                    sound.playError();
                } else {
                    updated.push({ type: 'response', text: `--- BEGIN FILE: ${match.rewardLog.file} ---\nDATE: ${match.rewardLog.timestamp}\nAUTHOR: ${match.rewardLog.author}\n\n${match.rewardLog.content}\n--- END OF FILE ---` });
                    sound.playDiskSeek();
                }
                break;
            }

            case 'scan':
                updated.push({
                    type: 'response',
                    text: `[PROBING SUBNET 10.244.18.0/24]\nDiscovered ports:\n - 8080/tcp  [OPEN]  (SECTOR_01 :: SENTINEL)\n - 443/tcp   [FIREWALL] (SECTOR_02 :: RELAY_BUS)\n - 2222/tcp  [ENCRYPTED] (SECTOR_03 :: CRYPT_VAULT)\n - 0x21/bus  [PROTECTED] (SECTOR_04 :: KERNEL)\n - 0xFF/bus  [BLACK_ICE] (SECTOR_05 :: PROMETHEUS)`
                });
                sound.playBeep(850, 0.08);
                break;

            case 'whoami':
                updated.push({ type: 'response', text: `UID=0(deck_runner) GID=0(root) PRIVILEGE=TIER_${clearanceTier}` });
                sound.playBeep(600, 0.04);
                break;

            case 'sound':
                if (arg === 'on') {
                    if (soundMuted) onToggleSound();
                    updated.push({ type: 'response', text: 'Audio synthesized output ENABLED.' });
                } else if (arg === 'off') {
                    if (!soundMuted) onToggleSound();
                    updated.push({ type: 'response', text: 'Audio synthesized output MUTED.' });
                } else {
                    updated.push({ type: 'response', text: `Sound is currently ${soundMuted ? 'MUTED' : 'ENABLED'}. Use "sound on" or "sound off".` });
                }
                break;

            case 'clear':
                setLogs([]);
                setInput('');
                return;

            case 'reset':
                updated.push({ type: 'error', text: '[SYSTEM WIPE] Executing factory reset...' });
                onResetTerminal();
                break;

            default:
                updated.push({ type: 'error', text: `Command not recognized: "${raw}". Type "help" for a list of commands.` });
                sound.playError();
                break;
        }

        setLogs(updated);
        setInput('');
    };

    const handleKeyNav = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (pastCmds.length === 0) return;
            const idx = historyIdx === -1 ? pastCmds.length - 1 : Math.max(0, historyIdx - 1);
            setHistoryIdx(idx);
            setInput(pastCmds[idx]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx === -1) return;
            const idx = historyIdx + 1;
            if (idx >= pastCmds.length) {
                setHistoryIdx(-1);
                setInput('');
            } else {
                setHistoryIdx(idx);
                setInput(pastCmds[idx]);
            }
        }
    };

    return (
        <div
            className="bg-[#121417]/90 border border-amber-500/30 rounded-lg p-3 sm:p-4 font-mono text-xs flex flex-col h-[320px] sm:h-[380px] shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-text"
            onClick={() => boxRef.current?.focus()}
        >
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2 text-neutral-400 text-[11px]">
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span className="text-amber-400 font-semibold tracking-wider">TERMINAL CLI EMULATOR</span>
                </div>
                <span>SHELL: /bin/cdeck</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-amber-500/30">
                {logs.map((item, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                        {item.type === 'user' && <span className="text-cyan-300 font-bold">{item.text}</span>}
                        {item.type === 'sys' && <span className="text-neutral-400">{item.text}</span>}
                        {item.type === 'response' && <span className="text-amber-300/90">{item.text}</span>}
                        {item.type === 'error' && <span className="text-red-400 font-semibold">{item.text}</span>}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={processCommand} className="mt-2 pt-2 border-t border-amber-500/20 flex items-center space-x-2">
                <span className="text-cyan-400 font-bold text-xs select-none">op@deck:~$</span>
                <input
                    ref={boxRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                        sound.playKeyClick();
                        setInput(e.target.value);
                    }}
                    onKeyDown={handleKeyNav}
                    placeholder="Type command ('help', 'sector 1')..."
                    className="flex-1 bg-transparent text-amber-400 outline-none border-none font-mono text-xs placeholder:text-neutral-600 caret-amber-400"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                />
            </form>
        </div>
    );
}