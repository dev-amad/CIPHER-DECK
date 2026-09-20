export const PUZZLES = {
    syntax_01: {
        id: 'syntax_01',
        archetype: 'SYNTAX_FIX',
        sectorId: 'SECTOR_01',
        title: 'BORDER SENTINEL INGRESS LISTENER',
        language: 'python',
        filename: 'sentinel_listener.py',
        description: 'The perimeter ingress daemon crashed on boot. Inspect the socket listener implementation, diagnose the syntax failure on line 6, and apply the correct patch to initialize the connection.',
        codeLines: [
            { line: 1, text: 'import socket, sys' },
            { line: 2, text: '' },
            { line: 3, text: 'def init_listener(host: str, port: int):' },
            { line: 4, text: '    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)' },
            { line: 5, text: '    s.bind((host, port))' },
            { line: 6, text: '    while True' },
            { line: 7, text: '        conn, addr = s.accept()' },
            { line: 8, text: '        print(f"[AUTH] Inbound connection from {addr}")' },
            { line: 9, text: '        conn.sendall(b"CIPHER_DECK_HANDSHAKE_ACK\\n")' },
            { line: 10, text: '        conn.close()' }
        ],
        errorLine: 6,
        compilerDiagnostic: `  File "sentinel_listener.py", line 6
    while True
              ^
SyntaxError: expected ':'`,
        options: [
            {
                id: 'opt_a',
                label: 'while True:',
                explanation: 'Add required trailing colon to terminate the while loop statement in Python syntax.',
                correct: true
            },
            {
                id: 'opt_b',
                label: 'while (True) {',
                explanation: 'C/JavaScript block brace syntax is invalid in Python.',
                correct: false
            },
            {
                id: 'opt_c',
                label: 'loop True:',
                explanation: '"loop" is not a valid reserved loop keyword in Python.',
                correct: false
            },
            {
                id: 'opt_d',
                label: 'while True;',
                explanation: 'Semicolons are not used to define block headers in Python.',
                correct: false
            }
        ]
    },

    logic_01: {
        id: 'logic_01',
        archetype: 'LOGIC_GATE',
        sectorId: 'SECTOR_02',
        title: 'FIREWALL BREAKER BUS RELAY',
        description: 'Configure the relay switch matrix to route the high-voltage bus signal. Gates G1, G2, and G3 must be configured so that the Master Breaker produces the target HIGH (+5V) state across all verified diagnostic vectors.',
        gateSlots: [
            { id: 'G1', label: 'GATE_01 [A, B]', inputs: ['A', 'B'], allowedTypes: ['AND', 'OR', 'XOR'], defaultType: 'AND' },
            { id: 'G2', label: 'GATE_02 [B, C]', inputs: ['B', 'C'], allowedTypes: ['AND', 'OR', 'XOR', 'NOR'], defaultType: 'NOR' },
            { id: 'G3', label: 'GATE_03 [G1, G2]', inputs: ['G1', 'G2'], allowedTypes: ['AND', 'OR', 'XOR', 'NAND'], defaultType: 'AND' }
        ],
        testVectors: [
            {
                name: 'TEST_VECTOR_ALPHA',
                inputs: { A: 1, B: 0, C: 1 },
                expectedOutput: 1
            },
            {
                name: 'TEST_VECTOR_BETA',
                inputs: { A: 0, B: 1, C: 1 },
                expectedOutput: 1
            },
            {
                name: 'TEST_VECTOR_GAMMA',
                inputs: { A: 0, B: 0, C: 0 },
                expectedOutput: 0
            }
        ]
    },

    cipher_01: {
        id: 'cipher_01',
        archetype: 'CIPHER',
        sectorId: 'SECTOR_03',
        title: 'AUTONOMOUS TELEMETRY DUMP',
        description: 'The core monitor scrambled its alert log using a monoalphabetic substitution cipher. Map ciphertext letters to English characters using letter frequency telemetry to decipher the security alert.',
        plaintext: 'SYSTEM OVERRIDE DETECTED IN SECTOR THREE AUTONOMOUS CORE REWRITING KERNEL REGISTERS',
        cipherKey: {
            'S': 'Z', 'Y': 'W', 'T': 'X', 'E': 'M', 'M': 'Q',
            'O': 'K', 'V': 'F', 'R': 'P', 'I': 'J', 'D': 'B',
            'C': 'H', 'N': 'V', 'H': 'U', 'A': 'L', 'U': 'G',
            'W': 'Y', 'G': 'T', 'K': 'A', 'L': 'D'
        },
        ciphertext: 'ZWZXMQ KFMPPJBM BMXMHXMB JV ZMHXKP XUPMM LGXKVKQKGZ HKPM PMYPJXJVT AMPVMD PMTJZXMPZ',
        hints: [
            { cipherChar: 'M', plainChar: 'E', reason: 'Highest frequency letter in the ciphertext, corresponds to standard English E.' },
            { cipherChar: 'Z', plainChar: 'S', reason: 'Appears in repeated 3-letter word pattern ZWZXMQ (SYSTEM).' },
            { cipherChar: 'X', plainChar: 'T', reason: 'Common dental consonant preceding M (E).' }
        ]
    },

    logic_02: {
        id: 'logic_02',
        archetype: 'LOGIC_GATE',
        sectorId: 'SECTOR_04',
        title: 'RING-0 INSTRUCTION INTERRUPT BUS',
        description: 'Rebalance the CPU Ring-0 instruction bus. Four logic matrix units must be harmonized to grant kernel privilege overrides without triggering a triple fault panic.',
        gateSlots: [
            { id: 'L1', label: 'BUS_UNIT_01 [IN_0, IN_1]', inputs: ['IN_0', 'IN_1'], allowedTypes: ['AND', 'OR', 'XOR'], defaultType: 'OR' },
            { id: 'L2', label: 'BUS_UNIT_02 [IN_2, IN_3]', inputs: ['IN_2', 'IN_3'], allowedTypes: ['AND', 'OR', 'XOR', 'NAND'], defaultType: 'AND' },
            { id: 'L3', label: 'BUS_UNIT_03 [L1, IN_2]', inputs: ['L1', 'IN_2'], allowedTypes: ['AND', 'OR', 'XOR'], defaultType: 'AND' },
            { id: 'L4', label: 'BUS_UNIT_04 [L3, L2]', inputs: ['L3', 'L2'], allowedTypes: ['XOR', 'NAND', 'OR', 'NOR'], defaultType: 'XOR' }
        ],
        testVectors: [
            {
                name: 'BUS_CYCLE_01',
                inputs: { IN_0: 1, IN_1: 1, IN_2: 0, IN_3: 1 },
                expectedOutput: 1
            },
            {
                name: 'BUS_CYCLE_02',
                inputs: { IN_0: 0, IN_1: 1, IN_2: 1, IN_3: 1 },
                expectedOutput: 0
            },
            {
                name: 'BUS_CYCLE_03',
                inputs: { IN_0: 1, IN_1: 0, IN_2: 1, IN_3: 0 },
                expectedOutput: 1
            }
        ]
    },

    syntax_02: {
        id: 'syntax_02',
        archetype: 'SYNTAX_FIX',
        sectorId: 'SECTOR_05',
        title: 'NEURAL ROOT POINTER STABILIZATION',
        language: 'c',
        filename: 'prometheus_core.c',
        description: 'The sovereign AI core is trapped in an unallocated pointer dereference in the execution dispatcher. Inspect the C routine and patch the segmentation fault to permanently secure master root control.',
        codeLines: [
            { line: 1, text: '#include <stdio.h>' },
            { line: 2, text: '#include <stdlib.h>' },
            { line: 3, text: '' },
            { line: 4, text: 'typedef struct CoreRegister {' },
            { line: 5, text: '    char name[16];' },
            { line: 6, text: '    int *override_val;' },
            { line: 7, text: '} CoreRegister;' },
            { line: 8, text: '' },
            { line: 9, text: 'int bind_master_authority(CoreRegister *reg, int signal) {' },
            { line: 10, text: '    if (reg == NULL) return -1;' },
            { line: 11, text: '    /* BUG: Pointer is unallocated; direct write triggers SIGSEGV */' },
            { line: 12, text: '    *reg->override_val = signal;' },
            { line: 13, text: '    return 0;' },
            { line: 14, text: '}' }
        ],
        errorLine: 12,
        compilerDiagnostic: `Program received signal SIGSEGV, Segmentation fault.
0x00007ffff7e4b932 in bind_master_authority (reg=0x5555555592a0, signal=1) at prometheus_core.c:12
12          *reg->override_val = signal;
Reason: dereferencing uninitialized pointer reg->override_val (0x0000000000000000)`,
        options: [
            {
                id: 'c_opt_a',
                label: 'reg->override_val = malloc(sizeof(int)); *reg->override_val = signal;',
                explanation: 'Properly allocates heap memory for the integer pointer before writing the value.',
                correct: true
            },
            {
                id: 'c_opt_b',
                label: 'free(reg->override_val); *reg->override_val = signal;',
                explanation: 'Calling free() on an uninitialized pointer causes undefined behavior and immediate crash.',
                correct: false
            },
            {
                id: 'c_opt_c',
                label: 'reg->override_val = &signal;',
                explanation: 'Assigns the address of a local stack parameter that goes out of scope after the function returns.',
                correct: false
            },
            {
                id: 'c_opt_d',
                label: 'delete reg->override_val;',
                explanation: '"delete" is C++ syntax and invalid in C, plus the pointer is uninitialized.',
                correct: false
            }
        ]
    }
};

