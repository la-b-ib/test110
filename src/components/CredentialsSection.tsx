import React, { useState } from 'react';
import {
  PROFILES_DATA,
  CERTIFICATIONS_DATA,
  BADGES_DATA,
  EDUCATION_DATA,
  THESIS_DATA,
  PUBLICATIONS_DATA,
  HONORS_DATA,
  ORGANIZATIONS_DATA,
} from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

type CategoryFilter = 'all' | 'cybersecurity' | 'cloud' | 'automation' | 'analytics';

export const CredentialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [activeTab, setActiveTab] = useState<'certifications' | 'badges'>('certifications');

  const categories: { id: CategoryFilter; label: string; icon: string; count: number }[] = [
    { id: 'all', label: 'ALL CREDENTIALS', icon: 'ri-apps-2-line', count: CERTIFICATIONS_DATA.length },
    {
      id: 'cybersecurity',
      label: 'CYBERSECURITY & FORENSICS',
      icon: 'ri-shield-keyhole-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'cybersecurity').length,
    },
    {
      id: 'cloud',
      label: 'SOFTWARE & CLOUD',
      icon: 'ri-code-box-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'cloud').length,
    },
    {
      id: 'automation',
      label: 'AUTOMATION & APIS',
      icon: 'ri-robot-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'automation').length,
    },
    {
      id: 'analytics',
      label: 'DATA & STRATEGY',
      icon: 'ri-bar-chart-box-line',
      count: CERTIFICATIONS_DATA.filter((c) => c.category === 'analytics').length,
    },
  ];

  const filteredCerts =
    activeCategory === 'all'
      ? CERTIFICATIONS_DATA
      : CERTIFICATIONS_DATA.filter((c) => c.category === activeCategory);

  return (
    <section id="certificates" className="py-16 md:py-24 border-b border-slate-800 bg-[#080a0f] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider bg-teal-500/10 px-3 py-1 rounded border border-teal-500/30">
            <i className="ri-award-line text-sm"></i>
            <span>[ ACADEMICS, RESEARCH & CERTIFICATIONS ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            Education, Publications & Industry Credentials
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl font-sans">
            Academic degree, thesis research, peer-reviewed IEEE publications, honors & awards, society affiliations, research profiles, and proctored certifications.
          </p>
        </div>

        {/* 1. ACADEMIC EDUCATION & THESIS GRID */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 uppercase tracking-widest">
            <i className="ri-graduation-cap-line text-lg"></i>
            <span>ACADEMIC BACKGROUND & THESIS RESEARCH</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Education Main Card */}
            <div className="lg:col-span-7 bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-5 shadow-xl hover:border-cyan-500/50 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-2xl shrink-0 group-hover:border-cyan-400 transition-colors">
                    <i className="ri-government-line"></i>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      UNDERGRADUATE DEGREE
                    </span>
                    <h3 className="text-xl font-source-code-black text-slate-100 group-hover:text-cyan-300 transition-colors mt-1">
                      {EDUCATION_DATA.institution}
                    </h3>
                    <p className="text-xs font-mono text-slate-300 font-semibold">
                      {EDUCATION_DATA.degree}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end font-mono text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-teal-300 font-bold">
                    {EDUCATION_DATA.duration}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <i className="ri-map-pin-line text-cyan-400"></i>
                    {EDUCATION_DATA.locationCoords}
                  </span>
                </div>
              </div>

              {/* CGPA Badge */}
              <div className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <i className="ri-trophy-line text-amber-400"></i> ACADEMIC STANDING (CGPA):
                </span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  {EDUCATION_DATA.cgpa}
                </span>
              </div>

              {/* Core Coursework */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                  <i className="ri-book-open-line text-teal-400"></i> CORE COURSEWORK:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EDUCATION_DATA.coreCoursework.map((course, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-300 hover:border-slate-700 transition-colors"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Thesis Card & Honors */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              {/* Thesis Card */}
              <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-4 shadow-xl hover:border-purple-500/50 transition-all group flex-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                    <i className="ri-flask-line"></i> {THESIS_DATA.type}
                  </span>
                  <span className="text-[11px] font-mono text-purple-400 font-bold">RESEARCH THESIS</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-source-code-black text-slate-100 group-hover:text-purple-300 transition-colors leading-snug">
                    "{THESIS_DATA.title}"
                  </h4>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {THESIS_DATA.summary}
                  </p>
                </div>
              </div>

              {/* Honors & Awards Box */}
              <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 space-y-3 shadow-xl hover:border-amber-500/50 transition-all group">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <i className="ri-medal-fill text-amber-400 text-sm"></i> HONORS & AWARDS
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">GOLD MEDALIST</span>
                </div>
                {HONORS_DATA.map((award) => (
                  <div key={award.id} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-100 font-bold">{award.title}</span>
                    <span className="text-amber-400 font-semibold text-[11px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                      INTERNATIONAL AWARD
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. CONFERENCE PUBLICATIONS */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <i className="ri-article-line text-lg"></i>
            <span>PEER-REVIEWED CONFERENCE PUBLICATIONS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PUBLICATIONS_DATA.map((pub) => (
              <div
                key={pub.id}
                className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xl relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                      IEEE INDEXED CONFERENCE
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <i className="ri-calendar-event-line text-cyan-400"></i>
                      {pub.date}
                    </span>
                  </div>

                  <h3 className="text-base font-source-code-black text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                    {pub.title}
                  </h3>

                  <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-1">
                    <p className="text-teal-400 font-semibold flex items-center gap-1">
                      <i className="ri-building-2-line"></i> {pub.conference}
                    </p>
                    <p className="text-slate-400 flex items-center gap-1 text-[11px]">
                      <i className="ri-map-pin-2-line text-slate-500"></i> Location: {pub.location}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Electronic ISBN: <span className="text-slate-200 font-bold">{pub.isbn}</span>
                    </p>
                  </div>
                </div>

                <a
                  href={pub.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEngine.play('click')}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-700 hover:border-cyan-400 text-slate-200 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all group/btn mt-4 shadow-sm"
                >
                  <i className="ri-file-list-3-line text-cyan-400 group-hover/btn:text-slate-950 text-sm"></i>
                  <span>VIEW IEEE XPLORE DOI PAPER</span>
                  <i className="ri-external-link-line text-xs opacity-70"></i>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ORGANIZATIONS, SOCIETIES & CLUBS */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-widest">
            <i className="ri-team-line text-lg"></i>
            <span>ORGANIZATIONS, SOCIETIES & CLUBS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ORGANIZATIONS_DATA.map((group, idx) => (
              <div key={idx} className="bg-[#0b0e17] rounded-xl border border-slate-800 p-6 space-y-4 shadow-xl">
                <h4 className="text-sm font-mono font-bold text-teal-300 uppercase border-b border-slate-800 pb-2 flex items-center gap-2">
                  <i className="ri-checkbox-circle-fill text-teal-400"></i> {group.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 font-semibold hover:border-teal-500/40 transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. VERIFIED RESEARCH & CREDENTIAL PROFILES */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
            <i className="ri-user-verified-line text-teal-400 text-lg"></i>
            <span>RESEARCH & CREDENTIAL PROFILES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROFILES_DATA.map((profile) => (
              <a
                key={profile.name}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.play('click')}
                className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 hover:border-teal-500/50 transition-all flex items-start justify-between group shadow-lg"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-11 h-11 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-teal-400 text-xl group-hover:border-teal-400 group-hover:bg-teal-500/10 transition-colors shrink-0">
                    <i className={profile.icon}></i>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="text-sm font-source-code-black text-slate-100 group-hover:text-teal-300 transition-colors">
                        {profile.name}
                      </h3>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${profile.badgeColor}`}>
                        {profile.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      {profile.platform}
                    </p>
                    <p className="text-xs text-slate-400 font-sans line-clamp-2 pt-0.5">
                      {profile.description}
                    </p>
                  </div>
                </div>
                <div className="text-slate-500 group-hover:text-teal-400 transition-colors shrink-0">
                  <i className="ri-external-link-line text-base"></i>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 5. SECTION TABS: CERTIFICATIONS VS BADGES */}
        <div className="pt-8 border-t border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 bg-slate-900/80 p-2 rounded-sm border-2 border-slate-950">
              <button
                onClick={() => {
                  setActiveTab('certifications');
                  soundEngine.play('click');
                }}
                className={`px-4 py-2 rounded-sm font-mono text-xs font-extrabold transition-all flex items-center space-x-2 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  activeTab === 'certifications'
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="ri-file-shield-line text-sm"></i>
                <span>PROFESSIONAL CERTIFICATIONS ({CERTIFICATIONS_DATA.length})</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('badges');
                  soundEngine.play('click');
                }}
                className={`px-4 py-2 rounded-sm font-mono text-xs font-extrabold transition-all flex items-center space-x-2 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  activeTab === 'badges'
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <i className="ri-verified-badge-line text-sm"></i>
                <span>VERIFIED BADGES ({BADGES_DATA.length})</span>
              </button>
            </div>

            {/* Category Filters (Visible when Certifications tab active) */}
            {activeTab === 'certifications' && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      soundEngine.play('click');
                    }}
                    className={`px-3 py-1.5 rounded font-mono text-[11px] font-semibold flex items-center space-x-1.5 transition-all border ${
                      activeCategory === cat.id
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <i className={`${cat.icon} text-xs`}></i>
                    <span>{cat.label}</span>
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categorized Certifications Grid */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-6 space-y-4 hover:border-teal-500/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-teal-500/5 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Header Row: Issuer Pill + Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-900 border border-slate-700 text-teal-400">
                          <i className="ri-building-line text-xs mr-1 text-slate-400"></i>
                          {cert.issuer}
                        </span>
                        {cert.status && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                            {cert.status}
                          </span>
                        )}
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start space-x-3 pt-1">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 text-xl shrink-0 group-hover:border-teal-500/40 group-hover:bg-teal-500/10 transition-all">
                          <i className={cert.icon}></i>
                        </div>
                        <h3 className="text-base font-source-code-black text-slate-100 leading-snug group-hover:text-teal-300 transition-colors">
                          {cert.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                        {cert.description}
                      </p>

                      {/* Credential ID if present */}
                      {cert.credentialId && (
                        <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60 flex items-center justify-between">
                          <span>CREDENTIAL ID:</span>
                          <span className="text-teal-400 font-semibold">{cert.credentialId}</span>
                        </div>
                      )}
                    </div>

                    {/* Direct Link / Verify Button */}
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-teal-500 hover:text-slate-950 border border-slate-700 hover:border-teal-400 text-slate-200 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all group/btn mt-4 shadow-sm"
                    >
                      <i className="ri-checkbox-circle-line text-teal-400 group-hover/btn:text-slate-950 text-sm"></i>
                      <span>VERIFY CREDENTIAL</span>
                      <i className="ri-external-link-line text-xs opacity-70"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Badges Grid */}
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 uppercase tracking-widest">
                  <i className="ri-verified-badge-line text-amber-400"></i>
                  <span>OFFICIAL DIGITAL BADGES (CREDLY & ISSUERS)</span>
                </div>
                <span className="text-xs font-mono text-teal-400 font-semibold">
                  {BADGES_DATA.length} VERIFIED BADGES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BADGES_DATA.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-6 space-y-4 hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg hover:shadow-amber-500/5 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* Header Row: Issuer + Issue Date */}
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
                          <i className="ri-award-line text-xs mr-1 text-amber-400"></i>
                          {badge.issuer}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {badge.issueDate}
                        </span>
                      </div>

                      {/* Title & Badge Icon */}
                      <div className="flex items-start space-x-3 pt-1">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 text-xl shrink-0 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-all">
                          <i className={badge.icon}></i>
                        </div>
                        <h3 className="text-base font-source-code-black text-slate-100 leading-snug group-hover:text-amber-300 transition-colors">
                          {badge.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {badge.description}
                      </p>

                      {/* Credential ID */}
                      <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex flex-col space-y-0.5">
                        <span className="text-slate-500">CREDENTIAL ID:</span>
                        <span className="text-amber-300 font-semibold break-all text-[11px]">
                          {badge.credentialId}
                        </span>
                      </div>
                    </div>

                    {/* Direct Link / Verify Button */}
                    <a
                      href={badge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.play('click')}
                      className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border border-slate-700 hover:border-amber-400 text-slate-200 font-mono text-xs font-bold flex items-center justify-center space-x-2 transition-all group/btn mt-4 shadow-sm"
                    >
                      <i className="ri-shield-check-line text-amber-400 group-hover/btn:text-slate-950 text-sm"></i>
                      <span>VERIFY BADGE ON CREDLY</span>
                      <i className="ri-external-link-line text-xs opacity-70"></i>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
