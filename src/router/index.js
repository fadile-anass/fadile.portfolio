import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Fadile Anass - Full-Stack Developer & Business-Oriented Engineer',
        description: 'Portfolio of Fadile Anass, a full-stack developer building scalable web applications, dashboards, and business systems.'
      }
    },
    {
      path: '/project/:slug',
      name: 'project-detail',
      component: () => import('../views/ProjectDetailView.vue'),
      meta: {
        title: 'Project Case Study - Fadile Anass',
        description: 'Explore a selected full-stack, dashboard, or business web application project by Fadile Anass.'
      }
    },
    {
      path: '/blog',
      name: 'blog-list',
      component: () => import('../views/BlogListView.vue'),
      meta: {
        title: 'Blog - Fadile Anass',
        description: 'Articles by Fadile Anass about web development, business systems, AI, product thinking, and software engineering.'
      }
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/BlogDetailView.vue'),
      meta: {
        title: 'Article - Fadile Anass Blog',
        description: 'Read practical notes from Fadile Anass on web development, business, AI, and product strategy.'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
    // Admin Routes
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/AdminLoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
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
  const title = to.meta.title || 'Fadile Anass - Full-Stack Developer'
  const description = to.meta.description || 'Full-stack developer building scalable web applications and business systems.'
  const canonical = `${window.location.origin}${to.path}`

  document.title = title
  updateMeta('description', description)
  updateMeta('og:title', title, 'property')
  updateMeta('og:description', description, 'property')
  updateMeta('og:url', canonical, 'property')
  updateMeta('twitter:title', title)
  updateMeta('twitter:description', description)
  updateCanonical(canonical)
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
