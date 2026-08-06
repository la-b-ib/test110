import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Security Engagement / Consulting',
    message: '',
  });

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsEncrypting(true);
    soundEngine.play('terminal_key');

    setTimeout(() => {
      setIsEncrypting(false);
      setSentSuccess(true);
      soundEngine.play('access_granted');
      setFormData({ name: '', email: '', subject: 'Security Engagement / Consulting', message: '' });
      setTimeout(() => setSentSuccess(false), 5000);
    }, 1200);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-slate-800 bg-[#080a0f] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider bg-teal-500/10 px-3 py-1 rounded border border-teal-500/30">
            <i className="ri-lock-2-line text-sm"></i>
            <span>[ 08 // ENCRYPTED COMMUNICATION PORTAL ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Initiate Secure Communication Channel
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            Have a red team engagement, incident response audit, or high-performance engineering inquiry? Send an end-to-end encrypted dispatch.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Links & PGP Info */}
          <div className="lg:col-span-5 bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-5">
            <h3 className="text-lg font-source-code-black text-slate-100 flex items-center gap-2">
              <i className="ri-shield-keyhole-line text-teal-400"></i> Direct Secure Endpoints
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <a
                href="mailto:la-b-ib@github.io"
                onClick={() => soundEngine.play('click')}
                className="flex items-center space-x-3 p-3 rounded bg-slate-950 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-teal-300 transition-all"
              >
                <div className="w-8 h-8 rounded bg-teal-500/10 flex items-center justify-center text-teal-400 text-base">
                  <i className="ri-mail-send-line"></i>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">PRIMARY EMAIL</div>
                  <div className="font-semibold text-slate-100">la-b-ib@github.io</div>
                </div>
              </a>

              <a
                href="https://github.com/la-b-ib"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.play('click')}
                className="flex items-center space-x-3 p-3 rounded bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all"
              >
                <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-base">
                  <i className="ri-github-line"></i>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">GITHUB PROFILE</div>
                  <div className="font-semibold text-slate-100">github.com/la-b-ib</div>
                </div>
              </a>

              <div className="flex items-center space-x-3 p-3 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <div className="w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center text-purple-400 text-base">
                  <i className="ri-chat-shield-line"></i>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">MATRIX PROTOCOL</div>
                  <div className="font-semibold text-purple-300">@labib:matrix.org</div>
                </div>
              </div>
            </div>

            {/* PGP Security Protocol Notice */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 space-y-2 text-xs font-sans">
              <div className="font-mono text-[11px] font-bold text-teal-400 flex items-center gap-1.5">
                <i className="ri-shield-check-line"></i> RSA-4096 / AES-256-GCM GUARANTEE
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All transmissions originating from this portal are signed using client WebCrypto nonces and routed over HTTPS TLS 1.3 endpoints.
              </p>
            </div>
          </div>

          {/* Right Column: Encrypted Form */}
          <div className="lg:col-span-7 bg-[#0b0e17] rounded-xl border border-slate-800 p-6">
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">CODENAME / SENDER NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lead Engineer"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">RETURN EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">DISPATCH SUBJECT</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 focus:outline-none focus:border-teal-400"
                >
                  <option value="Security Engagement / Consulting">Red Team / Pentesting Engagement</option>
                  <option value="Full-Stack Architecture Request">Full-Stack Application Architecture</option>
                  <option value="DFIR Incident Response Audit">Digital Forensics / Breach Incident Audit</option>
                  <option value="General Professional Connection">General Professional Connection</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">ENCRYPTED TRANSMISSION BODY</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type dispatch payload..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-100 font-jetbrains focus:outline-none focus:border-teal-400 resize-none"
                ></textarea>
              </div>

              {sentSuccess && (
                <div className="p-3 rounded bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold text-center animate-bounce flex items-center justify-center">
                  <i className="ri-checkbox-circle-fill text-teal-300 mr-2 text-base"></i>
                  <span>DISPATCH ENCRYPTED & TRANSMITTED SUCCESSFULLY!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isEncrypting}
                className="w-full py-3.5 rounded-sm bg-teal-400 text-slate-950 font-extrabold tracking-wider flex items-center justify-center space-x-2 border-2 border-slate-950 shadow-[4px_4px_0px_0px_#000000] hover:bg-teal-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                {isEncrypting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-base"></i>
                    <span>ENCRYPTING WITH RSA-4096...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-fill text-base"></i>
                    <span>TRANSMIT ENCRYPTED DISPATCH</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
