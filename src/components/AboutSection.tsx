import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const AboutSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const pgpFingerprint = '4F9B 8A2C 1E5D 93B0 77C4 8E1A 22DF 60B3 9E8C 41A2';

  const copyPgp = () => {
    navigator.clipboard.writeText(pgpFingerprint);
    setCopied(true);
    soundEngine.play('click');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="about" className="py-16 md:py-24 border-b border-slate-800 bg-[#080a0f] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider bg-teal-500/10 px-3 py-1 rounded border border-teal-500/30">
            <i className="ri-user-secret-line text-sm"></i>
            <span>[ 01 // INTEL BRIEF & PERSONNEL DOSSIER ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Personnel Briefing & Architectural Philosophy
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            A rare synthesis of full-stack software craftsmanship, offensive vulnerability exploitation, and forensic memory investigation.
          </p>
        </div>

        {/* About Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-5 bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-lg bg-teal-500/10 border border-teal-500/40 flex items-center justify-center text-teal-400 text-2xl shadow-lg shadow-teal-500/10">
                  <i className="ri-shield-user-line"></i>
                </div>
                <div>
                  <h3 className="text-xl font-source-code-black text-slate-100">Labib B. Shahed</h3>
                  <div className="text-xs font-mono text-teal-400 font-medium mt-0.5">
                    President, IEEE CS BDC Secretariat • Security & Content Lead
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-1">
                    <i className="ri-map-pin-2-line text-slate-500"></i> Dhaka, Bangladesh / Global Remote Ops
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Clearance Stamp */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
              <span className="text-slate-400">SECURITY CLEARANCE:</span>
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                LEVEL 5 / TS-SCI (OFFSEC & DFIR)
              </span>
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 font-mono leading-relaxed uppercase">
              <p>
                CSE STUDENT ARCHITECTING IMMUTABLE, ADVERSARY RESISTANT SYSTEMS BY FUSING ENTERPRISE JVM ENGINEERING WITH NSE/CHE VALIDATED FORENSICS AND ZERO TRUST DLT PROTOCOLS. SPECIALIZING IN DISTRIBUTED CONSENSUS AND ASYNCHRONOUS I/O, I ENGINEER PARTITION TOLERANT MICROSERVICES THAT OPTIMIZE ATOMIC CONSISTENCY AND THROUGHPUT AT SCALE.
              </p>
            </div>

            {/* Profile Meta & PGP Key */}
            <div className="space-y-3 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">EDUCATION:</span>
                <span className="text-cyan-300 font-bold">BRAC University (B.Sc. CSE, CGPA 3.58)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">LOCATION COORDS:</span>
                <span className="text-teal-300 font-mono font-semibold">23.77°N, 90.42°E</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">RESEARCH THESIS:</span>
                <span className="text-purple-300 font-semibold truncate max-w-[210px]" title="Adversarial Machine Learning in Malware Detection">Adversarial ML in Malware Detection</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">LANGUAGES:</span>
                <span className="text-teal-300">TypeScript, Go, Rust, Python, C</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">FORENSIC SUITE:</span>
                <span className="text-cyan-300">Volatility 3, Ghidra, YARA, Wireshark</span>
              </div>

              {/* PGP Fingerprint Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <i className="ri-key-2-line text-teal-400"></i> PGP FINGERPRINT
                  </span>
                  <button
                    onClick={copyPgp}
                    className="px-2 py-0.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-teal-300 hover:text-teal-200 font-mono text-[10px] font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    {copied ? 'COPIED!' : 'COPY KEY'}
                  </button>
                </div>
                <div className="text-[10px] text-teal-300 font-jetbrains tracking-tight truncate">
                  {pgpFingerprint}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Philosophy Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 space-y-3 hover:border-teal-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl group-hover:bg-teal-500/20">
                <i className="ri-shield-cross-line"></i>
              </div>
              <h3 className="text-base font-source-code-black text-slate-100">
                1. Defense in Depth & Zero Trust
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Never assume internal network trust. Every API route, microservice, and socket connection must enforce strict identity verification, short-lived tokens, and mutual TLS encryption.
              </p>
            </div>

            <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 space-y-3 hover:border-cyan-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl group-hover:bg-cyan-500/20">
                <i className="ri-sword-line"></i>
              </div>
              <h3 className="text-base font-source-code-black text-slate-100">
                2. Offensive Mindset for Defense
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                The most resilient developers are those who know how software breaks. By regularly conducting penetration tests and exploit POCs, I engineer code immune to common and novel attack vectors.
              </p>
            </div>

            <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 space-y-3 hover:border-purple-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl group-hover:bg-purple-500/20">
                <i className="ri-search-eye-line"></i>
              </div>
              <h3 className="text-base font-source-code-black text-slate-100">
                3. Low-Level Forensic Analysis
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                When security incidents occur, root causes lie in RAM artifacts, kernel logs, and raw network packets. My forensics background ensures complete incident containment and malware reverse engineering.
              </p>
            </div>

            <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 space-y-3 hover:border-emerald-500/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl group-hover:bg-emerald-500/20">
                <i className="ri-speed-up-line"></i>
              </div>
              <h3 className="text-base font-source-code-black text-slate-100">
                4. High-Performance Craftsmanship
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Security must never compromise user experience or system latency. I build slick, responsive React frontends backed by blazing fast, scalable backends engineered with precision.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
