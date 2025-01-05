// 设置 cookie
export const setCookie = (name, value, options = {}) => {
  try {
    options = {
      path: '/',           // 默认路径
      sameSite: 'Lax',    // 改为 Lax，开发环境使用
      // secure: true,     // 开发环境先注释掉，因为可能不是 HTTPS
      ...options
    }

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    for (let optionKey in options) {
      const optionValue = options[optionKey]
      if (optionValue === true) {
        cookie += `; ${optionKey}`
      } else if (optionValue) {
        cookie += `; ${optionKey}=${optionValue}`
      }
    }

    document.cookie = cookie
    console.log('Cookie set:', cookie) // 调试用

    // 验证 cookie 是否设置成功（如果是删除操作则跳过验证）
    if (value !== '') {
      const savedValue = getCookie(name)
      if (!savedValue && value) {
        console.warn('Cookie 可能未设置成功')
      }
    }
  } catch (error) {
    console.error('设置 Cookie 时出错:', error)
  }
}

// 获取 cookie
export const getCookie = (name) => {
  try {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : null
  } catch (error) {
    console.error('获取 Cookie 时出错:', error)
    return null
  }
}

// 删除 cookie
export const removeCookie = (name) => {
  try {
    setCookie(name, '', {
      path: '/',
      'max-age': -1,
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