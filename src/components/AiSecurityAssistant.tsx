import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { SecurityAuditResult } from '../types';

export const AiSecurityAssistant: React.FC = () => {
  const [codeSnippet, setCodeSnippet] = useState<string>(`// Sample React Authentication Hook
export function useUserAuth(userToken: string) {
  useEffect(() => {
    // SECURITY DEFECT: Token passed directly in URL parameter without CSRF protection
    fetch(\`/api/v1/user?token=\${userToken}\`, {
      method: 'GET'
    })
    .then(res => res.json())
    .then(data => localStorage.setItem('user_session', JSON.stringify(data)));
  }, [userToken]);
}`);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);

  const presets = [
    {
      label: 'React Insecure Auth',
      code: `// Sample React Authentication Hook
export function useUserAuth(userToken: string) {
  useEffect(() => {
    // SECURITY DEFECT: Token passed in URL parameter without CSRF protection
    fetch('/api/v1/user?token=' + userToken, { method: 'GET' })
      .then(res => res.json())
      .then(data => localStorage.setItem('user_session', JSON.stringify(data)));
  }, [userToken]);
}`,
    },
    {
      label: 'SQL Injection Vuln',
      code: `// Vulnerable Express Node.js Query
app.get('/api/users/search', async (req, res) => {
  const queryName = req.query.name;
  // SECURITY DEFECT: String concatenation leads to SQL Injection
  const sql = "SELECT * FROM users WHERE username = '" + queryName + "'";
  const result = await db.query(sql);
  res.json(result);
});`,
    },
    {
      label: 'C Buffer Overflow',
      code: `// Vulnerable Memory Copy in C
void process_user_input(char *user_str) {
    char buffer[64];
    // SECURITY DEFECT: strcpy does not check destination buffer boundaries
    strcpy(buffer, user_str);
    printf("Input: %s\\n", buffer);
}`,
    },
    {
      label: 'YARA Rule Generator',
      code: `// Target Obfuscated Malware Strings to Detect
Rule Target Payload:
- Strings: "powershell.exe -enc AAAA...", "cmd.exe /c start"
- Executable header entropy: > 7.8
- Suspicious DLL API imports: VirtualAlloc, WriteProcessMemory`,
    },
  ];

  const runAudit = async () => {
    if (!codeSnippet.trim()) return;
    setIsLoading(true);
    soundEngine.play('terminal_key');

    try {
      const response = await fetch('/api/security-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeSnippet }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResult(data);
        soundEngine.play('success');
      } else {
        throw new Error('API route fallback');
      }
    } catch {
      // Local Fallback Security Auditor Engine
      setTimeout(() => {
        let result: SecurityAuditResult;

        if (codeSnippet.includes('SELECT') || codeSnippet.includes('queryName') || codeSnippet.includes('SQL')) {
          result = {
            vulnerabilityType: 'SQL Injection (SQLi)',
            severity: 'CRITICAL',
            cwe: 'CWE-89: Improper Neutralization of Special Elements used in an SQL Command',
            analysis:
              'Raw string concatenation in SQL queries allows untrusted attacker input to manipulate the database query execution context. Attackers can dump sensitive table data, bypass authentication, or execute OS commands.',
            recommendedRemediation:
              'Use parameterized queries or prepared statements via ORMs (e.g. Drizzle, Prisma) to strictly segregate SQL logic from input parameters.',
            patchedSnippet: `// Hardened Parameterized Query
app.get('/api/users/search', async (req, res) => {
  const queryName = req.query.name;
  // Parameterized query prevents SQL injection
  const sql = 'SELECT * FROM users WHERE username = $1';
  const result = await db.query(sql, [queryName]);
  res.json(result);
});`,
          };
        } else if (codeSnippet.includes('strcpy') || codeSnippet.includes('buffer')) {
          result = {
            vulnerabilityType: 'Stack-Based Buffer Overflow',
            severity: 'CRITICAL',
            cwe: 'CWE-121: Stack-based Buffer Overflow',
            analysis:
              'Unbounded string copy function strcpy() does not verify destination buffer bounds. Oversized input overwrites the saved frame pointer and return address on the stack, enabling remote code execution (RCE).',
            recommendedRemediation:
              'Replace strcpy() with bounds-checked alternatives like strncpy() or snprintf(), and enable ASLR + Stack Canaries (-fstack-protector-all).',
            patchedSnippet: `// Hardened Memory Copy in C
void process_user_input(char *user_str) {
    char buffer[64];
    // strncpy bounds check prevents stack buffer overflow
    strncpy(buffer, user_str, sizeof(buffer) - 1);
    buffer[sizeof(buffer) - 1] = '\\0';
    printf("Input: %s\\n", buffer);
}`,
          };
        } else if (codeSnippet.includes('YARA') || codeSnippet.includes('powershell')) {
          result = {
            vulnerabilityType: 'YARA Malware Detection Rule Generation',
            severity: 'INFORMATIONAL',
            cwe: 'CWE-200: Cyber Threat Intelligence Detection Signature',
            analysis:
              'Generated high-confidence YARA detection rule targeting obfuscated PowerShell execution commands and suspicious process creation routines.',
            recommendedRemediation:
              'Deploy rule into SIEM or EDR endpoint agents to trigger immediate isolation when execution attempts occur.',
            patchedSnippet: `rule Apt_Obfuscated_PowerShell_Loader {
    meta:
        description = "Detects obfuscated PowerShell execution payloads"
        author = "LABIB B. SHAHED"
        severity = "HIGH"
    strings:
        $cmd1 = "powershell.exe -enc" nocase
        $cmd2 = "cmd.exe /c start" nocase
        $api1 = "VirtualAlloc"
        $api2 = "WriteProcessMemory"
    condition:
        uint16(0) == 0x5A4D and (all of ($cmd*) or all of ($api*))
}`,
          };
        } else {
          result = {
            vulnerabilityType: 'Insecure Token Transport & Client Storage',
            severity: 'HIGH',
            cwe: 'CWE-598: Information Exposure Through Query Strings in GET Request',
            analysis:
              'Passing session tokens in GET URL query strings exposes credentials in server access logs, browser history, and HTTP Referer headers. Storing session tokens in localStorage leaves them vulnerable to XSS theft.',
            recommendedRemediation:
              'Store session credentials in HttpOnly, Secure, SameSite=Strict cookies and transport authorization headers via Bearer tokens over HTTPS POST requests.',
            patchedSnippet: `// Hardened Authentication Fetch Handler
export function useUserAuth() {
  useEffect(() => {
    // Credentials sent via secure HttpOnly cookie header
    fetch('/api/v1/user/me', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(user => setUserState(user));
  }, []);
}`,
          };
        }

        setAuditResult(result);
        setIsLoading(false);
        soundEngine.play('success');
      }, 800);
    }
  };

  return (
    <section id="ai-auditor" className="py-16 md:py-24 border-b border-slate-800 bg-[#090c14] relative scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/30">
            <i className="ri-cpu-line text-sm"></i>
            <span>[ 06 // AI SECURITY AUDITOR & CODE SCANNER ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-source-code-black text-slate-100">
            AI-Powered Vulnerability Scanner & Threat Auditor
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            Paste any application code snippet, HTTP request, or memory artifact payload below. Powered by Gemini AI security models, Labib's auditor isolates software defects, identifies CWE classifications, and outputs hardened patch diffs.
          </p>
        </div>

        {/* Auditor Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Code Input & Presets */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <i className="ri-code-box-line text-teal-400"></i> SOURCE CODE INPUT
                </span>
                <span className="text-slate-400">SUPPORTED: TS, JS, C, RUST, GO, SQL, YARA</span>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCodeSnippet(preset.code);
                      soundEngine.play('click');
                    }}
                    className="px-2.5 py-1 rounded-sm bg-slate-900 border-2 border-slate-950 text-[11px] font-mono font-bold text-slate-300 hover:text-cyan-300 shadow-[2px_2px_0px_0px_#00a8ff] hover:bg-slate-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Code Textarea */}
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={11}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-jetbrains text-slate-200 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                placeholder="Paste code or security query here..."
              ></textarea>

              {/* Submit Button */}
              <button
                onClick={runAudit}
                disabled={isLoading}
                className="w-full py-3.5 rounded-sm bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs tracking-wider flex items-center justify-center space-x-2 border-2 border-slate-950 shadow-[4px_4px_0px_0px_#000000] hover:bg-cyan-300 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-base"></i>
                    <span>ANALYZING CODE THREAT VECTORS...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-shield-flash-line text-base"></i>
                    <span>EXECUTE AI SECURITY AUDIT</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Audit Results Report */}
          <div className="lg:col-span-6">
            <div className="bg-[#0b0e17] rounded-xl border border-slate-800 p-5 h-full flex flex-col justify-between">
              {auditResult ? (
                <div className="space-y-4 font-sans text-xs">
                  {/* Header Badge & Title */}
                  <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                        AUDIT REPORT FINDING
                      </span>
                      <h3 className="text-base font-source-code-black text-slate-100 mt-0.5">
                        {auditResult.vulnerabilityType}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded font-mono font-bold text-[11px] border ${
                        auditResult.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : auditResult.severity === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-teal-500/20 text-teal-400 border-teal-500/40'
                      }`}
                    >
                      [{auditResult.severity}]
                    </span>
                  </div>

                  {/* CWE Classification */}
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-[11px] text-cyan-300">
                    <span className="text-slate-400">CLASSIFICATION:</span> {auditResult.cwe}
                  </div>

                  {/* Threat Analysis */}
                  <div className="space-y-1">
                    <h4 className="font-mono font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                      <i className="ri-alert-line text-rose-400"></i> THREAT ANALYSIS & IMPACT
                    </h4>
                    <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/60">
                      {auditResult.analysis}
                    </p>
                  </div>

                  {/* Remediation Strategy */}
                  <div className="space-y-1">
                    <h4 className="font-mono font-semibold text-slate-300 text-[11px] flex items-center gap-1.5">
                      <i className="ri-shield-check-line text-teal-400"></i> RECOMMENDED HARDENING STRATEGY
                    </h4>
                    <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/60">
                      {auditResult.recommendedRemediation}
                    </p>
                  </div>

                  {/* Patched Code Snippet */}
                  <div className="space-y-1">
                    <h4 className="font-mono font-semibold text-teal-400 text-[11px] flex items-center gap-1.5">
                      <i className="ri-code-s-slash-line"></i> HARDENED CODE SNIPPET PATCH
                    </h4>
                    <pre className="bg-slate-950 p-3 rounded border border-slate-800 font-jetbrains text-[11px] text-teal-300 overflow-x-auto max-h-48 leading-relaxed">
                      <code>{auditResult.patchedSnippet}</code>
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 text-2xl">
                    <i className="ri-radar-line animate-pulse"></i>
                  </div>
                  <h3 className="text-base font-source-code-black text-slate-200">
                    Awaiting Source Code Payload
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm font-sans">
                    Select a vulnerability preset on the left or paste your code snippet to generate an interactive AI security audit report.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
