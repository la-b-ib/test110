import React from 'react';
import { soundEngine } from '../utils/soundEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    soundEngine.play('click');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#06080d] border-t border-slate-800/80 py-8 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Copyright */}
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
            <i className="ri-shield-keyhole-line"></i>
          </div>
          <div>
            <div className="text-slate-200 font-source-code-black text-sm">
              LABIB B. SHAHED <span className="text-teal-400 font-normal text-xs">// SEC_OPS 2026</span>
            </div>
            <div className="text-[10px] text-slate-500">
              BUILD: v4.2.0-STABLE • CNAME: la-b-ib.me • GITHUB PAGES READY
            </div>
          </div>
        </div>

        {/* Center: Node Telemetry Badges */}
        <div className="flex items-center space-x-4 text-[11px]">
          <span className="flex items-center space-x-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>STATUS: ONLINE</span>
          </span>
          <span className="border-l border-slate-800 pl-4 text-slate-500">
            TLS 1.3 // SECURE
          </span>
          <span className="border-l border-slate-800 pl-4 text-slate-500">
            LATENCY: 14ms
          </span>
        </div>

        {/* Right: Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="px-3 py-1.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-200 hover:text-cyan-300 font-bold shadow-[2px_2px_0px_0px_#00a8ff] hover:bg-slate-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center space-x-1.5 cursor-pointer"
          title="Scroll Back To Top"
        >
          <span>TOP</span>
          <i className="ri-arrow-up-line"></i>
        </button>
      </div>
    </footer>
  );
};
