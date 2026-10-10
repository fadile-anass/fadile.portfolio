/**
 * generate-sitemap.js
 * Generates public/sitemap.xml from the REAL route data:
 *   - static pages (/, /blog)
 *   - projects parsed from backend/src/config/db.js (comments stripped,
 *     blog-duplicate slugs excluded)
 *   - blog posts scanned from public/blogs/<slug>/post.json
 *
 * Rules:
 *   - All URLs use PRIMARY_DOMAIN (https://www.fadile.site)
 *   - <lastmod> is the real content date (post updated_at/created_at, or the
 *     git last-modified date of db.js for projects) — NEVER the build date
 *   - No <changefreq> / <priority> (Google ignores them)
 *   - Redirected (/project/*, /projects/<blog-slug>) and duplicate URLs are excluded
 *
 * Run:  node scripts/generate-sitemap.js
 * Auto: hooked into "npm run build" via the "prebuild" npm hook.
 */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { DUPLICATE_PROJECT_SLUGS, PRIMARY_DOMAIN } from '../src/utils/seoSlugs.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const PUBLIC_DIR = join(ROOT, 'public')
const BLOGS_DIR = join(PUBLIC_DIR, 'blogs')
const SITEMAP_PATH = join(PUBLIC_DIR, 'sitemap.xml')

const isoDate = (value) => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
}

const gitLastModified = (relativePath, fallback) => {
  try {
    const out = execSync(`git log -1 --format=%cs -- "${relativePath}"`, { cwd: ROOT, encoding: 'utf-8' }).trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out
  } catch { /* not a git repo or file untracked */ }
  return fallback
}

// ── Blog posts (source of truth: public/blogs/<slug>/post.json) ─────────────
const blogEntries = []
try {
  const slugDirs = readdirSync(BLOGS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const slug of slugDirs) {
    const postFile = join(BLOGS_DIR, slug, 'post.json')
    let lastmod = null
    try {
      const post = JSON.parse(readFileSync(postFile, 'utf-8'))
      if (Number(post.published ?? 1) !== 1) continue // skip drafts
      lastmod = isoDate(post.updated_at || post.created_at)
    } catch { /* handled below */ }
    if (!lastmod) {
      try {
        lastmod = statSync(postFile).mtime.toISOString().slice(0, 10)
      } catch { /* ignore */ }
    }
    blogEntries.push({ loc: `/blog/${postSlug(slug)}`, lastmod })
  }
} catch (e) {
  console.warn('⚠️  Could not read blog directories:', e.message)
}

function postSlug(dir) {
  // Prefer the slug declared inside post.json, fall back to the folder name
  try {
    const post = JSON.parse(readFileSync(join(BLOGS_DIR, dir, 'post.json'), 'utf-8'))
    if (post.slug) return post.slug
  } catch { /* ignore */ }
  return dir
}

// ── Projects (source of truth: backend/src/config/db.js) ────────────────────
let projectEntries = []
try {
  const dbPath = join(ROOT, 'backend', 'src', 'config', 'db.js')
  const dbRaw = readFileSync(dbPath, 'utf-8')
  // Strip full-line comments so commented-out projects (e.g. spinner-wheel-app)
  // are NOT picked up, then only read the `projects: [...]` array section.
  const uncommented = dbRaw
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
  const projectsSection = uncommented.split('blog_posts:')[0]
  const slugMatches = [...projectsSection.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  const uniqueSlugs = [...new Set(slugMatches)].filter(
    (slug) => !DUPLICATE_PROJECT_SLUGS.includes(slug)
  )
  const projectsLastmod =
    gitLastModified('backend/src/config/db.js', latestBlogDate()) || latestBlogDate()
  projectEntries = uniqueSlugs.map((slug) => ({ loc: `/projects/${slug}`, lastmod: projectsLastmod }))
} catch (e) {
  console.warn('⚠️  Could not read project slugs from db.js:', e.message)
}

function latestBlogDate() {
  const dates = blogEntries.map((e) => e.lastmod).filter(Boolean).sort()
  return dates.length ? dates[dates.length - 1] : null
}

// ── Static pages use the freshest content date, never the build date ─────────
const staticLastmod = latestBlogDate()
const staticPages = [
  { loc: '/', lastmod: staticLastmod },
  { loc: '/blog', lastmod: staticLastmod }
]

// ── Build XML (no changefreq / priority — Google ignores them) ───────────────
const urlToXml = ({ loc, lastmod }) => {
  const lines = ['  <url>', `    <loc>${PRIMARY_DOMAIN}${loc}</loc>`]
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`)
  lines.push('  </url>')
  return lines.join('\n')
}

const allUrls = [...staticPages, ...projectEntries, ...blogEntries]

// Safety net: no duplicates, no redirected/duplicate project URLs
const seen = new Set()
const deduped = allUrls.filter(({ loc }) => {
  if (seen.has(loc)) return false
  seen.add(loc)
  if (loc.startsWith('/project/')) return false
  const m = loc.match(/^\/projects\/(.+)$/)
  if (m && DUPLICATE_PROJECT_SLUGS.includes(m[1])) return false
  return true
})

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${deduped.map(urlToXml).join('\n')}
</urlset>`

writeFileSync(SITEMAP_PATH, `${xml}\n`, 'utf-8')

console.log(`✅  Sitemap generated: ${SITEMAP_PATH}`)
console.log(`   • ${staticPages.length} static pages`)
console.log(`   • ${projectEntries.length} project pages`)
console.log(`   • ${blogEntries.length} blog posts`)
console.log(`   • ${deduped.length} URLs total (base: ${PRIMARY_DOMAIN})`)
