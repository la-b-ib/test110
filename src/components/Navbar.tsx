import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { HeaderSearch } from './HeaderSearch';
import { Casefile } from '../types';

interface NavbarProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  onInspectCasefile?: (casefile: Casefile) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onSelectSection, onInspectCasefile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);

  // Global keyboard shortcut to toggle search drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'INTEL BRIEF', num: '01', href: '#about' },
    { label: 'THREAT RADAR', num: '02', href: '#threat-map' },
    { label: 'MISSIONS', num: '03', href: '#experience' },
    { label: 'ARSENAL', num: '04', href: '#skills' },
    { label: 'CASEFILES', num: '05', href: '#projects' },
    { label: 'CREDENTIALS', num: '06', href: '#certificates' },
    { label: 'AI AUDITOR', num: '07', href: '#ai-auditor' },
    { label: 'DISPATCHES', num: '08', href: '#blog' },
    { label: 'ENCRYPTED', num: '09', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    soundEngine.play('click');
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    onSelectSection(targetId);
  };

  return (
    <div className="w-full bg-[#080a0f]/95 backdrop-blur-md border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center space-x-2.5 group shrink-0"
        >
          <div className="w-8 h-8 rounded bg-teal-500/10 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 group-hover:border-teal-400 transition-all">
            <i className="ri-shield-keyhole-line text-base"></i>
          </div>
          <div>
            <div className="font-source-code-black text-base tracking-wider text-slate-100 flex items-center gap-1.5">
              LABIB <span className="text-teal-400 font-normal text-[11px] font-jetbrains">// SEC_OPS</span>
            </div>
            <div className="text-[9px] font-mono text-slate-400 tracking-tight hidden sm:block">
              ARCHITECT • OFFSEC • DFIR
            </div>
          </div>
        </a>

        {/* Search Trigger Icon Button */}
        <div className="flex items-center ml-auto xl:ml-0">
          <button
            onClick={() => {
              soundEngine.play('click');
              setSearchDrawerOpen(!searchDrawerOpen);
            }}
            className={`px-2.5 py-1 rounded-sm border-2 border-slate-950 transition-all flex items-center space-x-2 font-bold font-mono text-xs active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
              searchDrawerOpen
                ? 'bg-teal-400 text-slate-950 shadow-[2px_2px_0px_0px_#000000]'
                : 'bg-slate-900/90 text-teal-400 hover:text-slate-100 hover:bg-slate-800 shadow-[1.5px_1.5px_0px_0px_#000000]'
            }`}
            title="Open Search (⌘K)"
          >
            <i className="ri-search-line text-sm text-teal-400"></i>
            <span className="hidden sm:inline text-slate-200">SEARCH</span>
            <kbd className="hidden sm:inline-block bg-slate-950 border border-slate-800 text-[10px] text-slate-400 px-1 rounded">⌘K</kbd>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1 text-[11px] font-mono shrink-0">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-2 py-1 rounded-sm border-2 border-slate-950 transition-all flex items-center space-x-1 font-bold active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  isActive
                    ? 'bg-teal-400 text-slate-950 shadow-[2px_2px_0px_0px_#000000]'
                    : 'bg-slate-900/90 text-slate-300 hover:text-slate-100 hover:bg-slate-800 shadow-[1.5px_1.5px_0px_0px_#000000]'
                }`}
              >
                <span className={isActive ? 'text-slate-950 font-extrabold' : 'text-teal-400 font-bold'}>
                  {link.num}
                </span>
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Mobile / Tablet Menu Toggle */}
        <div className="xl:hidden flex items-center shrink-0">
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              soundEngine.play('click');
            }}
            className="p-1.5 rounded-sm bg-slate-900 border-2 border-slate-950 text-slate-200 hover:text-cyan-300 shadow-[2px_2px_0px_0px_#44bd32] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <i className={mobileMenuOpen ? 'ri-close-line text-lg' : 'ri-menu-4-line text-lg'}></i>
          </button>
        </div>
      </div>

      {/* Dedicated Dropdown Search Bar Row (Appears under Header) */}
      {searchDrawerOpen && (
        <div className="w-full bg-[#080b12] border-t border-b-2 border-slate-800 border-b-slate-950 px-4 py-3 shadow-2xl animate-fadeIn">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="flex-1">
              <HeaderSearch
                autoFocus
                placeholder="Search site items, casefiles, skills, dispatches (e.g. OSCP, Metasploit, React)..."
                onClose={() => setSearchDrawerOpen(false)}
                onSelectSection={(sectionId) => {
                  setSearchDrawerOpen(false);
                  onSelectSection(sectionId);
                }}
                onInspectCasefile={(casefile) => {
                  setSearchDrawerOpen(false);
                  if (onInspectCasefile) onInspectCasefile(casefile);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.play('click');
                setSearchDrawerOpen(false);
              }}
              className="px-2.5 py-1 bg-slate-900 border-2 border-slate-950 text-slate-400 hover:text-slate-100 rounded-sm cursor-pointer shrink-0 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 font-mono text-xs"
              title="Close search"
            >
              <i className="ri-close-line text-base"></i>
              <span className="hidden sm:inline">CLOSE</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0a0d14] border-b-2 border-slate-950 px-4 py-3 space-y-3 font-mono text-xs">
          {/* Mobile Search Bar inside Hamburger Menu */}
          <div className="w-full pb-2 border-b border-slate-800/80">
            <HeaderSearch
              onSelectSection={(sectionId) => {
                setMobileMenuOpen(false);
                onSelectSection(sectionId);
              }}
              onInspectCasefile={(casefile) => {
                setMobileMenuOpen(false);
                if (onInspectCasefile) onInspectCasefile(casefile);
              }}
            />
          </div>

          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`py-2 px-3 rounded-sm border-2 border-slate-950 transition-all flex items-center space-x-2 font-bold shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                    isActive
                      ? 'bg-teal-400 text-slate-950 font-extrabold'
                      : 'bg-slate-900 text-slate-200 hover:text-cyan-300'
                  }`}
                >
                  <span className={isActive ? 'text-slate-950 font-extrabold' : 'text-teal-400 font-bold'}>{link.num}.</span>
                  <span className="font-bold">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

