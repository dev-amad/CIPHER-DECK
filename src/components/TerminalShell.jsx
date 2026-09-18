import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../audio/soundSystem';

export default function TerminalShell({
    clearanceTier,
    solvedSectors,
    sectors,
    onLaunchSector,
    onResetTerminal,
    onToggleSound,
    soundMuted
}) {
    const [history, setHistory] = useState([
        { type: 'sys', text: 'CIPHER-DECK CLI SHELL [SYSTEM READY]' },
        { type: 'sys', text: 'Type "help" to display operational commands or "status" for sector health.' }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const terminalEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const rawCmd = inputVal.trim();
        if (!rawCmd) return;

        sound.playKeyClick();
        const newHistory = [...history, { type: 'user', text: `op@deck:~$ ${rawCmd}` }];
        setCmdHistory((prev) => [...prev, rawCmd]);
        setHistoryIndex(-1);

        const parts = rawCmd.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const arg = parts[1]?.toLowerCase();

        switch (cmd) {
            case 'help':
                newHistory.push({
                    type: 'response',
                    text: `AVAILABLE COMMANDS:
  help               - Display command reference manual
  status             - Show clearance tier & compromised sector nodes
  sectors            - List all network sectors & lock states
  sector <1-5>       - Breach target sector (e.g. "sector 1")
  breach <1-5>       - Alias for sector command
  logs               - View all acquired classified server logfiles
  cat <filename>     - Read decrypted log file contents
  scan               - Perform diagnostic scan of subnet
  sound <on|off>     - Toggle terminal sound effects
  whoami             - Display current session privilege
  clear              - Wipe terminal screen buffer
  reset              - Factory wipe session & reset terminal`
                });
                sound.playBeep(600, 0.05);
                break;

            case 'status':
                newHistory.push({
                    type: 'response',
                    text: `[SYSTEM STATUS]
CURRENT CLEARANCE : TIER-${clearanceTier}
COMPROMISED NODES : ${solvedSectors.length} / ${sectors.length}
CURRENT OBJECTIVE : ${solvedSectors.length === sectors.length
                            ? 'ALL NODES OVERRIDDEN. SYSTEM UNLOCKED.'
                            : `BREACH SECTOR 0${solvedSectors.length + 1}`
                        }`
                });
                sound.playBeep(700, 0.05);
                break;

            case 'sectors':
            case 'map':
                const sectorList = sectors
                    .map((s, idx) => {
                        const isSolved = solvedSectors.includes(s.id);
                        const isUnlocked = s.tier <= clearanceTier;
                        const status = isSolved ? '[COMPROMISED]' : isUnlocked ? '[READY]' : '[LOCKED]';
                        return `  0${idx + 1}. [${s.id}] ${s.name.padEnd(22, ' ')} : ${status}`;
                    })
                    .join('\n');
                newHistory.push({
                    type: 'response',
                    text: `GRID ARCHITECTURE:\n${sectorList}`
                });
                sound.playBeep(750, 0.05);
                break;

            case 'sector':
            case 'breach': {
                const num = parseInt(arg, 10);
                if (!num || num < 1 || num > sectors.length) {
                    newHistory.push({
                        type: 'error',
                        text: `[ERROR] Invalid sector index. Usage: sector <1-${sectors.length}>`
                    });
                    sound.playError();
                } else {
                    const targetSector = sectors[num - 1];
                    if (targetSector.tier > clearanceTier) {
                        newHistory.push({
                            type: 'error',
                            text: `[ACCESS DENIED] Sector 0${num} requires Tier-${targetSector.tier} clearance. Current: Tier-${clearanceTier}.`
                        });
                        sound.playError();
                    } else {
                        newHistory.push({
                            type: 'response',
                            text: `[INITIALIZING INGRESS] Launching interface for ${targetSector.name}...`
                        });
                        sound.playDiskSeek();
                        onLaunchSector(targetSector);
                    }
                }
                break;
            }

            case 'logs': {
                const availableLogs = sectors
                    .filter((s) => solvedSectors.includes(s.id))
                    .map((s) => `  * ${s.rewardLog.file} (from ${s.name})`);

                if (availableLogs.length === 0) {
                    newHistory.push({
                        type: 'response',
                        text: '[LOG STORE EMPTY] Solve security sectors to capture leaked memos.'
                    });
                } else {
                    newHistory.push({
                        type: 'response',
                        text: `DECRYPTED LOG ARCHIVE:\n${availableLogs.join('\n')}\nUse "cat <filename>" to view contents.`
                    });
                }
                sound.playBeep(700, 0.05);
                break;
            }

            case 'cat': {
                if (!arg) {
                    newHistory.push({
                        type: 'error',
                        text: '[ERROR] Missing argument. Usage: cat <filename>'
                    });
                    sound.playError();
                    break;
                }
                const found = sectors.find(
                    (s) => s.rewardLog.file.toLowerCase() === arg && solvedSectors.includes(s.id)
                );
                if (!found) {
                    newHistory.push({
                        type: 'error',
                        text: `[FILE NOT FOUND] "${arg}" is not decrypted or does not exist.`
                    });
                    sound.playError();
                } else {
                    newHistory.push({
                        type: 'response',
                        text: `--- BEGIN FILE: ${found.rewardLog.file} ---\nDATE: ${found.rewardLog.timestamp}\nAUTHOR: ${found.rewardLog.author}\n\n${found.rewardLog.content}\n--- END OF FILE ---`
                    });
                    sound.playDiskSeek();
                }
                break;
            }

            case 'scan':
                newHistory.push({
                    type: 'response',
                    text: `[PROBING SUBNET 10.244.18.0/24]
Discovered ports:
  - 8080/tcp  [OPEN]  (SECTOR_01 :: SENTINEL)
  - 443/tcp   [FIREWALL] (SECTOR_02 :: RELAY_BUS)
  - 2222/tcp  [ENCRYPTED] (SECTOR_03 :: CRYPT_VAULT)
  - 0x21/bus  [PROTECTED] (SECTOR_04 :: KERNEL)
  - 0xFF/bus  [BLACK_ICE] (SECTOR_05 :: PROMETHEUS)`
                });
                sound.playBeep(850, 0.08);
                break;

            case 'whoami':
                newHistory.push({
                    type: 'response',
                    text: `UID=0(deck_runner) GID=0(root) PRIVILEGE=TIER_${clearanceTier}`
                });
                sound.playBeep(600, 0.04);
                break;

            case 'sound':
                if (arg === 'on') {
                    if (soundMuted) onToggleSound();
                    newHistory.push({ type: 'response', text: 'Audio synthesized output ENABLED.' });
                } else if (arg === 'off') {
                    if (!soundMuted) onToggleSound();
                    newHistory.push({ type: 'response', text: 'Audio synthesized output MUTED.' });
                } else {
                    newHistory.push({
                        type: 'response',
                        text: `Sound is currently ${soundMuted ? 'MUTED' : 'ENABLED'}. Use "sound on" or "sound off".`
                    });
                }
                break;

            case 'clear':
                setHistory([]);
                setInputVal('');
                return;

            case 'reset':
                newHistory.push({ type: 'error', text: '[SYSTEM WIPE] Executing factory reset...' });
                onResetTerminal();
                break;

            default:
                newHistory.push({
                    type: 'error',
                    text: `Command not recognized: "${rawCmd}". Type "help" for a list of commands.`
                });
                sound.playError();
                break;
        }

        setHistory(newHistory);
        setInputVal('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length === 0) return;
            const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(nextIdx);
            setInputVal(cmdHistory[nextIdx]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex === -1) return;
            const nextIdx = historyIndex + 1;
            if (nextIdx >= cmdHistory.length) {
                setHistoryIndex(-1);
                setInputVal('');
            } else {
                setHistoryIndex(nextIdx);
                setInputVal(cmdHistory[nextIdx]);
            }
        }
    };

    return (
        <div
            className="bg-[#121417]/90 border border-amber-500/30 rounded-lg p-3 sm:p-4 font-mono text-xs flex flex-col h-[320px] sm:h-[380px] shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-text"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2 text-neutral-400 text-[11px]">
                <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                    <span className="text-amber-400 font-semibold tracking-wider">TERMINAL CLI EMULATOR</span>
                </div>
                <span>SHELL: /bin/cdeck</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-amber-500/30">
                {history.map((item, idx) => (
                    <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                        {item.type === 'user' && (
                            <span className="text-cyan-300 font-bold">{item.text}</span>
                        )}
                        {item.type === 'sys' && (
                            <span className="text-neutral-400">{item.text}</span>
                        )}
                        {item.type === 'response' && (
                            <span className="text-amber-300/90">{item.text}</span>
                        )}
                        {item.type === 'error' && (
                            <span className="text-red-400 font-semibold">{item.text}</span>
                        )}
                    </div>
                ))}
                <div ref={terminalEndRef} />
            </div>

            <form onSubmit={handleCommandSubmit} className="mt-2 pt-2 border-t border-amber-500/20 flex items-center space-x-2">
                <span className="text-cyan-400 font-bold text-xs select-none">op@deck:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={(e) => {
                        sound.playKeyClick();
                        setInputVal(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
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
