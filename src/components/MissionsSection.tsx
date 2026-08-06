import React, { useState } from 'react';
import { MISSIONS_DATA, RECOMMENDATIONS_DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';
import { CvSection } from './CvSection';

export const MissionsSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-slate-800 bg-[#090b10] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/30">
            <i className="ri-history-line text-sm"></i>
            <span>[ 02 // TACTICAL MISSIONS & WORK HISTORY ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Work History
          </h2>
        </div>

        {/* Missions Cards Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MISSIONS_DATA.map((mission, index) => {
            const missionNumber = String(index + 1).padStart(2, '0');
            return (
              <div
                key={mission.id}
                className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-6 sm:p-7 space-y-5 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/30 transition-all relative overflow-hidden group"
              >
                {/* Top subtle glow bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/0 group-hover:via-cyan-400 to-transparent transition-all duration-500"></div>

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                      <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold">
                        MISSION {missionNumber}
                      </span>
                      {mission.isCurrent && (
                        <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[10px] font-mono font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                          CURRENT ROLE
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400 font-semibold uppercase">
                        {mission.company}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-source-code-black text-slate-100 group-hover:text-cyan-300 transition-colors pt-1">
                      {mission.title}
                    </h3>

                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <i className="ri-map-pin-2-line text-cyan-400"></i>
                      <span>{mission.location}</span>
                    </div>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-teal-300 font-bold self-start sm:self-center shrink-0 flex items-center gap-1.5 shadow-inner">
                    <i className="ri-calendar-event-line text-teal-400"></i>
                    <span>{mission.period}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {mission.summary}
                </p>

                {/* Bullets List */}
                <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
                  {mission.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 leading-relaxed group/item">
                      <i className="ri-shield-flash-line text-sm text-teal-400 shrink-0 mt-0.5 group-hover/item:text-cyan-300 transition-colors"></i>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                  {mission.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-700 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations & Endorsements Block */}
        <div className="mt-20 pt-12 border-t border-slate-800 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider bg-teal-500/10 px-3 py-1 rounded border border-teal-500/30">
              <i className="ri-double-quotes-l text-sm"></i>
              <span>[ VERIFIED ENDORSEMENTS & RECOMMENDATIONS ]</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-source-code-black text-slate-100">
              Peer Endorsements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECOMMENDATIONS_DATA.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-4 hover:border-teal-500/50 transition-all flex flex-col justify-between group shadow-xl relative"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-base font-source-code-black text-slate-100 group-hover:text-teal-300 transition-colors">
                        {rec.name}
                      </h4>
                      <p className="text-xs font-mono text-teal-400 font-medium">
                        {rec.role}
                      </p>
                    </div>
                    {rec.linkedIn && (
                      <a
                        href={rec.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => soundEngine.play('click')}
                        className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shrink-0"
                        title="LinkedIn Profile"
                      >
                        <i className="ri-linkedin-box-fill text-lg"></i>
                      </a>
                    )}
                  </div>

                  <div className="relative pt-2">
                    <i className="ri-double-quotes-l text-2xl text-teal-500/20 absolute -top-1 -left-1"></i>
                    <blockquote className="text-xs text-slate-300 font-sans leading-relaxed italic pl-4">
                      "{rec.quote}"
                    </blockquote>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-teal-400 font-bold">
                    <i className="ri-checkbox-circle-fill"></i> VERIFIED ENDORSEMENT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CV Section */}
        <CvSection />
      </div>
    </section>
  );
};
