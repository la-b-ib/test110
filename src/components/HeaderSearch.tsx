import React, { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import { soundEngine } from '../utils/soundEngine';
import {
  SKILLS_DATA,
  MISSIONS_DATA,
  CASEFILES_DATA,
  CERTIFICATIONS_DATA,
  BADGES_DATA,
  PUBLICATIONS_DATA,
  DISPATCHES_DATA,
  RECOMMENDATIONS_DATA,
} from '../data/portfolioData';
import { Casefile } from '../types';

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Skill' | 'Casefile' | 'Mission' | 'Certificate' | 'Publication' | 'Dispatch' | 'Navigation' | 'Recommendation';
  description: string;
  sectionId: string;
  icon: string;
  badgeColor?: string;
  casefileData?: Casefile;
  tags?: string[];
}

interface HeaderSearchProps {
  onSelectSection: (sectionId: string) => void;
  onInspectCasefile?: (casefile: Casefile) => void;
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
  placeholder?: string;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  onSelectSection,
  onInspectCasefile,
  className = '',
  autoFocus = false,
  onClose,
  placeholder = 'Search site items, skills, casefiles...',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Quick filter categories
  const filterCategories = [
    { id: 'ALL', label: 'ALL', icon: 'ri-apps-2-line' },
    { id: 'Navigation', label: 'PAGES', icon: 'ri-compass-3-line' },
    { id: 'Casefile', label: 'CASEFILES', icon: 'ri-folder-shield-2-line' },
    { id: 'Skill', label: 'SKILLS', icon: 'ri-tools-line' },
    { id: 'Certificate', label: 'CERTS', icon: 'ri-award-line' },
    { id: 'Dispatch', label: 'BLOG', icon: 'ri-article-line' },
  ];

