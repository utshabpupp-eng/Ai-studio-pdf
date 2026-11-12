import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { analyzeLegalHeadersWithGemini } from './src/services/geminiHeaderService';

function serverApiPlugin(): Plugin {
  return {
    name: 'server-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // 1. Gemini Legal Header Analyzer Endpoint
        if (req.url && req.url.startsWith('/api/gemini/analyze-headers')) {
          if (req.method === 'POST') {
            let bodyStr = '';
            req.on('data', chunk => { bodyStr += chunk; });
            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const analysis = await analyzeLegalHeadersWithGemini(
                  body.pdfPath || '',
                  body.pageNumber ? parseInt(body.pageNumber, 10) : undefined,
                  body.snippetText || ''
                );
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                return res.end(JSON.stringify(analysis));
              } catch (e: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ success: false, error: e.message }));
              }
            });
            return;
          }
          if (req.method === 'OPTIONS') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.statusCode = 204;
            return res.end();
          }
        }

        // 2. PDF Streaming Proxy Endpoint
        if (!req.url || !req.url.startsWith('/api/pdf-proxy')) {
          return next();
        }
        try {
          const parsed = new URL(req.url, 'http://localhost:3000');
          const pdfPath = parsed.searchParams.get('path');
          if (!pdfPath) {
            res.statusCode = 400;
            return res.end('Missing PDF path parameter');
          }

          // Candidate local locations:
          const candidates = [
            path.resolve('/app/applet/public', pdfPath),
            path.resolve('/app/applet/public/pdfs', pdfPath.replace(/^pdfs\//, '')),
            path.resolve('/tmp/repos/repo2', pdfPath),
          ];

          for (const localFile of candidates) {
            if (fs.existsSync(localFile) && fs.statSync(localFile).isFile()) {
              const fileBuffer = fs.readFileSync(localFile);
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', 'inline');
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Cache-Control', 'public, max-age=86400');
              return res.end(fileBuffer);
            }
          }

          // Fallback: Stream directly from GitHub repository
          const rawUrl = `https://raw.githubusercontent.com/barshapbp2026/any-pdf-/main/${encodeURIComponent(pdfPath)}`;
          const response = await fetch(rawUrl);
          if (!response.ok) {
            res.statusCode = response.status;
            return res.end('PDF not found on GitHub repository');
          }

          const arrayBuffer = await response.arrayBuffer();
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          return res.end(Buffer.from(arrayBuffer));
        } catch (err: any) {
          res.statusCode = 500;
          return res.end(err.message || 'Internal error streaming PDF');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
