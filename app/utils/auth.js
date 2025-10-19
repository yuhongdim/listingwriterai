'use client'

// 用户认证工具类
class AuthManager {
  constructor() {
    this.currentUser = null
    this.isAuthenticated = false
    this.listeners = []
    this.init()
  }

  // 初始化认证状态
  init() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedUser = localStorage.getItem('listingai_user')
      if (savedUser) {
        try {
          this.currentUser = JSON.parse(savedUser)
          this.validateToken()
        } catch (error) {
          console.error('Failed to parse saved user:', error)
          this.logout()
        }
      }
      this.isInitialized = true
      this.notifyListeners()
    }
  }

  // 添加认证状态监听器
  addListener(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // 通知所有监听器
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser))
  }

  // 用户注册
  async register(userData) {
    try {
      // 验证输入数据
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('请填写所有必填字段')
      }

      // 检查邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        throw new Error('请输入有效的邮箱地址')
      }

      // 检查密码强度
      if (userData.password.length < 6) {
        throw new Error('密码长度至少6位')
      }

      // 检查用户是否已存在
      if (typeof localStorage !== 'undefined') {
        const existingUsers = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const userExists = existingUsers.find(user => user.email === userData.email)
        
        if (userExists) {
          throw new Error('该邮箱已被注册')
        }

        // 创建新用户
        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          password: userData.password, // 实际应用中应该加密
          company: userData.company || '',
          role: 'user',
          plan: 'free',
          createdAt: new Date().toISOString(),
          usage: {
            monthly: 0,
            total: 0
          },
          permissions: ['basic_generation', 'export_content']
        }

        // 保存用户到本地存储
        existingUsers.push(newUser)
        localStorage.setItem('listingai_users', JSON.stringify(existingUsers))

        // 生成token并设置当前用户
        const userWithToken = { ...newUser, token: this.generateToken(newUser) }
        delete userWithToken.password
        
        localStorage.setItem('listingai_user', JSON.stringify(userWithToken))
        this.currentUser = userWithToken
        this.isAuthenticated = true
        
        this.notifyListeners()
        return { success: true, user: userWithToken }
      }
      
      return { success: false, error: '存储不可用' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 用户登录
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('请输入邮箱和密码')
      }

      if (typeof localStorage !== 'undefined') {
        const users = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
          throw new Error('邮箱或密码错误')
        }

        // 生成新token
        const userWithToken = { ...user, token: this.generateToken(user) }
        delete userWithToken.password
        
        localStorage.setItem('listingai_user', JSON.stringify(userWithToken))
        this.currentUser = userWithToken
        this.isAuthenticated = true
        
        this.notifyListeners()
        return { success: true, user: userWithToken }
      }
      
      return { success: false, error: '存储不可用' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 用户登出
  logout() {
    this.currentUser = null
    this.isAuthenticated = false
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('listingai_user')
    }
    
    this.notifyListeners()
  }

  // 检查是否已登录
  isAuthenticated() {
    return !!this.currentUser && this.isTokenValid()
  }

  // 获取当前用户
  getCurrentUser() {
    return this.currentUser
  }

  // 检查用户权限
  hasPermission(feature) {
    if (!this.currentUser) return false
    return this.currentUser.features[feature] || false
  }

  // 检查用户角色
  hasRole(role) {
    if (!this.currentUser) return false
    return this.currentUser.role === role || this.currentUser.role === 'admin'
  }

  // 更新用户使用次数
  updateUsageCount(count) {
    if (!this.currentUser) return false
    
    this.currentUser.usageCount = count
    localStorage.setItem('listingai_user', JSON.stringify(this.currentUser))
    this.updateStoredUser(this.currentUser)
    this.notifyListeners()
    return true
  }

  // 升级用户计划
  upgradePlan(planType) {
    if (!this.currentUser) return false

    const plans = {
      pro: {
        plan: 'pro',
        maxUsage: 50,
        features: {
          basicGeneration: true,
          emailCenter: true,
          videoScript: true,
          socialMedia: true,
          analytics: false,
          export: true
        }
      },
      premium: {
        plan: 'premium',
        maxUsage: -1, // 无限制
        features: {
          basicGeneration: true,
          emailCenter: true,
          videoScript: true,
          socialMedia: true,
          analytics: true,
          export: true
        }
      }
    }

    if (plans[planType]) {
      Object.assign(this.currentUser, plans[planType])
      localStorage.setItem('listingai_user', JSON.stringify(this.currentUser))
      this.updateStoredUser(this.currentUser)
      this.notifyListeners()
      return true
    }
    return false
  }

  // 验证邮箱格式
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 生成用户ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 生成token
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天过期
    }
    return btoa(JSON.stringify(payload))
  }

  // 验证token
  isTokenValid() {
    if (!this.currentUser?.token) return false
    
    try {
      const payload = JSON.parse(atob(this.currentUser.token))
      return payload.exp > Date.now()
    } catch {
      return false
    }
  }

  // 验证并刷新token
  validateToken() {
    if (!this.isTokenValid()) {
      this.logout()
      return false
    }
    return true
  }

  // 获取存储的用户列表
  getStoredUsers() {
    if (typeof window === 'undefined') return []
    
    try {
      const users = localStorage.getItem('listingai_users')
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  // 更新存储的用户信息
  updateStoredUser(updatedUser) {
    const users = this.getStoredUsers()
    const index = users.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      users[index] = { ...updatedUser }
      delete users[index].token // 不保存token到用户列表
      localStorage.setItem('listingai_users', JSON.stringify(users))
    }
  }

  // 重置密码（简化版）
  async resetPassword(email) {
    try {
      const users = this.getStoredUsers()
      const user = users.find(u => u.email === email)
      
      if (!user) {
        throw new Error('用户不存在')
      }

      // 实际应用中应发送邮件
      console.log('Password reset email sent to:', email)
      return { success: true, message: '重置密码邮件已发送' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 获取用户统计信息
  getUserStats() {
    if (!this.currentUser) return null

    return {
      usageCount: this.currentUser.usageCount || 0,
      maxUsage: this.currentUser.maxUsage || 3,
      plan: this.currentUser.plan || 'free',
      memberSince: this.currentUser.createdAt,
      lastLogin: this.currentUser.lastLogin
    }
  }

  // 更新用户信息
  updateUser(updates) {
    if (!this.isAuthenticated || !this.currentUser) {
      return { success: false, error: '用户未登录' }
    }

    try {
      this.currentUser = { ...this.currentUser, ...updates }
      
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('listingai_user', JSON.stringify(this.currentUser))
        
        // 同时更新用户列表中的信息
        const users = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const userIndex = users.findIndex(u => u.id === this.currentUser.id)
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updates }
          localStorage.setItem('listingai_users', JSON.stringify(users))
        }
      }
      
      this.notifyListeners()
      return { success: true, user: this.currentUser }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // 更新用户使用量
  updateUsage(increment = 1) {
    if (!this.isAuthenticated || !this.currentUser) return

    this.currentUser.usage.monthly += increment
    this.currentUser.usage.total += increment
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('listingai_user', JSON.stringify(this.currentUser))
    }
    
    this.notifyListeners()
  }

  // 获取所有用户（管理员功能）
  getAllUsers() {
    if (!this.hasPermission('admin_access')) {
      return []
    }
    
    if (typeof localStorage !== 'undefined') {
      const users = localStorage.getItem('listingai_users')
      return users ? JSON.parse(users) : []
    }
    
    return []
  }

  // 更新用户状态（管理员功能）
  updateUserStatus(userId, status) {
    if (!this.hasPermission('admin_access')) {
      return { success: false, error: '权限不足' }
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const users = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const userIndex = users.findIndex(u => u.id === userId)
        
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...status }
          localStorage.setItem('listingai_users', JSON.stringify(users))
          return { success: true }
        }
      }
      
      return { success: false, error: '用户不存在' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// 创建全局实例
const authManager = new AuthManager()

export default authManager