  // Build unified search items catalog
  const searchItems = useMemo<SearchItem[]>(() => {
    const items: SearchItem[] = [
      // Navigation Pages
      {
        id: 'nav-about',
        title: 'Intel Brief & Dossier',
        subtitle: 'About Labib Bin Shahed, Clearance, PGP Fingerprint',
        category: 'Navigation',
        description: 'OffSec Architect, RAM Forensics specialist, IEEE publications, background and bio.',
        sectionId: 'about',
        icon: 'ri-user-secret-line',
      },
      {
        id: 'nav-threat-map',
        title: 'Global Threat Operations Center',
        subtitle: '3D Interactive Cyber Attack Map',
        category: 'Navigation',
        description: 'Real-time honeypot attack telemetry, global 3D vector globe, attack origins and vectors.',
        sectionId: 'threat-map',
        icon: 'ri-radar-line',
      },
      {
        id: 'nav-missions',
        title: 'Operational Missions & Experience',
        subtitle: 'Work History & Cyber Defense Operations',
        category: 'Navigation',
        description: 'Principal OffSec Consultant, Lead Forensics Engineer, Full-Stack Security Lead.',
        sectionId: 'experience',
        icon: 'ri-shield-user-line',
      },
      {
        id: 'nav-arsenal',
        title: 'Arsenal & Technical Competencies',
        subtitle: 'Security Tools & Full-Stack Capabilities',
        category: 'Navigation',
        description: 'Metasploit, Burp Suite Pro, Volatility 3, Ghidra, React 19, Go, Rust, Wireshark, YARA.',
        sectionId: 'skills',
        icon: 'ri-tools-line',
      },
      {
        id: 'nav-casefiles',
        title: 'Casefiles & Project Repositories',
        subtitle: 'Open Source Security Tools & Platforms',
        category: 'Navigation',
        description: 'AetherShield, MemoryPulse, CypherNet, AegisAuth, KernelGuard, ThreatScope.',
        sectionId: 'projects',
        icon: 'ri-folder-shield-2-line',
      },
      {
        id: 'nav-certificates',
        title: 'Credentials & Verifications',
        subtitle: 'Certifications, Badges, IEEE Publications',
        category: 'Navigation',
        description: 'OSCP, CISSP, CEH Master, AWS Security Specialist, Credly Badges, Degree.',
        sectionId: 'certificates',
        icon: 'ri-award-line',
      },
      {
        id: 'nav-ai-auditor',
        title: 'AI Vulnerability Auditor',
        subtitle: 'Automated Code Audit & Hardening Engine',
        category: 'Navigation',
        description: 'Static analysis engine powered by Gemini AI for SQLi, XSS, RCE, & logic flaw detection.',
        sectionId: 'ai-auditor',
        icon: 'ri-cpu-line',
      },
      {
        id: 'nav-blog',
        title: 'Dispatches & Technical Research',
        subtitle: 'Cybersecurity Blog & Writeups',
        category: 'Navigation',
        description: 'Kernel exploitation writeups, memory injection analysis, zero-trust OAuth architectures.',
        sectionId: 'blog',
        icon: 'ri-article-line',
      },
      {
        id: 'nav-contact',
        title: 'Encrypted Contact & PGP Channel',
        subtitle: 'Secure Direct Communication',
        category: 'Navigation',
        description: 'Send encrypted dispatches, book security consultation, view public PGP key.',
        sectionId: 'contact',
        icon: 'ri-lock-2-line',
      },
    ];

    // Add Skills
    SKILLS_DATA.forEach((skill) => {
      items.push({
        id: `skill-${skill.id}`,
        title: skill.title,
        subtitle: `${skill.levelLabel} • ${skill.expYears}`,
        category: 'Skill',
        description: `${skill.description} Command: ${skill.command}`,
        sectionId: 'skills',
        icon: skill.icon,
        tags: [skill.category],
      });
    });

    // Add Missions
    MISSIONS_DATA.forEach((mission) => {
      items.push({
        id: `mission-${mission.id}`,
        title: mission.title,
        subtitle: `${mission.company} • ${mission.period}`,
        category: 'Mission',
        description: `${mission.summary} ${mission.bullets.join(' ')} ${mission.tech.join(' ')}`,
        sectionId: 'experience',
        icon: 'ri-shield-user-line',
        tags: mission.tech,
      });
    });

    // Add Casefiles
    CASEFILES_DATA.forEach((casefile) => {
      items.push({
        id: `casefile-${casefile.id}`,
        title: casefile.title,
        subtitle: `${casefile.caseId} • ${casefile.badge}`,
        category: 'Casefile',
        description: `${casefile.summary} ${casefile.tech.join(' ')} ${casefile.details.join(' ')}`,
        sectionId: 'projects',
        icon: 'ri-folder-shield-2-line',
        casefileData: casefile,
        tags: casefile.tech,
      });
    });

    // Add Certifications
    CERTIFICATIONS_DATA.forEach((cert) => {
      items.push({
        id: `cert-${cert.id}`,
        title: cert.title,
        subtitle: cert.issuer,
        category: 'Certificate',
        description: `${cert.description} ${cert.credentialId || ''}`,
        sectionId: 'certificates',
        icon: cert.icon || 'ri-award-line',
      });
    });

    // Add Badges
    BADGES_DATA.forEach((badge) => {
      items.push({
        id: `badge-${badge.id}`,
        title: badge.title,
        subtitle: badge.issuer,
        category: 'Certificate',
        description: `${badge.description} ID: ${badge.credentialId}`,
        sectionId: 'certificates',
        icon: badge.icon || 'ri-verified-badge-line',
      });
    });

    // Add Publications
    PUBLICATIONS_DATA.forEach((pub) => {
      items.push({
        id: `pub-${pub.id}`,
        title: pub.title,
        subtitle: pub.conference,
        category: 'Publication',
        description: `IEEE DOI: ${pub.doi} ISBN: ${pub.isbn}`,
        sectionId: 'certificates',
        icon: 'ri-article-line',
      });
    });

    // Add Dispatches
    DISPATCHES_DATA.forEach((dispatch) => {
      items.push({
        id: `dispatch-${dispatch.id}`,
        title: dispatch.title,
        subtitle: `${dispatch.date} • ${dispatch.readTime}`,
        category: 'Dispatch',
        description: `${dispatch.excerpt} ${dispatch.tags.join(' ')}`,
        sectionId: 'blog',
        icon: 'ri-article-line',
        tags: dispatch.tags,
      });
    });

    // Add Recommendations
    RECOMMENDATIONS_DATA.forEach((rec) => {
      items.push({
        id: `rec-${rec.id}`,
        title: `Peer Endorsement: ${rec.name}`,
        subtitle: `${rec.role} ${rec.organization ? '• ' + rec.organization : ''}`,
        category: 'Recommendation',
        description: rec.quote,
        sectionId: 'about',
        icon: 'ri-checkbox-circle-fill',
      });
    });

    return items;
  }, []);

