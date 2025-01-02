import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import NotFound from '@/views/NotFound.vue'
import Admin from '@/views/admin/index.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/Register.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/views/admin/dashboard/index.vue')
      },
      {
        path: 'products',
        name: 'product-list',
        component: () => import('@/views/admin/products/list.vue')
      },
      {
        path: 'products/category',
        name: 'product-category',
        component: () => import('@/views/admin/products/category.vue')
      },
      {
        path: 'products/add',
        name: 'product-add',
        component: () => import('@/views/admin/products/add.vue')
      },
      {
        path: 'orders',
        name: 'order-list',
        component: () => import('@/views/admin/orders/list.vue')
      },
      {
        path: 'orders/stats',
        name: 'order-stats',
        component: () => import('@/views/admin/orders/stats.vue')
      },
      {
        path: 'users',
        name: 'user-list',
        component: () => import('@/views/admin/users/list.vue')
      },
      {
        path: 'users/roles',
        name: 'user-roles',
        component: () => import('@/views/admin/users/roles.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/admin/settings/index.vue')
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: () => import('@/views/admin/profile/index.vue')
      }
    ],
    beforeEnter: (to, from, next) => {
      const isAdmin = localStorage.getItem('isAdmin') === 'true'
      if (isAdmin) {
        next()
      } else {
        next('/login')
      }
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { 
      requiresAuth: true  // 需要登录才能访问
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 