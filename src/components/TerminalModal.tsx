import React, { useState, useEffect, useRef } from 'react';
import { TerminalEntry } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { BADGES_DATA, CERTIFICATIONS_DATA } from '../data/portfolioData';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCtf: () => void;
}

const ALL_COMMANDS = [
  'help',
  'menu',
  'about',
  'skills',
  'projects',
  'certs',
  'badges',
  'sysinfo',
  'nmap',
  'hashid',
  'encode',
  'decode',
  'ping',
  'vulnscan',
  'cat',
  'ls',
  'banner',
  'theme',
  'ctf',
  'matrix',
  'whoami',
  'date',
  'contact',
  'echo',
  'clear',
  'sudo',
  'exit',
];

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  onOpenCtf,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalEntry[]>([
    { id: '1', type: 'info', text: 'LABIB B. SHAHED // INTERACTIVE SEC_OPS BASH SHELL [v4.5.0]' },
    { id: '2', type: 'teal', text: 'Type "help" or "menu" to view available tactical commands.\nPress [TAB] for autocompletion | Use ↑ / ↓ for command history.' },
    { id: '3', type: 'input', text: 'whoami' },
    { id: '4', type: 'success', text: 'labib@sec-node-01 [DEFCON 5 CLEARANCE: TS/SCI]' },
  ]);

  const [cmdHistory, setCmdHistory] = useState<string[]>(['whoami']);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [terminalTheme, setTerminalTheme] = useState<'cyan' | 'green' | 'amber' | 'matrix'>('cyan');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    soundEngine.play('terminal_key');

    // Add to cmd history stack
    setCmdHistory((prev) => [...prev, cmd]);
    setHistoryIdx(-1);

    const newHistory = [...history, { id: Date.now().toString(), type: 'input' as const, text: `$ ${cmd}` }];
    const parts = cmd.split(' ').filter(Boolean);
    const baseCmd = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    switch (baseCmd) {
      case 'help':
      case 'menu':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'teal',
          text: `===================================================================
LABIB B. SHAHED // SEC_OPS TACTICAL SHELL MANUAL
===================================================================
CORE COMMANDS:
  help / menu    - Display this manual
  about          - Personnel dossier & architecture specializations
  skills         - Offensive & defensive technical arsenal
  projects       - Casefiles & security open-source repositories
  certs          - Professional certifications summary
  badges         - Verified Credly digital badges list
  sysinfo        - System kernel specs, active eBPF hooks & memory load
  whoami         - Active session identity & clearance level

SECURITY TOOLS:
  nmap [target]  - Port scanner (e.g. "nmap 10.0.0.1" or "nmap google.com")
  vulnscan [host]- CVE vulnerability scanner & mitigation reports
  hashid <hash>  - Cryptographic hash identification utility
  encode <type>  - Base64 / Hex text encoder (e.g. "encode base64 text")
  decode <type>  - Base64 / Hex text decoder (e.g. "decode base64 U2VjT3Bz")
  ping <target>  - ICMP network latency probe

FILESYSTEM & CONTROL:
  ls             - List directory contents
  cat <file>     - Display virtual file content (e.g. "cat dossier.txt")
  banner         - Display terminal ASCII banner
  theme <color>  - Set text theme color (cyan, green, amber, matrix)
  ctf            - Launch CTF Decrypt Challenge
  matrix         - Toggle background binary rain stream
  echo <text>    - Echo input string
  clear          - Clear terminal buffer
  exit           - Terminate terminal session`,
        });
        break;

      case 'about':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: `[PERSONNEL DOSSIER]
Name: Labib B. Shahed
Role: Principal Security Architect & Lead Engineer
Specializations: Zero-Trust Platforms, Memory Forensics (Volatility 3), EDR Evasion, Kernel Rootkit Analysis, High-Throughput Microservices.
Clearance: Top Secret / SCI (Simulated)`,
        });
        break;

      case 'skills':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'success',
          text: `TECHNICAL ARSENAL & PROFICIENCY MATRIX:
[+] Offensive Sec & Exploit Dev    [98%] (Metasploit, Burp Suite Pro, Ghidra)
[+] Digital Forensics & IR         [97%] (Volatility 3, Autopsy, FTK, Wireshark)
[+] Cloud & Container Security     [96%] (Kubernetes, RedHat OpenShift, AWS Sec)
[+] Full-Stack Systems & APIs      [98%] (TypeScript, React, Node.js, Go, Rust)
[+] Applied Cryptography & ZK      [96%] (Post-Quantum Crypto, WebAuthn/Passkeys)
[+] Network Defense & Firewalls    [97%] (Fortinet FortiGate, eBPF Packet Filtering)`,
        });
        break;

      case 'projects':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: `ACTIVE CASEFILES & OPEN SOURCE REPOSITORIES:
[01] CASE-091: Spectre-X — Volatility 3 RAM Forensics & Kernel Rootkit Detector
[02] CASE-084: AegisGuard — WebAuthn & Passkey Zero-Trust Identity Engine
[03] CASE-078: Vortex-Fuzz — 100k req/sec HTTP/2 Async Rust Fuzzer
[04] CASE-065: CipherTrace — Ransomware eBPF Detonation & Telemetry Chamber`,
        });
        break;

      case 'certs':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'amber',
          text: `VERIFIED PROFESSIONAL CERTIFICATIONS (${CERTIFICATIONS_DATA.length}):
${CERTIFICATIONS_DATA.map(
  (c, i) => `[${(i + 1).toString().padStart(2, '0')}] ${c.title} — ${c.issuer} (${c.status || 'VERIFIED'})`
).join('\n')}`,
        });
        break;

      case 'badges':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'amber',
          text: `VERIFIED DIGITAL BADGES (${BADGES_DATA.length}):
${BADGES_DATA.map(
  (b, i) => `[${(i + 1).toString().padStart(2, '0')}] ${b.title} (${b.issuer}) | Date: ${b.issueDate} | ID: ${b.credentialId}`
).join('\n')}`,
        });
        break;

      case 'sysinfo':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'teal',
          text: `SYSTEM ARCHITECTURE & OPERATIONAL METRICS:
OS Kernel  : Linux 6.8.0-sec-hardened x86_64
Host Node  : sec-node-01.internal
CPU Core   : 16x Intel Xeon Platinum 8375C @ 2.80GHz
RAM Usage  : 4,096 MB / 32,768 MB (12.5% load)
eBPF Probes: 14 active kernel tracepoints
Uptime     : 42 days, 13 hours, 07 mins
Firewall   : FortiGate 7.6 Virtual Fabric [STRICT FILTERING ACTIVE]`,
        });
        break;

      case 'whoami':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'success',
          text: 'labib@sec-node-01 [UID: 0001, GID: 0001 - TS/SCI SEC_OPS MASTER]',
        });
        break;

      case 'nmap': {
        const target = args[0] || '10.0.0.1';
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}
Nmap scan report for ${target}
Host is up (0.00018s latency).
Not shown: 995 closed ports

PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 9.6 (protocol 2.0)
80/tcp   open  http          Nginx 1.25.3 (eBPF Hardened)
443/tcp  open  ssl/https     Cloudflare TLS 1.3
3000/tcp open  ppp-express   Node.js / React 19 SPA
8080/tcp open  http-proxy    Vortex-Fuzz Proxy Engine

Device type: general purpose
Running: Linux 6.X
OS CPE: cpe:/o:linux:linux_kernel:6.8
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`,
        });
        break;
      }

      case 'vulnscan': {
        const host = args[0] || 'localhost';
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'amber',
          text: `[+] RUNNING AUTOMATED VULNERABILITY AUDIT SCANNER AGAINST: ${host}
===================================================================
[✓] Port 22 SSH     - Clean (OpenSSH 9.6 patched against CVE-2024-6387 RegreSSHion)
[✓] Port 80 HTTP    - Clean (Nginx 1.25.3 headers hardened)
[⚠] Port 443 HTTPS   - Informational: TLS 1.2 legacy cipher suites supported (Recommended disable)
[✓] Memory Kernel   - eBPF Spectre mitigation enabled (IBRS + Retpoline active)
[✓] Overall Score   - 9.8 / 10 SECURE (Zero Critical Vulnerabilities Detected)`,
        });
        break;
      }

      case 'hashid': {
        const hash = args[0];
        if (!hash) {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'error',
            text: 'Usage: hashid <hash_string>\nExample: hashid 5d41402abc4b2a76b9719d911017c592',
          });
        } else {
          let hashType = 'Unknown / Custom Hash';
          const cleanHash = hash.trim();

          if (cleanHash.startsWith('$2a$') || cleanHash.startsWith('$2b$')) hashType = 'Bcrypt Password Hash';
          else if (cleanHash.startsWith('$argon2')) hashType = 'Argon2 Password Hash';
          else if (/^[a-fA-F0-9]{32}$/.test(cleanHash)) hashType = 'MD5 / NTLM Hash (128-bit)';
          else if (/^[a-fA-F0-9]{40}$/.test(cleanHash)) hashType = 'SHA-1 / RIPEMD-160 Hash (160-bit)';
          else if (/^[a-fA-F0-9]{64}$/.test(cleanHash)) hashType = 'SHA-256 / SHA3-256 Hash (256-bit)';
          else if (/^[a-fA-F0-9]{128}$/.test(cleanHash)) hashType = 'SHA-512 Hash (512-bit)';

          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'teal',
            text: `HASH ANALYZER RESULT:
