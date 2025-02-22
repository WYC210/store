import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import Home from '@/views/home/index.vue'
import NotFound from '@/views/NotFound.vue'
import Admin from '@/views/admin/index.vue'
import Cart from '@/views/cart/index.vue'
import { getCookie, removeCookie } from '@/utils/cookie'
import { useUserStore } from '@/stores/user'
import ProductDetail from '@/views/product/components/ProductDetail.vue'
import Checkout from '@/views/checkout/index.vue'
import Payment from '@/views/payment/index.vue'
import OrderList from '@/views/profile/orders/index.vue'

const routes = [
  {
    path: '/',
    redirect: '/home',
    meta: { requiresAuth: false }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { 
      requiresAuth: true,
      title: '购物车'
    }
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
    path: '/profile/orders',
    name: 'UserOrders',
    component: OrderList,
    meta: { requiresAuth: true }
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
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
    beforeEnter: (to, from, next) => {
      console.log('路由参数:', to.params);
      if (!to.params.id) {
        next('/home');
      } else {
        next();
      }
    }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/:orderId/:totalAmount',
    name: 'Payment',
    component: Payment,
    props: true,
    meta: { requiresAuth: true }
  },
  { path: '/productsList',
  name: 'ProductPage',
  component: () => import('@/views/product/components/ProductPage.vue'), // 动态导入
  props: true,
  meta: { requiresAuth: false } // 根据需要设置是否需要登录

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 如果是访问根路径，重定向到首页
  if (to.path === '/') {
    next('/home')
    return
  }

  // 需要登录的路由
  if (to.meta.requiresAuth) {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!accessToken || !refreshToken) {
      ElMessage.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    try {
      if (!userStore.isLoggedIn) {
        await userStore.initializeFromStorage()
      }
      next()
    } catch (error) {
      console.error('验证用户状态失败:', error)
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

export default router 