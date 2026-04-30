export function optimizedImageUrl(src) {
  if (!src || typeof src !== 'string') return src

  const isLocalGeneratedImage = src.startsWith('/images/blog/') || src.startsWith('/images/projects/')
  if (!isLocalGeneratedImage) return src

  return src.replace(/\.png($|\?)/, '.jpg$1')
}
