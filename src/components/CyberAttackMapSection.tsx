import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { GlobeGLComponent, City3D, Attack3D } from './GlobeGLComponent';
import {
  ALL_CYBER_ATTACK_TYPES,
  CYBER_ATTACK_COLOR_MAP,
  getAttackColor,
  hexToRgba,
} from '../utils/cyberAttackTypes';

interface AttackEvent extends Attack3D {
  timestamp: string;
  sourceCountry: string;
  sourceCode: string;
  targetCountry: string;
  targetCode: string;
  port: number;
  protocol: 'TCP' | 'UDP' | 'HTTP/2' | 'DNS' | 'ICMP';
  cveId: string;
  payloadSnippet: string;
  mitigationStatus: string;
}

const CITIES: City3D[] = [
  { name: 'San Francisco', country: 'United States', code: 'US', lat: 37.7749, lng: -122.4194 },
  { name: 'New York', country: 'United States', code: 'US', lat: 40.7128, lng: -74.0060 },
  { name: 'Toronto', country: 'Canada', code: 'CA', lat: 43.6532, lng: -79.3832 },
  { name: 'Mexico City', country: 'Mexico', code: 'MX', lat: 19.4326, lng: -99.1332 },
  { name: 'Sao Paulo', country: 'Brazil', code: 'BR', lat: -23.5505, lng: -46.6333 },
  { name: 'Buenos Aires', country: 'Argentina', code: 'AR', lat: -34.6037, lng: -58.3816 },
  { name: 'Reykjavik', country: 'Iceland', code: 'IS', lat: 64.1466, lng: -21.9426 },
  { name: 'London', country: 'United Kingdom', code: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', code: 'FR', lat: 48.8566, lng: 2.3522 },
  { name: 'Frankfurt', country: 'Germany', code: 'DE', lat: 50.1109, lng: 8.6821 },
  { name: 'Stockholm', country: 'Sweden', code: 'SE', lat: 59.3293, lng: 18.0686 },
  { name: 'Moscow', country: 'Russia', code: 'RU', lat: 55.7558, lng: 37.6173 },
  { name: 'Cairo', country: 'Egypt', code: 'EG', lat: 30.0444, lng: 31.2357 },
  { name: 'Dubai', country: 'UAE', code: 'AE', lat: 25.2048, lng: 55.2708 },
  { name: 'Johannesburg', country: 'South Africa', code: 'ZA', lat: -26.2041, lng: 28.0473 },
  { name: 'Mumbai', country: 'India', code: 'IN', lat: 19.0760, lng: 72.8777 },
  { name: 'Singapore', country: 'Singapore', code: 'SG', lat: 1.3521, lng: 103.8198 },
  { name: 'Hong Kong', country: 'Hong Kong', code: 'HK', lat: 22.3193, lng: 114.1694 },
  { name: 'Beijing', country: 'China', code: 'CN', lat: 39.9042, lng: 116.4074 },
  { name: 'Seoul', country: 'South Korea', code: 'KR', lat: 37.5665, lng: 126.9780 },
  { name: 'Tokyo', country: 'Japan', code: 'JP', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', code: 'AU', lat: -33.8688, lng: 151.2093 },
];

const ATTACK_TYPES = [
  'Malware',
  'Ransomware',
  'Zero-Day Exploit',
  'SQL Injection',
  'Botnet C2',
  'Phishing',
  'DDoS',
];

const PROTOCOLS: AttackEvent['protocol'][] = ['TCP', 'UDP', 'HTTP/2', 'DNS', 'ICMP'];
const PORTS = [443, 80, 22, 3389, 8080, 53, 445, 1433, 21];

const CVES = [
  'CVE-2024-6387 (RegreSSHion RCE)',
  'CVE-2023-4863 (WebP Heap Overflow)',
  'CVE-2024-21626 (runc Container Escape)',
  'CVE-2023-38606 (Triangulation Kernel Exploit)',
  'CVE-2024-30078 (Windows Driver RCE)',
  'CVE-2024-27198 (JetBrains Auth Bypass)',
];

const PAYLOADS = [
  'POST /api/v1/auth/session HTTP/2 "UNION SELECT 1,@@version--"',
  '0x414141414141414100803f2a... [Kernel RCE Overflow Payload]',
  'SYN Flood 240,000 pps -> port 443 (Botnet Cluster #14)',
  'GET /wp-login.php HTTP/1.1 (BruteForce 8,500 attempts/sec)',
  'PAYLOAD_EXEC: ransomware_drop_v4.exe -key AES256_RSA4096',
  'DNS QNAME: evil-c2-domain.xyz TXT [Tunneling Command]',
];

interface CyberAttackMapSectionProps {
  crtActive?: boolean;
  onToggleCrt?: () => void;
}

export const CyberAttackMapSection: React.FC<CyberAttackMapSectionProps> = ({
  crtActive = true,
  onToggleCrt,
}) => {
  const [attacks, setAttacks] = useState<AttackEvent[]>([]);
  const [liveLog, setLiveLog] = useState<AttackEvent[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [attacksToday, setAttacksToday] = useState<number>(18492040);
  const [selectedAttack, setSelectedAttack] = useState<AttackEvent | null>(null);
  const [hoveredAttackId, setHoveredAttackId] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showTaxonomyModal, setShowTaxonomyModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);

  // Generate random attack event from 25 Cyber Attack types
  const generateAttack = (): AttackEvent => {
    let sourceIdx = Math.floor(Math.random() * CITIES.length);
    let targetIdx = Math.floor(Math.random() * CITIES.length);
    while (sourceIdx === targetIdx) {
      targetIdx = Math.floor(Math.random() * CITIES.length);
    }

    const source = CITIES[sourceIdx];
    const target = CITIES[targetIdx];
    const type = ALL_CYBER_ATTACK_TYPES[Math.floor(Math.random() * ALL_CYBER_ATTACK_TYPES.length)];
    
    const highRisk = [
      'Ransomware',
      'Zero-Day Exploit',
      'Supply Chain Attack',
      'Buffer Overflow',
      'Malware / Trojan',
      'Insider Threat / Exfiltration',
    ];
    
    const severity: AttackEvent['severity'] = highRisk.includes(type)
      ? 'CRITICAL'
      : Math.random() > 0.45
      ? 'HIGH'
      : 'MEDIUM';

    return {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sourceCity: source.name,
      sourceCountry: source.country,
      sourceCode: source.code,
      sourceLat: source.lat,
      sourceLng: source.lng,
      targetCity: target.name,
      targetCountry: target.country,
      targetCode: target.code,
      targetLat: target.lat,
      targetLng: target.lng,
      type,
      port: PORTS[Math.floor(Math.random() * PORTS.length)],
      severity,
      protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
      cveId: CVES[Math.floor(Math.random() * CVES.length)],
      payloadSnippet: PAYLOADS[Math.floor(Math.random() * PAYLOADS.length)],
      mitigationStatus: 'DROPPED BY eBPF KERNEL FILTER',
    };
  };

  // Seed initial discrete attack impulses
  useEffect(() => {
    const initialAttacks = Array.from({ length: 7 }, () => generateAttack());
    setAttacks(initialAttacks);
    setLiveLog(initialAttacks);
  }, []);

  // Discrete real-time attack pulse feed
  useEffect(() => {
    if (!isLive) return;

    const intervalTime = Math.max(500, 1500 / speedMultiplier);
    const interval = setInterval(() => {
      const newAttack = generateAttack();
      setAttacks((prev) => [newAttack, ...prev.slice(0, 7)]);
      setLiveLog((prev) => [newAttack, ...prev.slice(0, 29)]);
      setAttacksToday((prev) => prev + Math.floor(Math.random() * 8) + 1);

      if (audioFeedback && Math.random() > 0.65) {
        soundEngine.play('terminal_key');
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLive, speedMultiplier, audioFeedback]);

  const filteredLogs = liveLog.filter((item) => {
    const matchSev = filterSeverity === 'ALL' || item.severity === filterSeverity;
    const matchType = filterType === 'ALL' || item.type === filterType;
    return matchSev && matchType;
  });

  const handleCopyPayload = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    soundEngine.play('click');
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <section id="threat-map" className="py-16 md:py-24 border-b border-slate-800 bg-[#05070c] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* SECTION HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center space-x-2 text-xs font-mono text-rose-400 font-bold tracking-widest bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/30">
                <i className="ri-radar-line text-sm text-rose-500 animate-spin"></i>
                <span>[ 02 // LIVE SOC THREATMAP & RADAR ]</span>
              </span>
              <span className="text-xs font-mono text-teal-400 font-semibold bg-teal-500/10 px-2.5 py-1 rounded border border-teal-500/30">
                REAL 3D GLOBE TELEMETRY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100 flex items-center gap-3">
              Global Threat Operations Center
            </h2>
          </div>

          {/* STREAM CONTROLS */}
          <div className="flex flex-wrap items-center gap-2 bg-[#0b0e17] p-2.5 rounded-sm border-2 border-slate-950 shadow-xl">
            <button
              onClick={() => {
                setIsLive(!isLive);
                soundEngine.play('click');
              }}
              className={`px-4 py-2 rounded-sm font-mono text-xs font-extrabold flex items-center space-x-2 border-2 border-slate-950 transition-all cursor-pointer shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isLive
                  ? 'bg-rose-500 text-slate-950 hover:bg-rose-400'
                  : 'bg-slate-800 text-slate-300 hover:text-slate-100'
              }`}
            >
              <i className={isLive ? 'ri-pause-circle-line text-slate-950 text-sm' : 'ri-play-circle-line text-slate-300 text-sm'}></i>
              <span>{isLive ? 'LIVE STREAM' : 'PAUSED'}</span>
            </button>

            {/* Auto-Rotation Toggle */}
            <button
              onClick={() => {
                setAutoRotate(!autoRotate);
                soundEngine.play('click');
              }}
              className={`px-3 py-2 rounded-sm font-mono text-xs font-extrabold flex items-center space-x-1.5 transition-all border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                autoRotate
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  : 'bg-slate-900 text-slate-300 hover:text-slate-100'
              }`}
              title="Toggle 3D Globe Auto-Rotation"
            >
              <i className="ri-earth-line text-sm"></i>
              <span>{autoRotate ? '3D SPIN: ON' : '3D SPIN: OFF'}</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center space-x-1 bg-slate-900 px-2 py-1.5 rounded-sm border-2 border-slate-950 text-xs font-mono shadow-[2px_2px_0px_0px_#000000]">
              <span className="text-slate-400 text-[10px] font-bold mr-1">SPEED:</span>
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setSpeedMultiplier(spd);
                    soundEngine.play('click');
                  }}
                  className={`px-2 py-0.5 rounded-sm text-[10px] font-extrabold transition-colors border border-slate-950 ${
                    speedMultiplier === spd
                      ? 'bg-teal-400 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setAudioFeedback(!audioFeedback);
                soundEngine.play('click');
              }}
              className={`p-2 rounded-sm border-2 border-slate-950 transition-all shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                audioFeedback
                  ? 'bg-teal-400 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle audio feedback"
            >
              <i className={audioFeedback ? 'ri-volume-up-line text-sm' : 'ri-volume-mute-line text-sm'}></i>
            </button>

            {/* CRT Effect Toggle on Globe */}
            {onToggleCrt && (
              <button
                onClick={() => {
                  onToggleCrt();
                  soundEngine.play('click');
                }}
                className={`px-3 py-2 rounded-sm font-mono text-xs font-extrabold flex items-center space-x-1.5 transition-all border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                  crtActive
                    ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle CRT Shader Effect on Globe"
              >
                <i className="ri-tv-2-line text-sm"></i>
                <span>{crtActive ? 'GLOBE CRT: ON' : 'GLOBE CRT: OFF'}</span>
              </button>
            )}
          </div>
        </div>

        {/* TOP METRICS TICKER */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-4 space-y-1 relative overflow-hidden group hover:border-teal-500/40 transition-all shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <i className="ri-shield-flash-line text-rose-400"></i>
                <span>ATTACKS TODAY</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-source-code-black text-rose-400 font-bold tracking-tight">
              {attacksToday.toLocaleString()}
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Avg <span className="text-rose-400 font-semibold">+1,850</span>/min global rate
            </p>
          </div>

          <div className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-4 space-y-1 relative overflow-hidden group hover:border-teal-500/40 transition-all shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <i className="ri-earth-line text-teal-400"></i>
              <span>TOP TARGET COUNTRY</span>
            </div>
            <div className="text-xl font-source-code-black text-slate-100 flex items-center space-x-2 pt-0.5">
              <i className="ri-building-4-line text-teal-400 text-lg"></i>
              <span>UNITED STATES [US]</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              28.4% target payload share
            </p>
          </div>

          <div className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-4 space-y-1 relative overflow-hidden group hover:border-teal-500/40 transition-all shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <i className="ri-map-pin-user-line text-cyan-400"></i>
              <span>TOP ORIGIN COUNTRY</span>
            </div>
            <div className="text-xl font-source-code-black text-slate-100 flex items-center space-x-2 pt-0.5">
              <i className="ri-global-line text-cyan-400 text-lg"></i>
              <span>RUSSIA / CHINA [RU/CN]</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              31.2% origin botnet cluster share
            </p>
          </div>

          <div className="bg-[#0b0e17] rounded-xl border border-slate-800/90 p-4 space-y-1 relative overflow-hidden group hover:border-teal-500/40 transition-all shadow-lg">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
              <i className="ri-bug-line text-amber-400"></i>
              <span>TOP ATTACK VECTOR</span>
            </div>
            <div className="text-lg font-source-code-black text-amber-300 pt-1 truncate">
              ZERO-DAY & RANSOMWARE
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Port 443 & 22 primary targets
            </p>
          </div>
        </div>

        {/* MAIN MAP CANVAS & FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive 3D Globe Canvas (2 Columns) */}
          <div className="lg:col-span-2 bg-[#090c14] rounded-xl border border-slate-800 p-4 sm:p-6 space-y-4 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            {/* Top Bar inside Map Canvas */}
            <div className="flex items-center justify-between z-10 flex-wrap gap-2 border-b border-slate-800/60 pb-3">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 font-bold">
                <i className="ri-radar-fill text-rose-500 text-base"></i>
                <span>REAL 3D GLOBE // VECTOR TRAJECTORY ARROW STAGE</span>
              </div>

              {/* Legend Badges & Taxonomy Button */}
              <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
                <button
                  onClick={() => {
                    setShowTaxonomyModal(true);
                    soundEngine.play('click');
                  }}
                  className="px-2.5 py-1 rounded-sm bg-cyan-400 text-slate-950 hover:bg-cyan-300 text-[10px] font-extrabold flex items-center space-x-1 cursor-pointer transition-all border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <i className="ri-palette-line"></i>
                  <span>25 THREAT COLOR CODES</span>
                </button>

                <div className="hidden sm:flex items-center space-x-2 text-[10px] border-l border-slate-800 pl-3">
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] shadow-[0_0_8px_#FF3366]"></span>
                    <span className="text-slate-200 font-bold">Critical</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] shadow-[0_0_8px_#FFB800]"></span>
                    <span className="text-slate-200 font-bold">High</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#44bd32] shadow-[0_0_8px_#44bd32]"></span>
                    <span className="text-slate-200 font-bold">Medium</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3D GLOBE.GL NIGHT RADAR STAGE CONTAINER */}
            <div className={`relative w-full aspect-[16/9] min-h-[400px] bg-[#050811] rounded-lg border border-slate-800/90 overflow-hidden group shadow-inner ${crtActive ? 'animate-crt-flicker' : ''}`}>
              <GlobeGLComponent
                cities={CITIES}
                attacks={attacks}
                autoRotate={autoRotate}
                selectedAttackId={selectedAttack?.id}
                hoveredAttackId={hoveredAttackId}
                hoveredCity={hoveredCity}
                onHoverCity={setHoveredCity}
              />

              {/* CRT Scanline & Vignette Shader Layer localized exclusively to the 3D Globe */}
              {crtActive && (
                <div className="absolute inset-0 z-10 pointer-events-none scanlines crt-vignette opacity-80 rounded-lg" />
              )}

              {/* Selected Attack Details Drawer Overlay */}
              {selectedAttack && (
                <div className="absolute bottom-3 left-3 right-3 bg-[#0b0e17]/95 backdrop-blur-md border border-slate-700 p-4 rounded-lg flex items-center justify-between z-20 shadow-2xl animate-fadeIn">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-rose-400 flex items-center space-x-1">
                        <i className="ri-alarm-warning-line text-sm"></i>
                        <span>[{selectedAttack.severity}] {selectedAttack.type}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        PORT {selectedAttack.port} // {selectedAttack.protocol}
                      </span>
                      <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                        {selectedAttack.cveId}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-200 flex items-center space-x-2">
                      <span>ORIGIN:</span>
                      <span className="text-teal-400 font-bold flex items-center space-x-1">
                        <i className="ri-map-pin-line text-xs"></i>
                        <span>{selectedAttack.sourceCity}, {selectedAttack.sourceCountry} [{selectedAttack.sourceCode}]</span>
                      </span>
                      <i className="ri-arrow-right-line text-slate-500"></i>
                      <span>TARGET:</span>
                      <span className="text-cyan-400 font-bold flex items-center space-x-1">
                        <i className="ri-focus-3-line text-xs"></i>
                        <span>{selectedAttack.targetCity}, {selectedAttack.targetCountry} [{selectedAttack.targetCode}]</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        soundEngine.play('click');
                      }}
                      className="px-3 py-1.5 rounded-sm bg-teal-400 text-slate-950 font-mono text-xs font-extrabold hover:bg-teal-300 transition-all border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center space-x-1 cursor-pointer"
                    >
                      <i className="ri-file-search-line"></i>
                      <span>DOSSIER</span>
                    </button>
                    <button
                      onClick={() => setSelectedAttack(null)}
                      className="p-1 text-slate-400 hover:text-slate-100 cursor-pointer rounded-sm bg-slate-900 border-2 border-slate-950 shadow-[2px_2px_0px_0px_#000000]"
                    >
                      <i className="ri-close-line text-lg"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Radar Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
              <span className="flex items-center space-x-1.5">
                <i className="ri-global-line text-teal-400"></i>
                <span>SOC HONEYPOT NODES: 22 GEOLOCATED REGIONS</span>
              </span>
              <span className="flex items-center space-x-1.5 text-slate-300">
                <i className="ri-shield-check-line text-teal-400"></i>
                <span>AUTOMATED eBPF DROP & MITIGATION ACTIVE</span>
              </span>
            </div>
          </div>

          {/* Live Incident Stream Feed Table (1 Column) */}
          <div className="bg-[#090c14] rounded-xl border border-slate-800 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
            {/* Header & Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-200 font-bold">
                  <i className="ri-pulse-line text-rose-400 text-sm"></i>
                  <span>LIVE INCIDENT STREAM</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {filteredLogs.length} EVENTS
                </span>
              </div>

              {/* Type Category Filter Pills & 25-Type Dropdown */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap gap-1 items-center">
                  {['ALL', 'Ransomware', 'Zero-Day Exploit', 'DDoS', 'Phishing'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setFilterType(t);
                        soundEngine.play('click');
                      }}
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all border cursor-pointer ${
                        filterType === t
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono text-slate-400">SELECT TYPE:</span>
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      soundEngine.play('click');
                    }}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] font-mono text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="ALL">ALL 25 THREAT TYPES</option>
                    {ALL_CYBER_ATTACK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type} ({CYBER_ATTACK_COLOR_MAP[type] || '#00F0FF'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['ALL', 'CRITICAL', 'HIGH'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      setFilterSeverity(sev);
                      soundEngine.play('click');
                    }}
                    className={`flex-1 py-1 text-[10px] font-mono font-bold rounded transition-colors cursor-pointer ${
                      filterSeverity === sev
                        ? 'bg-slate-800 text-teal-300 border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident List */}
            <div className="flex-1 max-h-[380px] overflow-y-auto space-y-2 pr-1 font-jetbrains scrollbar-thin">
              {filteredLogs.map((atk) => {
                const isSelected = selectedAttack?.id === atk.id;
                const atkColor = getAttackColor(atk.type, atk.severity);
                return (
                  <div
                    key={atk.id}
                    onClick={() => {
                      setSelectedAttack(atk);
                      soundEngine.play('click');
                    }}
                    onMouseEnter={() => setHoveredAttackId(atk.id)}
                    onMouseLeave={() => setHoveredAttackId(null)}
                    className={`p-2.5 rounded-lg border text-xs font-mono space-y-1.5 cursor-pointer transition-all ${
                      isSelected || hoveredAttackId === atk.id
                        ? 'bg-slate-800/90 border-cyan-400/80 shadow-md shadow-cyan-950/50'
                        : 'bg-[#05070c] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">[{atk.id}] {atk.timestamp}</span>
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: atkColor,
                            boxShadow: `0 0 8px ${atkColor}`,
                          }}
                        ></span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                            atk.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : atk.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          }`}
                        >
                          {atk.severity}
                        </span>
                      </div>
                    </div>

                    <div className="font-bold text-slate-200 flex items-center justify-between flex-wrap gap-1">
                      <span className="flex items-center space-x-1.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border"
                          style={{
                            color: atkColor,
                            borderColor: hexToRgba(atkColor, 0.4),
                            backgroundColor: hexToRgba(atkColor, 0.12),
                          }}
                        >
                          {atk.type}
                        </span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">
                        <code style={{ color: atkColor }} className="font-bold">{atkColor}</code> :{atk.port} ({atk.protocol})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 truncate flex items-center space-x-1">
                      <span className="text-teal-400 font-semibold">{atk.sourceCity} [{atk.sourceCode}]</span>
                      <i className="ri-arrow-right-line text-[10px] text-slate-500"></i>
                      <span className="text-cyan-400 font-semibold">{atk.targetCity} [{atk.targetCode}]</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <i className="ri-check-double-line text-teal-400"></i>
                  <span>CHECK POINT TELEMETRY</span>
                </span>
                <span className="text-teal-400 font-bold">ACTIVE STREAM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED INCIDENT DOSSIER MODAL */}
      {showModal && selectedAttack && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full max-w-sm sm:max-w-xl md:max-w-2xl max-h-[calc(100dvh-95px)] overflow-y-auto p-4 sm:p-6 space-y-6 shadow-2xl relative my-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    [{selectedAttack.severity}] INCIDENT REPORT
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ID: {selectedAttack.id}
                  </span>
                </div>
                <h3 className="text-xl font-source-code-black text-slate-100 flex items-center space-x-2">
                  <i className="ri-shield-cross-line text-rose-400"></i>
                  <span>{selectedAttack.type} Attack Vector</span>
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-100 p-1 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* Details Body */}
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400">SOURCE NODE:</span>
                  <p className="text-teal-300 font-bold text-sm mt-0.5 flex items-center space-x-1">
                    <i className="ri-map-pin-2-line text-xs"></i>
                    <span>{selectedAttack.sourceCity}, {selectedAttack.sourceCountry} [{selectedAttack.sourceCode}]</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">TARGET HONEYPOT:</span>
                  <p className="text-cyan-300 font-bold text-sm mt-0.5 flex items-center space-x-1">
                    <i className="ri-focus-3-line text-xs"></i>
                    <span>{selectedAttack.targetCity}, {selectedAttack.targetCountry} [{selectedAttack.targetCode}]</span>
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">TARGET PORT / PROTOCOL:</span>
                  <p className="text-slate-200 font-bold mt-0.5">
                    Port {selectedAttack.port} ({selectedAttack.protocol})
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">ASSOCIATED CVE:</span>
                  <p className="text-amber-400 font-bold mt-0.5">
                    {selectedAttack.cveId}
                  </p>
                </div>
              </div>

              {/* Payload Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span>INTERCEPTED PAYLOAD SNIPPET:</span>
                  <button
                    onClick={() => handleCopyPayload(selectedAttack.payloadSnippet)}
                    className="text-teal-400 hover:text-teal-300 text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <i className={copiedId ? 'ri-check-line' : 'ri-file-copy-line'}></i>
                    <span>{copiedId ? 'COPIED!' : 'COPY PAYLOAD'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-rose-300 break-all select-all font-mono">
                  {selectedAttack.payloadSnippet}
                </div>
              </div>

              {/* Mitigation Rule */}
              <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/30 space-y-1">
                <span className="text-teal-400 font-bold flex items-center space-x-1">
                  <i className="ri-checkbox-circle-line"></i>
                  <span>DEFENSE & MITIGATION ACTION:</span>
                </span>
                <p className="text-slate-300 leading-relaxed font-sans text-xs">
                  {selectedAttack.mitigationStatus}. eBPF program <code className="text-teal-300 font-mono">xdp_drop_bad_tcp</code> executed within 0.02ms of packet ingress. Zero system impact.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold cursor-pointer"
              >
                CLOSE DOSSIER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 25 CYBER ATTACK TYPE THREAT TAXONOMY & COLOR CODES MODAL */}
      {showTaxonomyModal && (
        <div className="fixed inset-x-0 bottom-0 top-[60px] sm:top-[68px] z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b0e17] rounded-xl border-2 border-slate-950 w-full max-w-sm sm:max-w-2xl md:max-w-3xl max-h-[calc(100dvh-95px)] flex flex-col p-4 sm:p-6 space-y-4 shadow-2xl relative animate-fadeIn my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    SOC SPECIFICATION // COLOR MAPPING
                  </span>
                </div>
                <h3 className="text-lg font-source-code-black text-slate-100 flex items-center space-x-2">
                  <i className="ri-palette-line text-cyan-400"></i>
                  <span>25 Cyber Attack Threat Vector Color Codes</span>
                </h3>
              </div>
              <button
                onClick={() => setShowTaxonomyModal(false)}
                className="text-slate-400 hover:text-slate-100 p-1 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            {/* Modal Content - Scrollable 25 Type Table Grid */}
            <div className="flex-1 overflow-y-auto pr-1 font-mono text-xs space-y-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ALL_CYBER_ATTACK_TYPES.map((typeName) => {
                  const hexColor = CYBER_ATTACK_COLOR_MAP[typeName] || '#00F0FF';
                  return (
                    <div
                      key={typeName}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        {/* Swatch */}
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0 border border-white/20"
                          style={{
                            backgroundColor: hexColor,
                            boxShadow: `0 0 10px ${hexColor}`,
                          }}
                        ></span>

                        <div>
                          <p className="font-bold text-slate-100 text-xs">{typeName}</p>
                          <code className="text-[11px] font-bold" style={{ color: hexColor }}>
                            {hexColor}
                          </code>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setFilterType(typeName);
                          setShowTaxonomyModal(false);
                          soundEngine.play('click');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 group-hover:text-cyan-300 group-hover:border-cyan-500/50 border border-slate-800 text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        FILTER FEED
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800 flex-shrink-0">
              <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                <i className="ri-shield-check-line text-teal-400"></i>
                <span>ALL 25 COLOR CODES ACTIVE ON 3D GLOBE VECTOR ARCS</span>
              </span>
              <button
                onClick={() => setShowTaxonomyModal(false)}
                className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-400 cursor-pointer shadow-md"
              >
                CLOSE SPECIFICATION
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
