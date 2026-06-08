import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-content',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || '';
          if (url.includes('api/save-content') && req.method === 'POST') {
            console.log(`[save-content] Incoming request: ${url}`);
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body);
                const data = JSON.stringify(parsed, null, 2);
                const dir = resolve(__dirname, 'public', 'data');
                if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
                writeFileSync(resolve(dir, 'content.json'), data, 'utf-8');
                console.log(`[save-content] Successfully saved to ${resolve(dir, 'content.json')}`);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
              } catch (e) {
                console.error(`[save-content] Error: ${e.message}`);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
  base: '/portfolio/',
})
