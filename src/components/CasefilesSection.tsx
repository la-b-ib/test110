import React, { useState } from 'react';
import { CASEFILES_DATA } from '../data/portfolioData';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefilesSectionProps {
  onInspectCasefile: (casefile: Casefile) => void;
}

export const CasefilesSection: React.FC<CasefilesSectionProps> = ({ onInspectCasefile }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'dfir' | 'offsec' | 'fullstack' | 'auth'>('all');

  const filteredCasefiles = CASEFILES_DATA.filter((file) => {
    if (activeTab === 'all') return true;
    return file.category === activeTab;
  });

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-slate-800 bg-[#090b10] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/30">
            <i className="ri-folder-shield-2-line text-sm"></i>
            <span>[ 04 // OPERATIONAL CASEFILES & SECURITY PROJECTS ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Selected Open-Source Projects & Forensic Engines
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            Real-world tools, memory forensics parsers, zero-trust auth microservices, and high-throughput fuzzers engineered for security-critical environments.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 font-mono text-xs">
          {[
            { id: 'all', label: 'ALL CASEFILES', icon: 'ri-folder-open-line' },
            { id: 'dfir', label: 'FORENSIC TOOLS', icon: 'ri-search-eye-line' },
            { id: 'offsec', label: 'OFFSEC & FUZZERS', icon: 'ri-shield-keyhole-line' },
            { id: 'fullstack', label: 'FULL-STACK PLATFORMS', icon: 'ri-flashlight-line' },
            { id: 'auth', label: 'ZERO-TRUST AUTH', icon: 'ri-lock-2-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'all' | 'dfir' | 'offsec' | 'fullstack' | 'auth');
                soundEngine.play('click');
              }}
              className={`px-3.5 py-1.5 rounded-sm border-2 border-slate-950 transition-all flex items-center space-x-1.5 font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-teal-400 text-slate-950 font-extrabold'
                  : 'bg-slate-900 text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              <i className={`${tab.icon} ${activeTab === tab.id ? 'text-slate-950' : 'text-teal-400'}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Casefiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCasefiles.map((file) => (
            <div
              key={file.id}
              className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Top Row: Threat Badge + Case ID */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                    {file.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    {file.caseId}
                  </span>
                </div>

                {/* Case Title */}
                <h3 className="text-lg font-source-code-black text-slate-100 group-hover:text-teal-300 transition-colors">
                  {file.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {file.summary}
                </p>
              </div>

              {/* Tech Badges & Actions */}
              <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1.5">
                  {file.tech.slice(0, 4).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => {
                      onInspectCasefile(file);
                      soundEngine.play('click');
                    }}
                    className="flex-1 py-2 px-3 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-100 hover:text-cyan-300 font-mono text-xs font-bold flex items-center justify-center space-x-1.5 shadow-[3px_3px_0px_0px_#00a8ff] hover:bg-slate-800 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                  >
                    <span>INSPECT CASEFILE</span>
                    <i className="ri-arrow-right-line"></i>
                  </button>

                  <a
                    href={file.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.play('click')}
                    className="p-2 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-slate-100 transition-colors"
                    title="View GitHub Repository"
                  >
                    <i className="ri-github-line text-base"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
