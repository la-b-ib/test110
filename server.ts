import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for AI vulnerability code audit
app.post('/api/security-audit', async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Code snippet parameter required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const prompt = `You are Labib B. Shahed, a Principal OffSec Architect and DFIR Specialist.
Analyze the following source code snippet for security vulnerabilities, software defects, memory corruption, or bad auth practices:

\`\`\`
${code}
\`\`\`

Return a JSON object with the following exact keys:
- "vulnerabilityType": string (short title of vulnerability e.g. SQL Injection, Buffer Overflow)
- "severity": string ("CRITICAL", "HIGH", "MEDIUM", "LOW", or "INFORMATIONAL")
- "cwe": string (CWE classification e.g. CWE-89)
- "analysis": string (detailed technical explanation of threat vector & exploit risk)
- "recommendedRemediation": string (actionable architectural fix)
- "patchedSnippet": string (hardened code snippet fix)

Return ONLY raw JSON, no markdown backticks outside the JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    const cleanJsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(cleanJsonText);
    return res.json(parsedData);
  } catch (err: unknown) {
    console.error('Gemini Audit API Error:', err);
    return res.status(500).json({ error: 'Failed to process AI security audit' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SecOps Server running on http://localhost:${PORT}`);
  });
}

startServer();
