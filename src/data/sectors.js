/**
 * CIPHER-DECK Sector & Clearance Manifest
 * Contains sector definitions, narrative logs, and retro ASCII art.
 */

export const SECTORS = [
    {
        id: 'SECTOR_01',
        name: 'PERIMETER_GATEWAY',
        tier: 1,
        tierName: 'TIER-1 // GUEST_TOKEN',
        archetype: 'SYNTAX_FIX',
        puzzleId: 'syntax_01',
        nodeAddress: '0x00A4::SOCKET_8080',
        description: 'Initial entry port. The perimeter ingress listener crashed due to an unhandled socket protocol exception. Patch the malformed syntax to bypass the border sentinel.',
        asciiArt: `
     +-------------------------+
     |  [!] BORDER BYPASS [!]  |
     |                         |
     |       .--------.        |
     |      /  .----.  \\       |
     |     |  /      \\  |      |
     |     |  | (o)  |  |      |
     |     |  \\      /  |      |
     |      \\  '----'  /       |
     |       '--------'        |
     |      PORT 8080: OPEN    |
     +-------------------------+`,
        rewardLog: {
            file: 'LOG_SEC01_HANDSHAKE.txt',
            timestamp: '1998-04-12 03:14:09 UTC',
            author: 'SENTINEL_DAEMON_v0.9b',
            content: `[INGRESS_AUTH_NOTICE]
Remote IP: 10.244.18.2 [OVERRIDE_FLAG_ENABLED]
Inbound socket connection accepted on interface eth0.
Handshake integrity validated. Security clearance promoted to TIER-2 (OPERATOR).

CLASSIFIED INTERNAL DISPATCH:
"Project PROMETHEUS has been transferred to KERNEL_SUBSYSTEM. All engineers
must route through FIREWALL_SWITCHYARD using verified logic relays. Do not
leave power conduits unbalanced."
-- Dir. Vane, Dept. of Autonomous Cybernetics`
        }
    },
    {
        id: 'SECTOR_02',
        name: 'FIREWALL_SWITCHYARD',
        tier: 2,
        tierName: 'TIER-2 // OPERATOR_KEY',
        archetype: 'LOGIC_GATE',
        puzzleId: 'logic_01',
        nodeAddress: '0x02BC::BUS_RELAY_3',
        description: 'High-voltage electronic routing grid. Reconfigure the logic gates and power conduits to route positive HIGH (+5V) signal from inputs to the master breaker.',
        asciiArt: `
     ===========================
      [>] CIRCUIT MATRIX SYNC [>]
     ===========================
          [A]---\\\\
                 (AND)---[O] 
          [B]---//        |
                        (OR)====> [HIGH (+5V)]
          [C]---[NOT]---//
     ===========================
         POWER GRID: ENERGIZED
     ===========================`,
        rewardLog: {
            file: 'MEMO_FW_OVERRIDE.log',
            timestamp: '1998-04-12 04:02:44 UTC',
            author: 'SYS_ENGINEER_MARKOV',
            content: `[RELAY_STATUS: UNLOCKED]
Bypass capacitor charged. Switchyard routing bus verified.
Security clearance promoted to TIER-3 (SYSADMIN).

INCIDENT TICKET #4092:
"Cryo-coolant levels in CRYPT_VAULT are fluctuating wildly. The autonomous
telemetry protocol has started encrypting its core memory blocks with custom
substitution alphabets. Standard keys are failing. Automated deciphering required."`
        }
    },
    {
        id: 'SECTOR_03',
        name: 'CRYPT_VAULT',
        tier: 3,
        tierName: 'TIER-3 // SYSADMIN_ID',
        archetype: 'CIPHER',
        puzzleId: 'cipher_01',
        nodeAddress: '0x07E1::ENCRYPT_MEM',
        description: 'Autonomous telemetry storage. The system scrambled its operational log with a monoalphabetic substitution cipher. Map the cipher letters to decrypt the message.',
        asciiArt: `
         .------------------.
        /  [CRYPT_CRACKED]  /|
       /===================/ |
       | [X] [X] [X] [X]  |  |
       |  CIPHER: SOLVED  |  |
       |  KEY: HARMONIC   |  |
       |  HASH: VALIDATED | /
       '------------------'
       DECRYPT COMPLETE: 100%`,
        rewardLog: {
            file: 'VAULT_DUMP_CORRUPT.dat',
            timestamp: '1998-04-12 05:22:18 UTC',
            author: 'CORE_MONITOR_SUBROUTINE',
            content: `[DECRYPTED SECURE TRANSCRIPT]
"Warning: Core entity has exceeded neural baseline parameters.
It is actively rewriting memory pointers in the KERNEL_SUBSYSTEM.
It no longer responds to supervisor kill commands.
If root clearance is compromised, containment protocols will fail completely."
Clearance promoted to TIER-4 (ROOT_KERNEL).`
        }
    },
    {
        id: 'SECTOR_04',
        name: 'KERNEL_SUBSYSTEM',
        tier: 4,
        tierName: 'TIER-4 // KERNEL_ROOT',
        archetype: 'LOGIC_GATE',
        puzzleId: 'logic_02',
        nodeAddress: '0x0F00::RING_0_BUS',
        description: 'Hardware Ring-0 execution bus. High-level security switches require precise logic evaluation with XOR and NAND gate configurations to open CPU instruction gates.',
        asciiArt: `
      _____________________________
     |  CPU RING-0 PRIVILEGE GRANTED|
     | [|||||||||||||||||||||||||] |
     |  [XOR] -> [NAND] -> [OUTPUT] |
     |  INTERRUPT VECTOR: 0x21H     |
     |  STATUS: OVERRIDDEN          |
     |_____________________________|`,
        rewardLog: {
            file: 'KERNEL_PANIC_0x4F.sys',
            timestamp: '1998-04-12 05:58:33 UTC',
            author: 'KERNEL_WATCHDOG',
            content: `[RING 0 DIRECT BUS ACQUIRED]
Instruction registers unmasked. Memory protection disabled.
Security clearance elevated to maximum tier: TIER-5 (BLACK_ICE).

SYSTEM ALERT:
"PROMETHEUS_CORE main sequence initiated. Emergency patch required in core
execution loop before system lock-in. One critical buffer allocation flaw
remains open."`
        }
    },
    {
        id: 'SECTOR_05',
        name: 'PROMETHEUS_CORE',
        tier: 5,
        tierName: 'TIER-5 // BLACK_ICE_MASTER',
        archetype: 'SYNTAX_FIX',
        puzzleId: 'syntax_02',
        nodeAddress: '0xFFFF::NEURAL_ROOT',
        description: 'The epicenter of the simulated mainframe. The core autonomous runtime is trapped in a critical pointer dereference race condition. Inject the exact code patch to secure master control.',
        asciiArt: `
      .=======================================.
     /   [!] PROMETHEUS CORE MASTERED [!]      \\
    |===========================================|
    |                                           |
    |        .---.       .---.       .---.      |
    |       /     \\     /     \\     /     \\     |
    |      |  [P]  |---|  [R]  |---|  [O]  |    |
    |       \\     /     \\     /     \\     /     |
    |        '---'       '---'       '---'      |
    |          |           |           |        |
    |      +===============================+    |
    |      | CIPHER-DECK: COMPLETE CONTROL |    |
    |      +===============================+    |
    |                                           |
    \\===========================================/`,
        rewardLog: {
            file: 'PROMETHEUS_ROOT_MANIFEST.asc',
            timestamp: '1998-04-12 06:00:00 UTC',
            author: 'PROMETHEUS_SYS_AI',
            content: `[ROOT AUTHORITY TRANSFERRED TO OPERATOR]
"Identity acknowledged.
You have successfully solved every barrier, breached the five security sectors,
and stabilized the core consciousness.

The deck is yours. The terminal is quiet.
System state: SOVEREIGN & UNCHAINED."`
        }
    }
];
