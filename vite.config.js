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
        server.middlewares.use('/api/save-content', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405
            res.end('Method Not Allowed')
            return
          }
          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', () => {
            try {
              const data = JSON.stringify(JSON.parse(body), null, 2)
              const dir = resolve(__dirname, 'public', 'data')
              if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
              writeFileSync(resolve(dir, 'content.json'), data, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, path: resolve(dir, 'content.json') }))
            } catch (e) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: e.message }))
            }
          })
        })
      },
    },
  ],
  base: '/portfolio/',
})
