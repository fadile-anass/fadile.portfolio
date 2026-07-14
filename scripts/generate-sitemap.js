/**
 * generate-sitemap.js
 * Dynamically generates public/sitemap.xml by reading the in-memory db.js
 * and scanning public/blogs/<slug>/post.json files.
 *
 * Run:  node scripts/generate-sitemap.js
 * Auto: hooked into "npm run build" via package.json prebuilt script.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLIC_DIR = join(ROOT, 'public')
const BLOGS_DIR = join(PUBLIC_DIR, 'blogs')
const SITEMAP_PATH = join(PUBLIC_DIR, 'sitemap.xml')

const BASE_URL = 'https://anassfadile.com'

// ── Static pages ──────────────────────────────────────────────────────────────
const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' }
]

// ── Read projects from backend db config ──────────────────────────────────────
let projectEntries = []
try {
  // Import inline to avoid ESM issues with the backend module
  const dbPath = join(ROOT, 'backend', 'src', 'config', 'db.js')
  const dbRaw = readFileSync(dbPath, 'utf-8')
  // Extract slugs via simple regex — avoids running the module with libsql deps
  const slugMatches = [...dbRaw.matchAll(/slug:\s*'([^']+)'/g)]
  projectEntries = slugMatches.map(([, slug]) => ({
    loc: `/projects/${slug}`,
    priority: '0.7',
    changefreq: 'monthly'
  }))
} catch (e) {
  console.warn('⚠️  Could not read project slugs from db.js:', e.message)
}

// ── Scan blog post directories ─────────────────────────────────────────────────
let blogEntries = []
try {
  const slugDirs = readdirSync(BLOGS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const slug of slugDirs) {
    const postFile = join(BLOGS_DIR, slug, 'post.json')
    let lastmod = null
    try {
      const post = JSON.parse(readFileSync(postFile, 'utf-8'))
      lastmod = (post.updated_at || post.created_at || '').slice(0, 10)
    } catch {
      // fallback to file mtime
      try {
        lastmod = statSync(postFile).mtime.toISOString().slice(0, 10)
      } catch { /* ignore */ }
    }
    blogEntries.push({
      loc: `/blog/${slug}`,
      priority: '0.6',
      changefreq: 'monthly',
      lastmod
    })
  }
} catch (e) {
  console.warn('⚠️  Could not read blog directories:', e.message)
}

// ── Build XML ──────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10)

const urlToXml = ({ loc, priority, changefreq, lastmod }) => {
  const lines = [`  <url>`, `    <loc>${BASE_URL}${loc}</loc>`]
  if (lastmod || today) lines.push(`    <lastmod>${lastmod || today}</lastmod>`)
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`)
  if (priority) lines.push(`    <priority>${priority}</priority>`)
  lines.push(`  </url>`)
  return lines.join('\n')
}

const allUrls = [
  ...staticPages,
  ...projectEntries,
  ...blogEntries
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls.map(urlToXml).join('\n')}
</urlset>`

writeFileSync(SITEMAP_PATH, xml, 'utf-8')

const count = allUrls.length
console.log(`✅  Sitemap generated: ${SITEMAP_PATH}`)
console.log(`   • ${staticPages.length} static pages`)
console.log(`   • ${projectEntries.length} project pages`)
console.log(`   • ${blogEntries.length} blog posts`)
console.log(`   • ${count} URLs total`)
