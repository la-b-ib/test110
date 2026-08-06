import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface HudTopbarProps {
  sfxActive: boolean;
  onToggleSfx: () => void;
  crtActive?: boolean;
  onToggleCrt?: () => void;
  onOpenTerminal: () => void;
  onOpenCtf: () => void;
}

export const HudTopbar: React.FC<HudTopbarProps> = ({
  sfxActive,
  onToggleSfx,
  crtActive = true,
  onToggleCrt,
  onOpenTerminal,
  onOpenCtf,
}) => {
  const [latency, setLatency] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(12 + Math.floor(Math.random() * 6));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0b0e17] text-xs font-jetbrains py-1.5 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Status Indicator */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            <span className="text-slate-400 font-semibold">DEFCON:</span>
            <span className="text-teal-400 font-bold tracking-wider">LEVEL 5 [ALL NOMINAL]</span>
          </div>

          <div className="hidden md:flex items-center space-x-2 border-l border-slate-800 pl-4">
            <span className="text-slate-400">CLEARANCE:</span>
            <span className="text-cyan-400 font-medium">TS/SCI // OFFSEC & DFIR</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 border-l border-slate-800 pl-4 text-slate-400">
            <i className="ri-wifi-line text-slate-500"></i>
            <span>SYS_LATENCY:</span>
            <span className="text-slate-200">{latency}ms</span>
          </div>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center space-x-2">
          {/* SFX Button */}
          <button
            onClick={() => {
              onToggleSfx();
              soundEngine.play('click');
            }}
            className={`px-2.5 py-1 rounded-sm border-2 border-slate-950 flex items-center space-x-1 transition-all text-[11px] font-mono font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              sfxActive
                ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Synthesized Audio SFX"
          >
            <i className={sfxActive ? 'ri-volume-up-line text-slate-950' : 'ri-volume-mute-line'}></i>
            <span className="hidden sm:inline">SFX: {sfxActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* CRT Monitor FX Button */}
          {onToggleCrt && (
            <button
              onClick={() => {
                onToggleCrt();
                soundEngine.play('click');
              }}
              className={`px-2.5 py-1 rounded-sm border-2 border-slate-950 flex items-center space-x-1 transition-all text-[11px] font-mono font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                crtActive
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Retro CRT Scanlines & Cathode Flicker FX"
            >
              <i className="ri-tv-2-line"></i>
              <span className="hidden sm:inline">CRT: {crtActive ? 'ON' : 'OFF'}</span>
            </button>
          )}

          {/* CTF Challenge Button */}
          <button
            onClick={() => {
              onOpenCtf();
              soundEngine.play('click');
            }}
            className="px-2.5 py-1 rounded-sm border-2 border-slate-950 bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all text-[11px] font-mono font-extrabold flex items-center space-x-1 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            title="Launch CTF Decrypt Challenge"
          >
            <i className="ri-flag-2-line text-slate-950"></i>
            <span>CTF</span>
          </button>

          {/* Terminal Launcher Button */}
          <button
            onClick={() => {
              onOpenTerminal();
              soundEngine.play('click');
            }}
            className="px-2.5 py-1 rounded-sm border-2 border-slate-950 bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all text-[11px] font-mono font-extrabold flex items-center space-x-1 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            title="Launch Interactive Bash Terminal (~)"
          >
            <i className="ri-code-s-slash-line text-slate-950"></i>
            <span>TERMINAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
