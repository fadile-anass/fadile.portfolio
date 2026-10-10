/**
 * prerender.js — build-time prerendering for the Vue SPA.
 *
 * Why this approach: the site is a client-side-rendered Vue 3 + Vite SPA
 * deployed to Vercel as static files. A full migration to Nuxt/SSR would be
 * a rewrite; instead, after `vite build` this script clones dist/index.html
 * per public route (/, /blog, /blog/:slug, /projects/:slug) with:
 *   - route-specific <title>, meta description, canonical, og:* / twitter:*
 *     (all within length limits, all on PRIMARY_DOMAIN)
 *   - route-specific JSON-LD
 *   - a static HTML snapshot (h1 + real content) inside #app so crawlers
 *     and no-JS clients see content WITHOUT running JavaScript.
 * Vue replaces #app content on mount, so interactive users are unaffected.
 * Vercel serves these static files directly (filesystem wins over rewrites).
 *
 * Run:  node scripts/prerender.js   (auto via the "postbuild" npm hook)
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'
import { BLOG_SLUGS, DUPLICATE_PROJECT_SLUGS, PRIMARY_DOMAIN } from '../src/utils/seoSlugs.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const BLOGS_DIR = join(ROOT, 'public', 'blogs')
const OG_DEFAULT = `${PRIMARY_DOMAIN}/images/og-default.jpg`

const TITLE_MAX = 60
const DESCRIPTION_MAX = 155

const truncate = (str, max) => {
  const clean = String(str || '').replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

const esc = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const stripHtml = (html) =>
  String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/<\//g, '<\\/')}</script>`

// ── Load blog posts ──────────────────────────────────────────────────────────
function loadBlogs() {
  const posts = []
  for (const slug of BLOG_SLUGS) {
    const file = join(BLOGS_DIR, slug, 'post.json')
    if (!existsSync(file)) {
      console.warn(`⚠️  prerender: missing ${file}`)
      continue
    }
    try {
      const post = JSON.parse(readFileSync(file, 'utf-8'))
      if (Number(post.published ?? 1) !== 1) continue
      posts.push({ ...post, slug: post.slug || slug })
    } catch (e) {
      console.warn(`⚠️  prerender: invalid ${file}: ${e.message}`)
    }
  }
  return posts
}

// ── Load projects (comment-stripped, duplicates excluded) ────────────────────
function loadProjects() {
  const dbRaw = readFileSync(join(ROOT, 'backend', 'src', 'config', 'db.js'), 'utf-8')
  const uncommented = dbRaw
    .split('\n')
    .filter((line) => !line.trim().startsWith('//'))
    .join('\n')
  const section = uncommented.split('blog_posts:')[0]
  const blocks = [...section.matchAll(/\{[^{}]*slug:\s*'([^']+)'[^{}]*\}/g)]
  const get = (block, key) => {
    const m = block.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 's'))
    return m ? m[1].replace(/\\'/g, "'") : ''
  }
  return blocks
    .map((b) => ({
      slug: b[1],
      title: get(b[0], 'title'),
      description: get(b[0], 'description'),
      image_url: get(b[0], 'image_url'),
      tech_stack: get(b[0], 'tech_stack')
    }))
    .filter((p) => p.slug && !DUPLICATE_PROJECT_SLUGS.includes(p.slug))
}

// ── Head rewriting ───────────────────────────────────────────────────────────
function withHead(html, { title, description, canonical, ogImage, schemas = [] }) {
  let out = html
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  out = out.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(description)}">`
  )
  out = out.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${esc(canonical)}" />`
  )
  const og = [
    ['og:url', canonical],
    ['og:title', title],
    ['og:description', description],
    ['og:image', ogImage]
  ]
  for (const [prop, value] of og) {
    const re = new RegExp(`<meta property="${prop}" content="[^"]*">`)
    if (re.test(out)) out = out.replace(re, `<meta property="${prop}" content="${esc(value)}">`)
  }
  const tw = [
    ['twitter:title', title],
    ['twitter:description', description],
    ['twitter:image', ogImage]
  ]
  for (const [name, value] of tw) {
    const re = new RegExp(`<meta name="${name}" content="[^"]*">`)
    if (re.test(out)) out = out.replace(re, `<meta name="${name}" content="${esc(value)}">`)
  }
  if (schemas.length) out = out.replace('</head>', `${schemas.map(jsonLd).join('\n')}\n</head>`)
  return out
}

const snapshotStyle =
  'background:#0F0F1A;color:#EAEAEA;font-family:system-ui,sans-serif;padding:48px 24px;max-width:820px;margin:0 auto;line-height:1.7;'

function withSnapshot(html, innerHtml) {
  return html.replace(
    '<div id="app"></div>',
    `<div id="app"><div id="seo-snapshot" style="${snapshotStyle}">${innerHtml}</div></div>`
  )
}

function writeRoute(routePath, html) {
  const clean = routePath === '/' ? '' : routePath.replace(/^\//, '')
  const dir = join(DIST, clean)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html, 'utf-8')
  console.log(`   • ${routePath} → dist/${clean ? `${clean}/` : ''}index.html`)
}

// ── Main ─────────────────────────────────────────────────────────────────────
const template = readFileSync(join(DIST, 'index.html'), 'utf-8')
if (!template.includes('<div id="app"></div>')) {
  console.error('❌ prerender: dist/index.html has no <div id="app"></div> placeholder — aborting')
  process.exit(1)
}

const blogs = loadBlogs()
const projects = loadProjects()
console.log(`⚙️  Prerendering ${2 + blogs.length + projects.length} routes…`)

const HOME_TITLE = 'Fadile Anass – Full-Stack Developer (Laravel, Vue, Node.js)'
const HOME_DESC =
  'Full-stack developer building scalable web apps, dashboards & business systems with Laravel, Vue.js and Node.js. Morocco-based, working worldwide.'

// / (homepage: Person + WebSite schemas already ship in the template)
writeRoute(
  '/',
  withSnapshot(
    withHead(template, {
      title: HOME_TITLE,
      description: HOME_DESC,
      canonical: `${PRIMARY_DOMAIN}/`,
      ogImage: OG_DEFAULT
    }),
    `<h1>Fadile Anass — Full-Stack Developer</h1>` +
      `<p>${esc(HOME_DESC)}</p>` +
      `<p>Specialising in Laravel, Vue.js, Node.js, SaaS and dashboard systems.</p>` +
      `<p><a href="${PRIMARY_DOMAIN}/blog">Read the blog</a></p>`
  )
)

// /blog
const blogListItems = blogs
  .map((p) => `<li><a href="${PRIMARY_DOMAIN}/blog/${esc(p.slug)}">${esc(p.title)}</a> — ${esc(p.excerpt || '')}</li>`)
  .join('')
writeRoute(
  '/blog',
  withSnapshot(
    withHead(template, {
      title: 'Blog – Fadile Anass | Web Dev, AI & Business',
      description:
        'Articles by Fadile Anass on web development, business systems, AI, product thinking and software engineering.',
      canonical: `${PRIMARY_DOMAIN}/blog`,
      ogImage: OG_DEFAULT,
      schemas: [
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Fadile Anass Blog',
          url: `${PRIMARY_DOMAIN}/blog`,
          author: { '@type': 'Person', name: 'Fadile Anass', url: `${PRIMARY_DOMAIN}/` },
          blogPost: blogs.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${PRIMARY_DOMAIN}/blog/${p.slug}`
          }))
        }
      ]
    }),
    `<h1>The Blog</h1><p>Thoughts, learnings, and experiences in web development.</p><ul>${blogListItems}</ul>`
  )
)

// /blog/:slug
for (const p of blogs) {
  const canonical = `${PRIMARY_DOMAIN}/blog/${p.slug}`
  const title = truncate(`${p.title} | Anass Fadile Blog`, TITLE_MAX)
  const description = truncate(p.excerpt || p.title, DESCRIPTION_MAX)
  const image = p.cover_image
    ? p.cover_image.startsWith('http')
      ? p.cover_image
      : `${PRIMARY_DOMAIN}${p.cover_image}`
    : OG_DEFAULT
  writeRoute(
    `/blog/${p.slug}`,
    withSnapshot(
      withHead(template, {
        title,
        description,
        canonical,
        ogImage: image,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.excerpt || p.title,
            image: [image],
            datePublished: p.created_at,
            dateModified: p.updated_at || p.created_at,
            author: {
              '@type': 'Person',
              name: 'Anass Fadile',
              url: `${PRIMARY_DOMAIN}/`,
              jobTitle: 'Full Stack Developer'
            },
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonical }
          }
        ]
      }),
      `<nav><a href="${PRIMARY_DOMAIN}/">Home</a> / <a href="${PRIMARY_DOMAIN}/blog">Blog</a></nav>` +
        `<h1>${esc(p.title)}</h1>` +
        (p.created_at ? `<p><time datetime="${esc(p.created_at)}">${esc(p.created_at.slice(0, 10))}</time></p>` : '') +
        (p.excerpt ? `<p>${esc(p.excerpt)}</p>` : '') +
        (p.content ? p.content.slice(0, 6000) : `<p>${esc(stripHtml(p.content).slice(0, 2000))}</p>`)
    )
  )
}

// /projects/:slug (real case studies only)
for (const p of projects) {
  const canonical = `${PRIMARY_DOMAIN}/projects/${p.slug}`
  const title = truncate(`${p.title} | Anass Fadile Portfolio`, TITLE_MAX)
  const description = truncate(p.description || p.title, DESCRIPTION_MAX)
  const image = p.image_url
    ? p.image_url.startsWith('http')
      ? p.image_url
      : `${PRIMARY_DOMAIN}${p.image_url}`
    : OG_DEFAULT
  let tech = []
  try {
    tech = JSON.parse(p.tech_stack || '[]')
  } catch { /* ignore */ }
  writeRoute(
    `/projects/${p.slug}`,
    withSnapshot(
      withHead(template, {
        title,
        description,
        canonical,
        ogImage: image,
        schemas: [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: p.title,
            description: p.description || p.title,
            image: [image],
            url: canonical,
            author: {
              '@type': 'Person',
              name: 'Anass Fadile',
              url: `${PRIMARY_DOMAIN}/`,
              jobTitle: 'Full Stack Developer'
            },
            programmingLanguage: tech
          }
        ]
      }),
      `<nav><a href="${PRIMARY_DOMAIN}/">Home</a> / Projects</nav>` +
        `<h1>${esc(p.title)}</h1>` +
        (tech.length ? `<p>${esc(tech.join(', '))}</p>` : '') +
        `<p>${esc(p.description || '')}</p>`
    )
  )
}

console.log('✅  Prerender complete.')
