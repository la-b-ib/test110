import React, { useState } from 'react';
import { HudTopbar } from './components/HudTopbar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { MissionsSection } from './components/MissionsSection';
import { ArsenalSection } from './components/ArsenalSection';
import { CasefilesSection } from './components/CasefilesSection';
import { CredentialsSection } from './components/CredentialsSection';
import { CyberAttackMapSection } from './components/CyberAttackMapSection';
import { AiSecurityAssistant } from './components/AiSecurityAssistant';
import { DispatchesSection } from './components/DispatchesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TerminalModal } from './components/TerminalModal';
import { CtfModal } from './components/CtfModal';
import { CasefileModal } from './components/CasefileModal';
import { Casefile } from './types';

export function App() {
  const [sfxActive, setSfxActive] = useState<boolean>(true);
  const [crtActive, setCrtActive] = useState<boolean>(true);
  const [terminalOpen, setTerminalOpen] = useState<boolean>(false);
  const [ctfOpen, setCtfOpen] = useState<boolean>(false);
  const [selectedCasefile, setSelectedCasefile] = useState<Casefile | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f6fa] relative flex flex-col justify-between">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl">
        <HudTopbar
          sfxActive={sfxActive}
          onToggleSfx={() => setSfxActive(!sfxActive)}
          crtActive={crtActive}
          onToggleCrt={() => setCrtActive(!crtActive)}
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenCtf={() => setCtfOpen(true)}
        />
        <Navbar
          activeSection={activeSection}
          onSelectSection={handleNavigate}
          onInspectCasefile={(file) => setSelectedCasefile(file)}
        />
      </header>

      {/* Main Application Content - Tabbed Single-Section View */}
      <main className="relative z-10 flex-1">
        <div className={activeSection === 'hero' ? 'block animate-fadeIn' : 'hidden'}>
          <HeroSection onOpenTerminal={() => setTerminalOpen(true)} onNavigate={handleNavigate} />
        </div>
        <div className={activeSection === 'about' ? 'block animate-fadeIn' : 'hidden'}>
          <AboutSection />
        </div>
        <div className={activeSection === 'threat-map' ? 'block animate-fadeIn' : 'hidden'}>
          <CyberAttackMapSection crtActive={crtActive} onToggleCrt={() => setCrtActive(!crtActive)} />
        </div>
        <div className={activeSection === 'experience' ? 'block animate-fadeIn' : 'hidden'}>
          <MissionsSection />
        </div>
        <div className={activeSection === 'skills' ? 'block animate-fadeIn' : 'hidden'}>
          <ArsenalSection />
        </div>
        <div className={activeSection === 'projects' ? 'block animate-fadeIn' : 'hidden'}>
          <CasefilesSection onInspectCasefile={(file) => setSelectedCasefile(file)} />
        </div>
        <div className={activeSection === 'certificates' ? 'block animate-fadeIn' : 'hidden'}>
          <CredentialsSection />
        </div>
        <div className={activeSection === 'ai-auditor' ? 'block animate-fadeIn' : 'hidden'}>
          <AiSecurityAssistant />
        </div>
        <div className={activeSection === 'blog' ? 'block animate-fadeIn' : 'hidden'}>
          <DispatchesSection />
        </div>
        <div className={activeSection === 'contact' ? 'block animate-fadeIn' : 'hidden'}>
          <ContactSection />
        </div>
      </main>

      {/* Footer - Hidden when Terminal is active */}
      {!terminalOpen && <Footer />}

      {/* Modals */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenCtf={() => {
          setTerminalOpen(false);
          setCtfOpen(true);
        }}
      />

      <CtfModal isOpen={ctfOpen} onClose={() => setCtfOpen(false)} />

      <CasefileModal casefile={selectedCasefile} onClose={() => setSelectedCasefile(null)} />
    </div>
  );
}

export default App;
