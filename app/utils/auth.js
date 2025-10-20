'use client'

// User authentication utility class
class AuthManager {
  constructor() {
    this.currentUser = null
    this.isAuthenticated = false
    this.listeners = []
    this.init()
  }

  // Initialize authentication state
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

  // Add listener for authentication state
  addListener(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentUser))
  }

  // User registration
  async register(userData) {
    try {
      // Validate input data
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('Please fill in all required fields')
      }

      // Check email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please enter a valid email address')
      }

      // Check password strength
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      // Check if user already exists
      if (typeof localStorage !== 'undefined') {
        const existingUsers = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const userExists = existingUsers.find(user => user.email === userData.email)
        
        if (userExists) {
          throw new Error('This email is already registered')
        }

        // Create new user
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

        // Save user to local storage
        existingUsers.push(newUser)
        localStorage.setItem('listingai_users', JSON.stringify(existingUsers))

        // Generate token and set current user
        const userWithToken = { ...newUser, token: this.generateToken(newUser) }
        delete userWithToken.password
        
        localStorage.setItem('listingai_user', JSON.stringify(userWithToken))
        this.currentUser = userWithToken
        this.isAuthenticated = true
        
        this.notifyListeners()
        return { success: true, user: userWithToken }
      }
      
      return { success: false, error: 'Storage not available' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // User login
  async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Please enter email and password')
      }

      if (typeof localStorage !== 'undefined') {
        const users = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const user = users.find(u => u.email === email && u.password === password)
        
        if (!user) {
          throw new Error('Incorrect email or password')
        }

        // Generate new token
        const userWithToken = { ...user, token: this.generateToken(user) }
        delete userWithToken.password
        
        localStorage.setItem('listingai_user', JSON.stringify(userWithToken))
        this.currentUser = userWithToken
        this.isAuthenticated = true
        
        this.notifyListeners()
        return { success: true, user: userWithToken }
      }
      
      return { success: false, error: 'Storage not available' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // User object login (new simplified method)
  async loginWithUser(userObj) {
    try {
      if (!userObj || !userObj.email) {
        throw new Error('Invalid user information')
      }

      if (typeof localStorage !== 'undefined') {
        // Generate new token
        const userWithToken = { 
          ...userObj, 
          token: this.generateToken(userObj),
          id: userObj.id || this.generateUserId(),
          createdAt: userObj.createdAt || new Date().toISOString(),
          plan: userObj.plan || 'free',
          usageCount: userObj.usageCount || 0,
          maxUsage: userObj.maxUsage || 3
        }
        
        // Save to local storage
        localStorage.setItem('listingai_user', JSON.stringify(userWithToken))
        
        // Update user list
        const users = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        const existingUserIndex = users.findIndex(u => u.email === userObj.email)
        
        if (existingUserIndex >= 0) {
          users[existingUserIndex] = { ...userWithToken }
        } else {
          users.push({ ...userWithToken })
        }
        
        localStorage.setItem('listingai_users', JSON.stringify(users))
        
        this.currentUser = userWithToken
        this.isAuthenticated = true
        
        this.notifyListeners()
        return { success: true, user: userWithToken }
      }
      
      return { success: false, error: 'Storage not available' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // One-click email login (auto register or login)
  async loginWithEmail(email) {
    try {
      if (!email || !this.isValidEmail(email)) {
        throw new Error('Please enter a valid email address')
      }

      if (typeof localStorage !== 'undefined') {
        const users = JSON.parse(localStorage.getItem('listingai_users') || '[]')
        let user = users.find(u => u.email === email)
        
        // If user does not exist, auto create
        if (!user) {
          user = {
            id: this.generateUserId(),
            name: email.split('@')[0],
            email: email,
            plan: 'free',
            usageCount: 0,
            maxUsage: 3,
            createdAt: new Date().toISOString(),
            isNewUser: true
          }
          
          users.push(user)
          localStorage.setItem('listingai_users', JSON.stringify(users))
        }

        // Generate new token and login
        const userWithToken = { ...user, token: this.generateToken(user) }
        delete userWithToken.password
        
        localStorage.setItem('listingai_user', JSON.stringify(userWithToken))
        this.currentUser = userWithToken
        this.isAuthenticated = true
        
        this.notifyListeners()
        return { success: true, user: userWithToken }
      }
      
      return { success: false, error: 'Storage not available' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // User logout
  logout() {
    this.currentUser = null
    this.isAuthenticated = false
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('listingai_user')
    }
    
    this.notifyListeners()
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser && this.isTokenValid()
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser
  }

  // Check user permissions
  hasPermission(feature) {
    if (!this.currentUser) return false
    return this.currentUser.features[feature] || false
  }

  // Check user role
  hasRole(role) {
    if (!this.currentUser) return false
    return this.currentUser.role === role || this.currentUser.role === 'admin'
  }

  // Update user usage count
  updateUsageCount(count) {
    if (!this.currentUser) return false
    
    this.currentUser.usageCount = count
    localStorage.setItem('listingai_user', JSON.stringify(this.currentUser))
    this.updateStoredUser(this.currentUser)
    this.notifyListeners()
    return true
  }

  // Upgrade user plan
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

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Generate user ID
  generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Generate token
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7天过期
    }
    return btoa(JSON.stringify(payload))
  }

  // Validate token
  isTokenValid() {
    if (!this.currentUser?.token) return false
    
    try {
      const payload = JSON.parse(atob(this.currentUser.token))
      return payload.exp > Date.now()
    } catch {
      return false
    }
  }

  // Validate and refresh token
  validateToken() {
    if (!this.isTokenValid()) {
      this.logout()
      return false
    }
    return true
  }

  // Get stored users list
  getStoredUsers() {
    if (typeof window === 'undefined') return []
    
    try {
      const users = localStorage.getItem('listingai_users')
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  // Update stored user information
  updateStoredUser(updatedUser) {
    const users = this.getStoredUsers()
    const index = users.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      users[index] = { ...updatedUser }
      delete users[index].token // 不保存token到用户列表
      localStorage.setItem('listingai_users', JSON.stringify(users))
    }
  }

  // Reset password (simplified version)
  async resetPassword(email) {
    try {
      const users = this.getStoredUsers()
      const user = users.find(u => u.email === email)
      
      if (!user) {
        throw new Error('User does not exist')
      }

      // In a real application, an email should be sent
      console.log('Password reset email sent to:', email)
      return { success: true, message: 'Password reset email has been sent' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get user stats
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

  // Update user information
  updateUser(updates) {
    if (!this.isAuthenticated || !this.currentUser) {
      return { success: false, error: 'User not logged in' }
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

  // Update user usage
  updateUsage(increment = 1) {
    if (!this.isAuthenticated || !this.currentUser) return

    this.currentUser.usage.monthly += increment
    this.currentUser.usage.total += increment
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('listingai_user', JSON.stringify(this.currentUser))
    }
    
    this.notifyListeners()
  }

  // Get all users (admin function)
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

  // Update user status (admin function)
  updateUserStatus(userId, status) {
    if (!this.hasPermission('admin_access')) {
      return { success: false, error: 'Insufficient permissions' }
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
      
      return { success: false, error: 'User does not exist' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Create global instance
const authManager = new AuthManager()

export default authManager