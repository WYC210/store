import { BaseApiService } from './base'
import { validator } from '@/utils/validator'

class UserService extends BaseApiService {
  constructor() {
    super('/users')
  }

  // 登录
  async login(credentials) {
    const { username, password } = credentials

    if (!validator.validateUsername(username).valid) {
      throw new Error('用户名格式不正确')
    }

    return this.request({
      url: this.getUrl('users/login'),
      method: 'POST',
      data: {
        username: username.trim(),
        password
      }
    })
  }

  // 注册
  async register(userData) {
    const { username, password, email } = userData
    
    // 验证用户输入
    const usernameValidation = validator.validateUsername(username)
    if (!usernameValidation.valid) {
      throw new Error(usernameValidation.message)
    }

    const passwordValidation = validator.validatePassword(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message)
    }

    if (!validator.validateEmail(email)) {
      throw new Error('邮箱格式不正确')
    }
    
    return this.request({
      url: this.getUrl('users/register'),
      method: 'POST',
      data: {
        username: username.trim(),
        password,
        email: email.trim()
      }
    })
  }

  // 获取用户信息
  async getUserInfo() {
    return this.request({
      url: this.getUrl('/info'),
      method: 'GET'
    })
  }

  // 更新用户信息
  async updateUserInfo(data) {
    const { phone, email, gender } = data

    if (phone && !validator.validatePhone(phone)) {
      throw new Error('手机号格式不正确')
    }

    if (email && !validator.validateEmail(email)) {
      throw new Error('邮箱格式不正确')
    }

    return this.request({
      url: this.getUrl('/update'),
      method: 'PATCH',
      data: { phone, email, gender }
    })
  }

  // 更新密码
  async updatePassword(data) {
    const { oldPassword, newPassword } = data

    const validation = validator.validatePassword(newPassword)
    if (!validation.valid) {
      throw new Error(validation.message)
    }

    return this.request({
      url: this.getUrl('/password'),
      method: 'PATCH',
      data: { oldPassword, newPassword }
    })
  }

  // 更新头像
  async updateAvatar(file) {
    if (!file || !(file instanceof File)) {
      throw new Error('请选择有效的图片文件')
    }
    
    const formData = new FormData()
    formData.append('avatar', file)
    
    return this.request({
      url: this.getUrl('/avatar'),
      method: 'PATCH',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  // 获取用户权限
  async getUserPermissions(userId) {
    return this.request({
      url: this.getUrl(`/${userId}/permissions`),
      method: 'GET'
    })
  }

  // 检查用户名是否可用
  async checkUsername(username) {
    return this.request({
      url: this.getUrl('/check-username'),
      method: 'POST',
      data: { username }
    })
  }

  // 发送验证码
  async sendVerificationCode(email) {
    if (!validator.validateEmail(email)) {
      throw new Error('邮箱格式不正确')
    }

    return this.request({
      url: this.getUrl('/send-code'),
      method: 'POST',
      data: { email }
    })
  }

  // 重置密码
  async resetPassword(data) {
    const { email, code, newPassword } = data

    const validation = validator.validatePassword(newPassword)
    if (!validation.valid) {
      throw new Error(validation.message)
    }

    return this.request({
      url: this.getUrl('/reset-password'),
      method: 'POST',
      data: { email, code, newPassword }
    })
  }
}

export const userService = new UserService() 