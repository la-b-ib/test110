import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/soundEngine';

interface CtfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CtfModal: React.FC<CtfModalProps> = ({ isOpen, onClose }) => {
  const [flagInput, setFlagInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const targetFlag = 'CTF{L4B1B_Z3R0_TRU5T_2026}';

  const handleVerifyFlag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = flagInput.trim();

    if (clean === targetFlag || clean.toUpperCase() === 'CTF{L4B1B_Z3R0_TRU5T_2026}') {
      setSolved(true);
      setErrorMsg('');
      soundEngine.play('access_granted');

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2dd4bf', '#06b6d4', '#f59e0b', '#a855f7'],
        });
      } catch {
        // Fallback
      }
    } else {
      soundEngine.play('error');
      setErrorMsg('[-] INVALID FLAG KEY. RE-PARSE BASE64 CRYPTO MATRIX HINT.');
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full max-w-xs sm:max-w-md md:max-w-lg max-h-[calc(100dvh-95px)] overflow-y-auto p-4 sm:p-6 space-y-5 shadow-2xl relative my-auto">
        <button
          onClick={() => {
            onClose();
            soundEngine.play('click');
          }}
          className="absolute top-4 right-4 p-1.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-400 hover:text-slate-100 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl">
            <i className="ri-flag-2-line"></i>
          </div>
          <div>
            <div className="text-[10px] font-mono text-amber-400 font-bold tracking-wider uppercase">
              CAPTURE THE FLAG // DECIPHER CHALLENGE
            </div>
            <h3 className="text-xl font-source-code-black text-slate-100">
              CTF Flag Verification Engine
            </h3>
          </div>
        </div>

        {/* Challenge Box */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
          <div className="text-slate-400 font-semibold">CHALLENGE HINT & BASE64 CIPHER:</div>
          <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-teal-300 text-[11px] break-all font-jetbrains">
            Q1RGe0w0QjFCX1ozUjBfVFJVM1RfMjAyNn0=
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Decipher the Base64 string payload above and enter the resulting CTF flag in the input format <code className="text-amber-300">CTF{'{...}'}</code>.
          </p>
        </div>

        {solved ? (
          <div className="bg-teal-500/20 border border-teal-500/40 p-4 rounded-lg text-center space-y-2">
            <div className="text-teal-300 font-source-code-black text-lg flex items-center justify-center">
              <i className="ri-trophy-line text-amber-400 mr-2 text-xl"></i>
              <span>FLAG CAPTURED & VERIFIED!</span>
            </div>
            <div className="text-xs font-mono text-slate-200">
              CTF{'{L4B1B_Z3R0_TRU5T_2026}'}
            </div>
            <div className="text-[11px] text-teal-400 font-mono">
              +500 SEC_OPS EXP POINTS AWARDED TO CLEARANCE RECORD
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyFlag} className="space-y-3 font-mono text-xs">
            <input
              type="text"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              placeholder="Enter CTF flag key..."
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-100 font-jetbrains focus:outline-none focus:border-amber-400"
            />

            {errorMsg && (
              <div className="text-rose-400 text-[11px] font-mono font-semibold">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-sm bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono font-extrabold text-xs tracking-wider border-2 border-slate-950 shadow-[4px_4px_0px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              SUBMIT & DECRYPT FLAG
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
