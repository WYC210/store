import Cookies from 'js-cookie'

class CookieManager {
  constructor(defaultOptions = {}) {
    this.defaultOptions = {
      path: '/',
      sameSite: 'Lax',
      ...defaultOptions
    }
  }

  set(name, value, options = {}) {
    try {
      const { maxAge, ...rest } = options
      const finalOptions = {
        ...this.defaultOptions,
        // 将 maxAge 从秒转换为天数
        expires: maxAge ? maxAge / (60 * 60 * 24) : undefined,
        ...rest
      }

      Cookies.set(name, value, finalOptions)
    } catch (error) {
      console.error('设置 cookie 失败:', error)
      throw error
    }
  }

  get(name) {
    try {
      return Cookies.get(name)
    } catch (error) {
      console.error('获取 cookie 失败:', error)
      return null
    }
  }

  remove(name, options = {}) {
    try {
      Cookies.remove(name, {
        ...this.defaultOptions,
        ...options
      })
    } catch (error) {
      console.error('删除 cookie 失败:', error)
      throw error
    }
  }

  isEnabled() {
    try {
      this.set('test_cookie', '1')
      const result = this.get('test_cookie')
      this.remove('test_cookie')
      return !!result
    } catch (error) {
      console.error('检查 cookie 是否可用失败:', error)
      return false
    }
  }
}

export const cookieManager = new CookieManager()