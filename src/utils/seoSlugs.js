// Slugs that exist as blog articles AND (previously) as /projects/ pages.
// The /blog/ URL is canonical; /projects/<slug> 301-redirects to /blog/<slug>.
// This file is dependency-free on purpose: it is imported by the Vue router
// AND by the Node build scripts (sitemap, prerender, vercel redirects).
export const BLOG_SLUGS = [
  'automation-before-ai-workflows',
  'business-side-of-dev',
  'claude-agent-sdk-build-ai-systems',
  'developer-to-problem-solver',
  'idea-to-mvp-with-ai',
  'idea-to-product',
  'market-research-validate-before-building',
  'own-your-ai-reduce-costs-local-vps',
  'rag-vs-prompt-vs-function-vs-finetuning',
  'scalable-dashboards-vue-laravel',
  'tracking-systems-business',
  'user-centric-thinking',
  'why-web-apps-fail',
  'why-websites-dont-bring-clients'
]

// Subset of BLOG_SLUGS that historically also lived under /projects/ and may
// still be indexed there. These get 301 redirects to /blog/<slug>.
export const DUPLICATE_PROJECT_SLUGS = [
  'business-side-of-dev',
  'developer-to-problem-solver',
  'idea-to-mvp-with-ai',
  'idea-to-product',
  'market-research-validate-before-building',
  'rag-vs-prompt-vs-function-vs-finetuning',
  'scalable-dashboards-vue-laravel',
  'tracking-systems-business',
  'user-centric-thinking',
  'why-web-apps-fail',
  'why-websites-dont-bring-clients'
]

export const PRIMARY_DOMAIN = 'https://www.fadile.site'
