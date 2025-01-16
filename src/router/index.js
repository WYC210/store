import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Home from '@/views/home/index.vue'
import NotFound from '@/views/NotFound.vue'
import Admin from '@/views/admin/index.vue'
import { getCookie, removeCookie } from '@/utils/cookie'

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

router.beforeEach((to, from, next) => {
  // 进入登录或注册页面时
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  // 验证需要登录的页面
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = getCookie('token')
    if (!token) {
      ElMessage.warning('请先登录')
      next({
        path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 