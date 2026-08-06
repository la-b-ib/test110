import React, { useState } from 'react';
import { DISPATCHES_DATA } from '../data/portfolioData';
import { Dispatch } from '../types';
import { soundEngine } from '../utils/soundEngine';

export const DispatchesSection: React.FC = () => {
  const [activeDispatch, setActiveDispatch] = useState<Dispatch | null>(null);

  return (
    <section id="blog" className="py-16 md:py-24 border-b border-slate-800 bg-[#090b10] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/30">
            <i className="ri-article-line text-sm"></i>
            <span>[ 07 // SECURITY FIELD DISPATCHES & ADVISORIES ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Technical Advisories & Architecture Writeups
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            In-depth engineering notes, vulnerability writeups, and low-level kernel research published for the cybersecurity community.
          </p>
        </div>

        {/* Dispatches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DISPATCHES_DATA.map((dispatch) => (
            <div
              key={dispatch.id}
              className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-teal-400 font-semibold">{dispatch.category.toUpperCase()}</span>
                  <span>{dispatch.readTime}</span>
                </div>

                <h3 className="text-base font-source-code-black text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                  {dispatch.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {dispatch.excerpt}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {dispatch.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveDispatch(dispatch);
                    soundEngine.play('click');
                  }}
                  className="w-full py-2 px-3 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-200 hover:text-cyan-300 font-mono text-xs font-bold flex items-center justify-center space-x-1.5 shadow-[3px_3px_0px_0px_#00a8ff] hover:bg-slate-800 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
                >
                  <span>READ FULL ADVISORY</span>
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispatch Modal Reader */}
      {activeDispatch && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full max-w-sm sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-95px)] overflow-y-auto p-4 sm:p-6 space-y-5 shadow-2xl relative my-auto">
            <button
              onClick={() => {
                setActiveDispatch(null);
                soundEngine.play('click');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-400 hover:text-slate-100 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>

            <div className="space-y-2">
              <span className="px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold">
                FIELD DISPATCH WRITEUP
              </span>
              <h3 className="text-2xl font-source-code-black text-slate-100 mt-2">
                {activeDispatch.title}
              </h3>
              <div className="text-xs font-mono text-slate-400">
                BY {activeDispatch.author} • {activeDispatch.date} • {activeDispatch.readTime}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 space-y-4 font-sans leading-relaxed border-t border-slate-800 pt-4">
              <p className="text-slate-200 bg-slate-950 p-4 rounded border border-slate-800 font-mono text-xs">
                {activeDispatch.excerpt}
              </p>

              <div className="whitespace-pre-wrap font-sans space-y-3">
                {activeDispatch.fullMarkdown}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setActiveDispatch(null);
                  soundEngine.play('click');
                }}
                className="px-4 py-2 rounded-sm bg-teal-400 text-slate-950 font-mono font-extrabold text-xs border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000000] hover:bg-teal-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                CLOSE DISPATCH
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
