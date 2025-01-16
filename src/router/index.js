import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Home from '@/views/home/index.vue'
import NotFound from '@/views/NotFound.vue'
import Admin from '@/views/admin/index.vue'
import { getCookie, removeCookie } from '@/utils/cookie'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/index.vue'),
    meta: { 
      requiresAuth: true
    }
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 初始化用户状态
  userStore.initializeFromStorage()

  // 需要登录的路由
  if (to.meta.requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 尝试验证token
      try {
        await userStore.validateToken()
        next()
      } catch (error) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 