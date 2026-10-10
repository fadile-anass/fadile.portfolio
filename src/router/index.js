import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'
import { PRIMARY_DOMAIN, DUPLICATE_PROJECT_SLUGS } from '../utils/seoSlugs'

const HOME_TITLE = 'Fadile Anass – Full-Stack Developer (Laravel, Vue, Node.js)'
const HOME_DESCRIPTION = 'Full-stack developer building scalable web apps, dashboards & business systems with Laravel, Vue.js and Node.js. Morocco-based, working worldwide.'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: HOME_TITLE,
        description: HOME_DESCRIPTION
      }
    },
    {
      // Canonical project URL (plural). The old singular path redirects below.
      path: '/projects/:slug',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
      meta: {
        title: 'Project – Fadile Anass Portfolio',
        description: 'Case study of a full-stack, dashboard or business web application built by Fadile Anass with Vue.js, Laravel or Node.js.'
      }
    },
    {
      // Legacy singular URL → 301-style redirect to the canonical plural URL.
      path: '/project/:slug',
      redirect: (to) => ({ path: `/projects/${to.params.slug}`, query: to.query, hash: to.hash })
    },
    {
      path: '/blog',
      name: 'blog-list',
      component: () => import('../views/BlogListView.vue'),
      meta: {
        title: 'Blog – Fadile Anass | Web Dev, AI & Business',
        description: 'Articles by Fadile Anass on web development, business systems, AI, product thinking and software engineering.'
      }
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
      meta: {
        title: 'Article – Fadile Anass Blog',
        description: 'Practical notes from Fadile Anass on web development, business, AI and product strategy.'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: { robots: 'noindex, follow' }
    },
    // Admin Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
      meta: { requiresGuest: true, robots: 'noindex, nofollow' }
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, robots: 'noindex, nofollow' },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/DashboardHomeView.vue')
        },
        {
          path: 'comments',
          name: 'admin-comments',
          component: () => import('../views/admin/ManageCommentsView.vue')
        },
        {
          path: 'contacts',
          name: 'admin-contacts',
          component: () => import('../views/admin/ManageContactsView.vue')
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  // Clear any dynamic JSON-LD tags from the previous page
  const dynamicSchemas = document.querySelectorAll('script[id^="jsonld-"]')
  dynamicSchemas.forEach(el => el.remove())

  // Duplicate cleanup: /projects/<blog-slug> is canonical under /blog/<slug>
  if (to.name === 'project-detail' && DUPLICATE_PROJECT_SLUGS.includes(to.params.slug)) {
    return next({ name: 'blog-detail', params: { slug: to.params.slug }, query: to.query, hash: to.hash })
  }

  const auth = useAuthStore()
  const isAuth = auth.isAuthenticated()

  if (to.meta.requiresAuth && !isAuth) {
    next('/admin/login')
  } else if (to.meta.requiresGuest && isAuth) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

router.afterEach((to) => {
  const title = to.meta.title || HOME_TITLE
  const description = to.meta.description || HOME_DESCRIPTION
  // Always canonicalise to the primary domain (never the mirror/secondary host)
  const canonical = `${PRIMARY_DOMAIN}${to.path === '/' ? '/' : to.path}`

  document.title = title
  updateMeta('description', description)
  updateMeta('og:title', title, 'property')
  updateMeta('og:description', description, 'property')
  updateMeta('og:url', canonical, 'property')
  updateMeta('twitter:title', title)
  updateMeta('twitter:description', description)
  updateCanonical(canonical)
  updateMeta('robots', to.meta.robots || 'index, follow')
})

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

export default router
