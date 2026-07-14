export function updateMetaTags({ title, description, image, url }) {
  if (title) {
    document.title = title
    updateMeta('og:title', title, 'property')
    updateMeta('twitter:title', title)
  }
  if (description) {
    updateMeta('description', description)
    updateMeta('og:description', description, 'property')
    updateMeta('twitter:description', description)
  }
  if (image) {
    const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`
    updateMeta('og:image', fullImageUrl, 'property')
    updateMeta('twitter:image', fullImageUrl)
  }
  if (url) {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    updateMeta('og:url', fullUrl, 'property')
    updateCanonical(fullUrl)
  }
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
