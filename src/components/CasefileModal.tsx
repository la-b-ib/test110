import React from 'react';
import { Casefile } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface CasefileModalProps {
  casefile: Casefile | null;
  onClose: () => void;
}

export const CasefileModal: React.FC<CasefileModalProps> = ({ casefile, onClose }) => {
  if (!casefile) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full max-w-sm sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-95px)] overflow-y-auto p-4 sm:p-6 space-y-5 shadow-2xl relative my-auto">
        <button
          onClick={() => {
            onClose();
            soundEngine.play('click');
          }}
          className="absolute top-4 right-4 p-1.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-400 hover:text-slate-100 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Case Header */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
              {casefile.badge}
            </span>
            <span className="text-xs font-mono text-slate-400 font-semibold">
              {casefile.caseId}
            </span>
          </div>
          <h3 className="text-2xl font-source-code-black text-slate-100">
            {casefile.title}
          </h3>
        </div>

        {/* Details & Specifications */}
        <div className="space-y-3 font-sans text-xs sm:text-sm text-slate-300">
          <p className="bg-slate-950 p-4 rounded border border-slate-800 text-slate-200 leading-relaxed font-sans">
            {casefile.summary}
          </p>

          <div className="space-y-2">
            <h4 className="font-mono font-semibold text-slate-200 text-xs">ARCHITECTURAL SPECIFICATIONS & HIGHLIGHTS:</h4>
            <ul className="space-y-1.5 font-sans">
              {casefile.details.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-teal-400 font-mono font-bold">&gt;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Snippet Box */}
          <div className="space-y-1 pt-2">
            <h4 className="font-mono font-semibold text-teal-400 text-xs flex items-center gap-1.5">
              <i className="ri-code-s-slash-line"></i> CORE ARCHITECTURE SNIPPET ({casefile.language.toUpperCase()})
            </h4>
            <pre className="bg-slate-950 p-4 rounded border border-slate-800 font-jetbrains text-xs text-teal-300 overflow-x-auto leading-relaxed max-h-56">
              <code>{casefile.codeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <a
            href={casefile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundEngine.play('click')}
            className="px-4 py-2.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-100 font-mono text-xs font-bold flex items-center space-x-2 shadow-[3px_3px_0px_0px_#00a8ff] hover:bg-slate-800 hover:text-cyan-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <i className="ri-github-line text-base text-cyan-400"></i>
            <span>OPEN GITHUB REPOSITORY</span>
          </a>

          <button
            onClick={() => {
              onClose();
              soundEngine.play('click');
            }}
            className="px-4 py-2.5 rounded-sm bg-teal-400 text-slate-950 font-mono font-extrabold text-xs border-2 border-slate-950 shadow-[3px_3px_0px_0px_#000000] hover:bg-teal-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            CLOSE CASEFILE
          </button>
        </div>
      </div>
    </div>
  );
};