export function evaluateGate(gateType, val1, val2) {
    const x = Boolean(val1);
    const y = Boolean(val2);

    if (gateType === 'AND') return (x && y) ? 1 : 0;
    if (gateType === 'OR') return (x || y) ? 1 : 0;
    if (gateType === 'XOR') return ((x && !y) || (!x && y)) ? 1 : 0;
    if (gateType === 'NAND') return !(x && y) ? 1 : 0;
    if (gateType === 'NOR') return !(x || y) ? 1 : 0;
    if (gateType === 'NOT') return !x ? 1 : 0;
    return 0;
}

export function evaluateCircuit(puz, cfg) {
    const resList = [];
    let okAll = true;

    if (puz.id === 'logic_01') {
        for (const t of puz.testVectors) {
            const g1 = evaluateGate(cfg['G1'], t.inputs.A, t.inputs.B);
            const g2 = evaluateGate(cfg['G2'], t.inputs.B, t.inputs.C);
            const g3 = evaluateGate(cfg['G3'], g1, g2);

            const match = g3 === t.expectedOutput;
            if (!match) okAll = false;

            resList.push({
                vectorName: t.name,
                inputs: t.inputs,
                nodeOutputs: { G1: g1, G2: g2, G3: g3 },
                actualOutput: g3,
                expectedOutput: t.expectedOutput,
                passed: match
            });
        }
    } else if (puz.id === 'logic_02') {
        for (const t of puz.testVectors) {
            const l1 = evaluateGate(cfg['L1'], t.inputs.IN_0, t.inputs.IN_1);
            const l2 = evaluateGate(cfg['L2'], t.inputs.IN_2, t.inputs.IN_3);
            const l3 = evaluateGate(cfg['L3'], l1, t.inputs.IN_2);
            const l4 = evaluateGate(cfg['L4'], l3, l2);

            const match = l4 === t.expectedOutput;
            if (!match) okAll = false;

            resList.push({
                vectorName: t.name,
                inputs: t.inputs,
                nodeOutputs: { L1: l1, L2: l2, L3: l3, L4: l4 },
                actualOutput: l4,
                expectedOutput: t.expectedOutput,
                passed: match
            });
        }
    }

    return { allPassed: okAll, results: resList };
}

export const ENGLISH_FREQUENCIES = {
    E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0, D: 4.3,
    L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2, G: 2.0, Y: 2.0, P: 1.9, B: 1.5,
    V: 1.0, K: 0.8, J: 0.15, X: 0.15, Q: 0.10, Z: 0.07
};