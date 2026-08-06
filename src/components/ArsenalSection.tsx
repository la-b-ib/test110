import React, { useState } from 'react';
import { SKILLS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

export const ArsenalSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'offsec' | 'dfir' | 'fullstack' | 'crypto'>('all');

  const filteredSkills = SKILLS_DATA.filter((skill) => {
    if (activeTab === 'all') return true;
    return skill.category === activeTab;
  });

  return (
    <section id="skills" className="py-16 md:py-24 border-b border-slate-800 bg-[#080a0f] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider bg-teal-500/10 px-3 py-1 rounded border border-teal-500/30">
            <i className="ri-tools-line text-sm"></i>
            <span>[ 03 // ARSENAL & CYBER TOOLKIT ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Tactical Skill Arsenal & Technical Stack
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            Deep domain mastery across penetration testing, RAM forensics, reverse engineering, full-stack microservices, and applied cryptography.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 font-mono text-xs">
          {[
            { id: 'all', label: 'ALL ARSENAL', icon: 'ri-apps-2-line' },
            { id: 'offsec', label: 'OFFSEC & PENTESTING', icon: 'ri-shield-keyhole-line' },
            { id: 'dfir', label: 'DFIR & REVERSE ENG', icon: 'ri-search-eye-line' },
            { id: 'fullstack', label: 'FULL-STACK & CLOUD', icon: 'ri-flashlight-line' },
            { id: 'crypto', label: 'CRYPTO & PROTOCOLS', icon: 'ri-lock-2-line' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as 'all' | 'offsec' | 'dfir' | 'fullstack' | 'crypto');
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

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 space-y-4 hover:border-teal-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Top Row: Icon + Level Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-teal-400 text-xl group-hover:border-teal-400 transition-colors">
                    <i className={skill.icon}></i>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono font-bold text-teal-300">
                    {skill.level}% {skill.levelLabel}
                  </span>
                </div>

                {/* Skill Title */}
                <h3 className="text-base font-source-code-black text-slate-100">
                  {skill.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {skill.description}
                </p>
              </div>

              {/* Progress Bar & Footer */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>EXP: {skill.expYears}</span>
                  <span className="text-slate-500 truncate max-w-[160px]" title={skill.command}>
                    {skill.command}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
