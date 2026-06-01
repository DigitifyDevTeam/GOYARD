import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distDir = path.resolve(__dirname, '..', 'dist')

const blogSlugs = [
  'guide-complet-demenagement-reussi',
  'comment-emballer-objets-fragiles',
  'demenagement-ecologique-solutions-durables',
  'checklist-ultime-demenagement',
  'demenager-avec-enfants-guide-pratique',
  'erreurs-eviter-demenagement',
  'budget-demenagement-economies',
  'demenagement-longue-distance',
  'assurance-demenagement-guide-complet',
]

// /lp/* excluded: paid landing + campaign pages are noindex (see robots.txt)
const routes = [
  '/',
  '/ile-de-france',
  '/demenagement-national',
  '/international',
  '/contact',
  '/solution',
  '/en-construction',
  '/demenagement-entreprise',
  '/demenagement-particulier',
  '/blog',
  ...blogSlugs.map(s => `/blog/${s}`),
  '/faq',
  '/tarif',
  '/formules-demenagement',
  '/mentions-legales',
  '/rgpd',
]

function getMime(ext) {
  const map = {
    '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript',
    '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.woff2': 'font/woff2',
    '.woff': 'font/woff', '.mp4': 'video/mp4', '.xml': 'application/xml',
    '.txt': 'text/plain', '.ico': 'image/x-icon',
  }
  return map[ext] || 'application/octet-stream'
}

function startStaticServer(dir, port) {
  const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf-8')
  const server = createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`)
    let filePath = path.join(dir, url.pathname)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': getMime(path.extname(filePath)) })
      fs.createReadStream(filePath).pipe(res)
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(indexHtml)
    }
  })
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, () => {
      const address = server.address()
      const boundPort = typeof address === 'object' && address ? address.port : port
      resolve({ server, port: boundPort })
    })
  })
}

const ORIGIN = 'http://localhost'

async function prerender() {
  const { server, port } = await startStaticServer(distDir, 0)
  const PORT = port
  console.log(`[prerender] Static server on ${ORIGIN}:${PORT}`)

  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  let ok = 0
  let fail = 0

  for (const route of routes) {
    const url = `${ORIGIN}:${PORT}${route}`
    let page
    try {
      page = await browser.newPage()

      await page.setRequestInterception(true)
      page.on('request', req => {
        const reqUrl = req.url()
        if (reqUrl.startsWith(`${ORIGIN}:${PORT}`) || reqUrl.startsWith('data:')) {
          req.continue()
        } else {
          req.abort()
        }
      })

      page.on('pageerror', () => {})

      await page.goto(url, { waitUntil: 'load', timeout: 30000 })

      try {
        await page.waitForFunction(
          () => {
            const root = document.getElementById('root')
            return root && root.innerHTML.trim().length > 0
          },
          { timeout: 15000 }
        )
      } catch {
        console.warn(`  ⚠ ${route} — React did not render in time, saving page as-is`)
      }

      await new Promise(r => setTimeout(r, 2000))

      const html = await page.content()

      const outDir = route === '/'
        ? distDir
        : path.join(distDir, ...route.split('/').filter(Boolean))
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8')
      ok++
      console.log(`  ✓ ${route}`)
    } catch (err) {
      fail++
      console.error(`  ✗ ${route} — ${err.message}`)
    } finally {
      if (page) await page.close().catch(() => {})
    }
  }

  await browser.close()
  server.close()
  console.log(`[prerender] Done: ${ok} ok, ${fail} failed out of ${routes.length} routes`)
}

prerender()