Input String : ${cleanHash}
Detected Type: ${hashType}
Length       : ${cleanHash.length} characters
Status       : Classification Verified`,
          });
        }
        break;
      }

      case 'encode': {
        const mode = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');
        if (!mode || !text) {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'error',
            text: 'Usage: encode <base64|hex> <string>\nExample: encode base64 Hello World',
          });
        } else if (mode === 'base64') {
          try {
            const encoded = btoa(text);
            newHistory.push({
              id: (Date.now() + 1).toString(),
              type: 'success',
              text: `ENCODED (Base64): ${encoded}`,
            });
          } catch {
            newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Error encoding Base64.' });
          }
        } else if (mode === 'hex') {
          const hex = Array.from(text)
            .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'success',
            text: `ENCODED (Hex): ${hex}`,
          });
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Supported encoding types: base64, hex' });
        }
        break;
      }

      case 'decode': {
        const mode = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');
        if (!mode || !text) {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'error',
            text: 'Usage: decode <base64|hex> <string>\nExample: decode base64 U2VjT3Bz',
          });
        } else if (mode === 'base64') {
          try {
            const decoded = atob(text);
            newHistory.push({
              id: (Date.now() + 1).toString(),
              type: 'success',
              text: `DECODED (Base64): ${decoded}`,
            });
          } catch {
            newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Invalid Base64 string.' });
          }
        } else if (mode === 'hex') {
          try {
            const cleanHex = text.replace(/\s+/g, '');
            let str = '';
            for (let i = 0; i < cleanHex.length; i += 2) {
              str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
            }
            newHistory.push({
              id: (Date.now() + 1).toString(),
              type: 'success',
              text: `DECODED (Hex): ${str}`,
            });
          } catch {
            newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Invalid Hex string.' });
          }
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Supported decoding types: base64, hex' });
        }
        break;
      }

      case 'ping': {
        const host = args[0] || 'sec-node-01.internal';
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: `PING ${host} (10.0.0.1) 56(84) bytes of data.
64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms
64 bytes from 10.0.0.1: icmp_seq=3 ttl=64 time=0.045 ms
64 bytes from 10.0.0.1: icmp_seq=4 ttl=64 time=0.039 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 0.038/0.041/0.045/0.003 ms`,
        });
        break;
      }

      case 'ls':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'teal',
          text: `drwxr-xr-x 2 labib sec_ops 4096 Aug  5 10:00 exploits/
-rw-r--r-- 1 labib sec_ops 1024 Aug  5 10:00 dossier.txt
-rw-r--r-- 1 labib sec_ops 2048 Aug  5 10:00 skills.json
-rw-r--r-- 1 labib sec_ops 4096 Aug  5 10:00 certificates.db
-rw-r--r-- 1 labib sec_ops  512 Aug  5 10:00 keys.pgp
-rw-r--r-- 1 labib sec_ops  890 Aug  5 10:00 README.md`,
        });
        break;

      case 'cat': {
        const file = args[0]?.toLowerCase();
        if (!file) {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: 'Usage: cat <filename>\nExample: cat dossier.txt' });
        } else if (file === 'dossier.txt') {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'info',
            text: `[DOSSIER.TXT]