  // Initialize Fuse.js instance
  const fuse = useMemo(() => {
    return new Fuse(searchItems, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'tags', weight: 0.25 },
        { name: 'subtitle', weight: 0.15 },
        { name: 'description', weight: 0.1 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 1,
    });
  }, [searchItems]);

  // Compute search results filtered by category
  const results = useMemo(() => {
    let list: SearchItem[] = [];
    if (!query.trim()) {
      // Default top suggestions when query is empty
      list = searchItems.filter(item => item.category === 'Navigation' || item.category === 'Casefile').slice(0, 8);
    } else {
      list = fuse.search(query.trim()).map(res => res.item);
    }

    if (selectedCategory !== 'ALL') {
      list = list.filter(item => item.category === selectedCategory);
    }

    return list.slice(0, 10);
  }, [query, fuse, searchItems, selectedCategory]);

  // Auto focus effect if requested
  useEffect(() => {
    if (autoFocus) {
      setIsOpen(true);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => {
          const next = !prev;
          if (next) {
            setTimeout(() => inputRef.current?.focus(), 50);
          } else if (onClose) {
            onClose();
          }
          return next;
        });
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Reset selectedIndex when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleSelectResult = (item: SearchItem) => {
    soundEngine.play('click');
    setIsOpen(false);
    setQuery('');
    onSelectSection(item.sectionId);
    if (item.casefileData && onInspectCasefile) {
      onInspectCasefile(item.casefileData);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectResult(results[selectedIndex]);
      }
    }
  };

  const getCategoryBadgeStyle = (cat: SearchItem['category']) => {
    switch (cat) {
      case 'Casefile':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/40';
      case 'Skill':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40';
      case 'Mission':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
      case 'Certificate':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      case 'Publication':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'Dispatch':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      case 'Navigation':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Helper to highlight matching characters in title
  const renderHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-teal-400/30 text-teal-200 underline decoration-teal-400 font-bold px-0.5 rounded-xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDownInInput}
          placeholder={placeholder}
          className="w-full bg-slate-900/90 border-2 border-slate-950 text-slate-100 placeholder-slate-400 font-mono text-xs pl-8 pr-14 py-1.5 rounded-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 shadow-[2px_2px_0px_0px_#000000] transition-all"
        />
        <i className="ri-search-line absolute left-2 text-slate-400 pointer-events-none"></i>
        
        {/* Right side controls (Clear / Shortcut) */}
        <div className="absolute right-1.5 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="search-result-item text-slate-400 hover:text-slate-100 p-0.5 rounded focus:outline-none"
              title="Clear search"
            >
              <i className="ri-close-line text-xs"></i>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-0.5 pointer-events-none">
            <kbd className="bg-slate-950 text-slate-400 border border-slate-800 text-[10px] font-mono px-1 rounded">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Instant Search Overlay Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[420px] md:w-[520px] mt-2 bg-[#090c13] border-2 border-slate-950 rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 overflow-hidden font-mono text-xs animate-fadeIn max-h-[85vh] flex flex-col">
          {/* Top Header & Telemetry Status */}
          <div className="bg-slate-950 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <i className="ri-radar-line text-teal-400 animate-pulse"></i>
              <span className="text-slate-400 font-bold">FUSE SEARCH ENGINE:</span>
              <strong className="text-teal-300 bg-teal-500/10 border border-teal-500/30 px-1.5 py-0.2 rounded text-[10px]">
                {query.trim() ? `${results.length} MATCHES` : 'RECOMMENDED INTEL'}
              </strong>
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <kbd className="bg-slate-900 border border-slate-800 px-1 rounded text-slate-400">ESC</kbd> CLOSE
            </span>
          </div>

          {/* Quick Filter Categories Bar */}
          <div className="bg-slate-900/80 px-2 py-1.5 border-b border-slate-800/80 flex items-center gap-1 overflow-x-auto scrollbar-none text-[10px]">
            <span className="text-slate-500 text-[9px] uppercase px-1 font-bold shrink-0">FILTER:</span>
            {filterCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundEngine.play('click');
                  setSelectedCategory(cat.id);
                }}
                className={`search-result-item shrink-0 px-2 py-0.5 rounded-xs border transition-all flex items-center gap-1 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-teal-400 text-slate-950 border-teal-300 font-black shadow-[1px_1px_0px_0px_#000]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <i className={`${cat.icon} text-[12px]`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/40 max-h-[420px]">
            {results.length === 0 ? (
              <div className="py-8 px-4 text-center text-slate-500 font-mono space-y-3">
                <i className="ri-search-eye-line text-3xl text-teal-400/50 block"></i>
                <p className="text-slate-300 font-bold">No telemetry entries found for "{query}"</p>
                <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                  Try searching for popular terms below:
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 pt-1 max-w-sm mx-auto">
                  {['OSCP', 'Metasploit', 'Volatility', 'React', 'Kernel', 'IEEE', 'Reverse Eng'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        setQuery(chip);
                        setSelectedCategory('ALL');
                        soundEngine.play('click');
                      }}
                      className="search-result-item text-[10px] bg-slate-900 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-sm transition-all"
                    >
                      +{chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const badgeStyle = getCategoryBadgeStyle(item.category);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`search-result-item w-full text-left p-2.5 rounded-sm transition-all flex items-start gap-3 cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-500/15 border-teal-400/80 text-slate-100 shadow-[0_0_15px_rgba(20,184,166,0.15)] pl-3'
                        : 'bg-slate-950/60 border-slate-800/60 hover:bg-slate-900/90 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    {/* Icon Box */}
                    <div className={`mt-0.5 p-1.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-teal-400 text-slate-950 border-teal-300' : 'bg-slate-900 text-teal-400 border-slate-800'
                    }`}>
                      <i className={`${item.icon} text-base`}></i>
                    </div>

                    {/* Text Body */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-100 text-xs truncate flex items-center gap-1.5">
                          {renderHighlightedText(item.title, query)}
                        </span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border uppercase shrink-0 ${badgeStyle}`}>
                          {item.category}
                        </span>
                      </div>

                      <div className="text-[11px] text-teal-400/90 font-medium truncate">
                        {renderHighlightedText(item.subtitle, query)}
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {renderHighlightedText(item.description, query)}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.tags.slice(0, 4).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts Guide */}
          <div className="bg-slate-950 px-3 py-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-900 px-1 py-0.2 border border-slate-800 text-slate-300 rounded">↑↓</kbd> NAVIGATE
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-900 px-1 py-0.2 border border-slate-800 text-teal-400 rounded">↵</kbd> OPEN
              </span>
            </div>
            <span className="text-teal-400/80 font-bold flex items-center gap-1">
              <i className="ri-shield-check-line text-xs"></i> VERIFIED INTEL
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
