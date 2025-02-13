import Cookies from 'js-cookie'

// 设置 cookie
export const setCookie = (name, value, options = {}) => {
  try {
    // js-cookie 期望 expires 是天数或 Date 对象，而不是秒数
    const { maxAge, ...rest } = options
    const finalOptions = {
      path: '/',
      sameSite: 'Lax',
      // 将 maxAge 从秒转换为天数
      expires: maxAge ? maxAge / (60 * 60 * 24) : undefined,
      ...rest
    }

    Cookies.set(name, value, finalOptions)
    console.log(`Cookie set: ${name}=${value}`, finalOptions)
  } catch (error) {
    console.error('设置 cookie 失败:', error)
  }
}

// 获取 cookie
export const getCookie = (name) => {
  try {
    const value = Cookies.get(name)
    console.log(`Cookie get: ${name}=${value}`)
    return value
  } catch (error) {
    console.error('获取 cookie 失败:', error)
    return null
  }
}

// 删除 cookie
export const removeCookie = (name) => {
  try {
    Cookies.remove(name, {
      path: '/',
      sameSite: 'Lax'
    })
  } catch (error) {
    console.error('删除 Cookie 时出错:', error)
  }
}

// 检查 cookie 是否可用
export const isCookieEnabled = () => {
  try {
    setCookie('test_cookie', '1')
    const result = getCookie('test_cookie')
    removeCookie('test_cookie')
    return !!result
  } catch (error) {
    console.error('检查 Cookie 是否可用时出错:', error)
    return false
  }
}