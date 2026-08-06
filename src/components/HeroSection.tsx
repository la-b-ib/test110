import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface HeroSectionProps {
  onOpenTerminal: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTerminal, onNavigate }) => {
  // Decipher / Scramble animation state
  const targetText = 'B. SHAHED';
  const [displayText, setDisplayText] = useState(targetText);

  const runDecipher = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!_';
    let iteration = 0;

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, idx) => {
            if (char === ' ') return ' ';
            if (idx < iteration) return targetText[idx];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 35);
  };

  useEffect(() => {
    runDecipher();
  }, []);

  // Typewriter effect state
  const phrases = [
    'Architecting Zero-Trust Cloud Platforms',
    'Reverse Engineering Kernel Rootkits & Ransomware',
    'Performing Physical RAM Memory Forensics',
    'Conducting Red Team Penetration Testing',
    'Building High-Throughput Go, Rust & React Backends',
  ];
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIdx];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIdx < currentPhrase.length) {
      timeout = setTimeout(() => setCharIdx(charIdx + 1), 50);
    } else if (!isDeleting && charIdx === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(charIdx - 1), 30);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((phraseIdx + 1) % phrases.length);
      timeout = setTimeout(() => {}, 400);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx, phrases]);

  // Live Hash Generator state
  const [hashInput, setHashInput] = useState('LabibSecOps2026');
  const [sha256Hash, setSha256Hash] = useState('Calculating...');
  const [base64Val, setBase64Val] = useState('');

  const computeHashes = async (text: string) => {
    if (!text) {
      setSha256Hash('--------------------------------');
      setBase64Val('');
      return;
    }
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setSha256Hash(hex);
      setBase64Val(btoa(text));
    } catch {
      setSha256Hash('Crypto Unavailable');
    }
  };

  useEffect(() => {
    computeHashes(hashInput);
  }, [hashInput]);

  // Telemetry stream logs
  const [streamLogs, setStreamLogs] = useState([
    { time: '10:00:01', tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'Zero-Trust policy active: 100% compliant.' },
    { time: '10:00:04', tag: 'SEC', tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30', msg: 'Port scan payload blocked by WAF filter.' },
    { time: '10:00:08', tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'eBPF probe captured sys_execve() PID 4092.' },
  ]);

  useEffect(() => {
    const sampleEvents = [
      { tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'Memory RAM dump scan complete: 0 rootkits detected.' },
      { tag: 'SEC', tagClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30', msg: 'Unauthorized bearer token rejected on /api/v1/vault.' },
      { tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'mTLS handshake verified for node-02.' },
      { tag: 'OK', tagClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30', msg: 'FIDO2 passkey signature verified successfully.' },
      { tag: 'INFO', tagClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', msg: 'YARA scanner indexed 150 threat signatures.' },
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      const ev = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];

      setStreamLogs((prev) => [...prev.slice(-4), { time: timeStr, ...ev }]);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative pt-10 pb-16 md:py-20 border-b border-slate-800/80 overflow-hidden scroll-mt-28">
      {/* Background Accent Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Dossier Header & Title */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Name with Source Code Pro Black Typography & Decipher Effect */}
            <h1 className="text-[50px] font-source-code-black tracking-tight text-slate-100 leading-none" style={{ fontSize: '50px' }}>
              LABIB{' '}
              <span
                onMouseEnter={() => {
                  runDecipher();
                  soundEngine.play('terminal_key');
                }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 cursor-pointer hover:underline underline-offset-8 decoration-teal-500/40"
              >
                {displayText}
              </span>
            </h1>

            {/* Typewriter Subheading */}
            <div className="font-jetbrains text-base sm:text-xl text-teal-300/90 flex items-center space-x-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-teal-400 font-bold">&gt;</span>
              <span>{phrases[phraseIdx].substring(0, charIdx)}</span>
              <span className="w-2 h-5 bg-teal-400 animate-pulse inline-block"></span>
            </div>

            {/* Core Summary Paragraph */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
              Bridging the gap between <strong className="text-slate-100 font-semibold">high-performance full-stack engineering</strong>, <strong className="text-teal-300 font-semibold">offensive penetration testing</strong>, and <strong className="text-cyan-300 font-semibold">digital forensic investigation</strong>. I build resilient zero-trust architectures, isolate complex kernel rootkits, and audit critical infrastructure.
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-2xl font-source-code-black text-teal-400">120+</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">Vulnerabilities Disclosed</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-2xl font-source-code-black text-cyan-400">65+</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">RAM Dumps Analyzed</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-2xl font-source-code-black text-emerald-400">99.99%</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">Zero-Trust Uptime</div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-2xl font-source-code-black text-purple-400">12+</div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">Sec & DFIR Certs</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  onOpenTerminal();
                  soundEngine.play('click');
                }}
                className="px-5 py-3 rounded-sm bg-teal-400 text-slate-950 font-mono font-extrabold text-xs tracking-wider flex items-center space-x-2 border-2 border-slate-950 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[6px_6px_0px_0px_#44bd32] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <i className="ri-terminal-box-fill text-base"></i>
                <span>LAUNCH TERMINAL [~]</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.play('click');
                  onNavigate?.('projects');
                }}
                className="px-5 py-3 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-100 font-mono font-bold text-xs tracking-wider flex items-center space-x-2 shadow-[4px_4px_0px_0px_#44bd32] hover:bg-slate-800 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <i className="ri-folder-shield-2-line text-base text-teal-400"></i>
                <span>EXPLORE CASEFILES</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.play('click');
                  onNavigate?.('ai-auditor');
                }}
                className="px-5 py-3 rounded-sm bg-cyan-950 border-2 border-slate-950 text-cyan-300 font-mono font-bold text-xs tracking-wider flex items-center space-x-2 shadow-[4px_4px_0px_0px_#44bd32] hover:bg-cyan-900 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <i className="ri-cpu-line text-base text-cyan-400"></i>
                <span>AI VULN AUDITOR</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Cryptographic & Telemetry Window */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#0b0e17] border border-slate-800 shadow-2xl overflow-hidden">
              {/* Window Header */}
              <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-teal-500/80 inline-block"></span>
                  <span className="text-xs font-mono font-semibold text-slate-300 ml-2">
                    CYBER_LAB // CRYPTO & TELEMETRY
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  LIVE STREAM
                </span>
              </div>

              <div className="p-4 space-y-4 font-mono text-xs">
                {/* Node Status Info */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                  <div>
                    <span className="text-slate-400">HOST_NODE:</span>{' '}
                    <span className="text-teal-400 font-bold">SEC-NODE-01</span>
                  </div>
                  <div>
                    <span className="text-slate-400">KERNEL:</span>{' '}
                    <span className="text-slate-200">Linux 6.8 (eBPF)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ENCRYPTION:</span>{' '}
                    <span className="text-cyan-400 font-bold">AES-256-GCM</span>
                  </div>
                  <div>
                    <span className="text-slate-400">DEFENSES:</span>{' '}
                    <span className="text-purple-400 font-bold">YARA + WAF</span>
                  </div>
                </div>

                {/* Interactive Hash Calculator */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60 space-y-2.5">
                  <div className="text-slate-300 font-semibold flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-teal-400">
                      <i className="ri-key-2-line"></i> CRYPTOGRAPHIC HASH CALCULATOR
                    </span>
                    <span className="text-[10px] text-slate-400">WebCrypto API</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={hashInput}
                      onChange={(e) => {
                        setHashInput(e.target.value);
                        soundEngine.play('terminal_key');
                      }}
                      placeholder="Type string to hash live..."
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 font-mono text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>SHA-256:</span>
                      <span className="text-teal-300 truncate max-w-[210px] font-mono" title={sha256Hash}>
                        {sha256Hash}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Base64:</span>
                      <span className="text-cyan-300 truncate max-w-[210px] font-mono" title={base64Val}>
                        {base64Val || '---'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Telemetry Stream Log */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60 space-y-2">
                  <div className="text-slate-400 font-semibold text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <i className="ri-radar-line text-cyan-400"></i> REAL-TIME TELEMETRY LOGS
                    </span>
                    <span className="text-[10px] text-teal-400">AUTO-POLLING</span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-[11px] pr-1">
                    {streamLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start space-x-2 leading-tight">
                        <span className="text-slate-400 shrink-0">[{log.time}]</span>
                        <span className={`px-1 rounded text-[9px] font-bold border shrink-0 ${log.tagClass}`}>
                          [{log.tag}]
                        </span>
                        <span className="text-slate-300 truncate">{log.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
