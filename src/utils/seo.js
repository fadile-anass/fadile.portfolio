export const PRIMARY_DOMAIN = 'https://www.fadile.site'
export const OG_DEFAULT_IMAGE = `${PRIMARY_DOMAIN}/images/og-default.jpg`

export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 155

export function truncate(str, max) {
  if (!str || typeof str !== 'string') return ''
  const clean = str.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

export function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${PRIMARY_DOMAIN}${path}`
}

export function updateMetaTags({
  title,
  description,
  image,
  url,
  // Aliases used by detail views (kept for compatibility)
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonical,
  twitterCard
}) {
  const finalTitle = title || ogTitle
  if (finalTitle) {
    const t = truncate(finalTitle, TITLE_MAX)
    document.title = t
    updateMeta('og:title', t, 'property')
    updateMeta('twitter:title', t)
  }
  const finalDescription = description || ogDescription
  if (finalDescription) {
    const d = truncate(finalDescription, DESCRIPTION_MAX)
    updateMeta('description', d)
    updateMeta('og:description', d, 'property')
    updateMeta('twitter:description', d)
  }
  const finalImage = image || ogImage
  if (finalImage) {
    const fullImageUrl = toAbsoluteUrl(finalImage)
    updateMeta('og:image', fullImageUrl, 'property')
    updateMeta('twitter:image', fullImageUrl)
  }
  const finalUrl = canonical || ogUrl || url
  if (finalUrl) {
    const fullUrl = toAbsoluteUrl(finalUrl)
    updateMeta('og:url', fullUrl, 'property')
    updateCanonical(fullUrl)
  }
  updateMeta('twitter:card', twitterCard || 'summary_large_image')
}

function updateMeta(name, content, attr = 'name') {
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function updateCanonical(href) {
  let tag = document.head.querySelector('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

export function injectJsonLd(id, schemaObject) {
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(schemaObject)
}

export function removeJsonLd(id) {
  const script = document.getElementById(id)
  if (script) {
    script.remove()
  }
}