Labib B. Shahed — Cybersecurity Architect & Software Engineer
Focus: Zero-Trust Engineering, Memory Forensics, Vulnerability Auditing, Cloud Hardening.
Email: la-b-ib@github.io`,
          });
        } else if (file === 'readme.md') {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'teal',
            text: `# SEC_OPS TERMINAL SHELL
Welcome to Labib's security portfolio interactive shell environment.
Type "help" for a full list of commands or "ctf" to start the cryptographic challenge.`,
          });
        } else if (file === 'keys.pgp') {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'amber',
            text: `-----BEGIN PGP PUBLIC KEY BLOCK-----
mQENBF5x9...
4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2
-----END PGP PUBLIC KEY BLOCK-----`,
          });
        } else {
          newHistory.push({ id: (Date.now() + 1).toString(), type: 'error', text: `cat: ${file}: No such file or directory` });
        }
        break;
      }

      case 'banner':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'teal',
          text: `
 ██╗      █████╗ ██████╗ ██╗██████╗ 
 ██║     ██╔══██╗██╔══██╗██║██╔══██╗
 ██║     ███████║██████╔╝██║██████╔╝
 ██║     ██╔══██║██╔══██╗██║██╔══██╗
 ███████╗██║  ██║██████╔╝██║██████╔╝
 ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═════╝ 
 [ LABIB B. SHAHED // SEC_OPS ARCHITECT SHELL v4.5.0 ]`,
        });
        break;

      case 'theme': {
        const selectedTheme = args[0]?.toLowerCase();
        if (selectedTheme === 'cyan' || selectedTheme === 'green' || selectedTheme === 'amber' || selectedTheme === 'matrix') {
          setTerminalTheme(selectedTheme);
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'success',
            text: `Terminal color theme updated to "${selectedTheme}".`,
          });
        } else {
          newHistory.push({
            id: (Date.now() + 1).toString(),
            type: 'error',
            text: 'Usage: theme <cyan|green|amber|matrix>',
          });
        }
        break;
      }

      case 'ctf':
        onOpenCtf();
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'amber',
          text: 'Launching CTF Decrypt Challenge GUI...',
        });
        break;

      case 'matrix':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'teal',
          text: 'Matrix background effect has been disabled.',
        });
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'date':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: new Date().toUTCString(),
        });
        break;

      case 'contact':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'teal',
          text: 'Email: la-b-ib@github.io\nGitHub: https://github.com/la-b-ib\nPGP Fingerprint: 4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2',
        });
        break;

      case 'echo':
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'info',
          text: args.join(' '),
        });
        break;

      case 'sudo':
        soundEngine.play('error');
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: 'sudo: User is already root on sec-node-01. Incident reported.',
        });
        break;

      case 'exit':
        soundEngine.play('click');
        onClose();
        return;

      default:
        soundEngine.play('error');
        newHistory.push({
          id: (Date.now() + 1).toString(),
          type: 'error',
          text: `bash: command not found: "${cmd}". Type "help" or press [TAB] for options.`,
        });
        break;
    }

    setHistory(newHistory);
    setInputVal('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) {
        setInputVal('help');
        return;
      }

      const matches = ALL_COMMANDS.filter((c) => c.startsWith(current));
      if (matches.length === 1) {
        setInputVal(matches[0]);
        soundEngine.play('click');
      } else if (matches.length > 1) {
        soundEngine.play('click');
        setHistory((prev) => [
          ...prev,
          { id: Date.now().toString(), type: 'input', text: `$ ${current}` },
          { id: (Date.now() + 1).toString(), type: 'teal', text: `MATCHES: ${matches.join('  ')}` },
        ]);
      }
    }
  };

  const getThemeTextClass = () => {
    switch (terminalTheme) {
      case 'green':
        return 'text-emerald-400';
      case 'amber':
        return 'text-amber-400';
      case 'matrix':
        return 'text-green-500 font-bold';
      default:
        return 'text-cyan-400';
    }
  };

  const quickPills = [
    { label: 'help', cmd: 'help' },
    { label: 'sysinfo', cmd: 'sysinfo' },
    { label: 'nmap', cmd: 'nmap 10.0.0.1' },
    { label: 'certs', cmd: 'certs' },
    { label: 'badges', cmd: 'badges' },
    { label: 'hashid', cmd: 'hashid 5d41402abc4b2a76b9719d911017c592' },
    { label: 'ctf', cmd: 'ctf' },
    { label: 'matrix', cmd: 'matrix' },
    { label: 'clear', cmd: 'clear' },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div
        className={`bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full flex flex-col shadow-2xl overflow-hidden relative transition-all duration-300 my-auto ${
          isMaximized
            ? 'h-[calc(100dvh-75px)] max-w-[98vw]'
            : 'h-[calc(100dvh-85px)] max-h-[650px] min-h-[320px] max-w-sm sm:max-w-2xl md:max-w-4xl'
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundEngine.play('click');
                onClose();
              }}
              title="Close terminal"
              className="w-3.5 h-3.5 rounded-full bg-rose-500 hover:opacity-80 transition-opacity"
            ></button>
            <button
              onClick={() => {
                soundEngine.play('click');
                executeCommand('clear');
              }}
              title="Clear log"
              className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:opacity-80 transition-opacity"
            ></button>
            <button
              onClick={() => {
                soundEngine.play('click');
                setIsMaximized(!isMaximized);
              }}
              title="Maximize terminal"
              className="w-3.5 h-3.5 rounded-full bg-teal-500 hover:opacity-80 transition-opacity"
            ></button>
            <span className="text-xs font-mono font-bold text-slate-200 ml-2 flex items-center space-x-2">
              <i className="ri-terminal-box-line text-teal-400"></i>
              <span>labib@sec-node-01:~ (bash)</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                soundEngine.play('click');
                setIsMaximized(!isMaximized);
              }}
              className="text-slate-200 hover:text-cyan-300 p-1 text-[10px] font-mono font-bold rounded-sm bg-slate-800 border-2 border-slate-950 px-2 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              {isMaximized ? 'RESTORE' : 'MAXIMIZE'}
            </button>
            <button
              onClick={() => {
                soundEngine.play('click');
                onClose();
              }}
              className="text-slate-400 hover:text-slate-100 p-1 rounded-sm bg-slate-900 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>

        {/* Quick Command Pills Bar */}
        <div className="bg-[#0e121d] px-3 py-2 border-b border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-mono text-slate-400 mr-1 uppercase font-semibold">QUICK:</span>
          {quickPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => {
                executeCommand(pill.cmd);
              }}
              className="px-2.5 py-1 rounded-sm bg-slate-900 hover:bg-teal-400 hover:text-slate-950 border-2 border-slate-950 text-slate-300 font-mono text-[11px] font-extrabold whitespace-nowrap shadow-[2px_2px_0px_0px_#00a8ff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              ${pill.label}
            </button>
          ))}
        </div>

        {/* Terminal Screen Log Area */}
        <div className="flex-1 bg-slate-950 p-4 font-jetbrains text-xs overflow-y-auto space-y-2.5 leading-relaxed">
          {history.map((item) => (
            <div
              key={item.id}
              className={`whitespace-pre-wrap ${
                item.type === 'input'
                  ? `${getThemeTextClass()} font-bold`
                  : item.type === 'error'
                  ? 'text-rose-400'
                  : item.type === 'success'
                  ? 'text-teal-300'
                  : item.type === 'amber'
                  ? 'text-amber-300'
                  : item.type === 'teal'
                  ? 'text-cyan-300'
                  : 'text-slate-300'
              }`}
            >
              {item.text}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleSubmit} className="bg-slate-900 p-3 border-t border-slate-800 flex items-center space-x-2">
          <span className="text-teal-400 font-mono font-bold text-xs flex items-center space-x-1">
            <span className="text-slate-500">labib@sec-node-01:~$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command ('help', 'sysinfo', 'nmap', 'hashid', 'certs'). Press [TAB] to complete..."
            className="flex-1 bg-transparent border-none text-slate-100 font-jetbrains text-xs focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};
