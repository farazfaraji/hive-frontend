import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/components/auth/LoginForm.vue'
import DashboardView from '@/views/DashboardView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginForm,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        component: DashboardView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (to.path === '/' && token) {
    next('/dashboard')
    return
  }

  // If route requires auth and no token, redirect to login
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next('/')
  } else {
    next()
  }
})

export default router
