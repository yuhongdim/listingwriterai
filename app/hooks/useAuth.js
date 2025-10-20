'use client'

import { useState, useEffect, useCallback } from 'react'
import authManager from '../utils/auth'

// 认证Hook
export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTrialMode, setIsTrialMode] = useState(false)

  useEffect(() => {
    // 初始化认证状态
    const initAuth = () => {
      const currentUser = authManager.getCurrentUser()
      const trialMode = localStorage.getItem('trialMode') === 'true'
      
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
      setIsTrialMode(trialMode)
      setIsLoading(false)
    }

    // 添加认证状态监听器
    const unsubscribe = authManager.addListener((currentUser) => {
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
      setIsLoading(false)
    })

    initAuth()

    return unsubscribe
  }, [])

  const login = useCallback(async (userOrEmail, password = null) => {
    setIsLoading(true)
    try {
      // 如果传入的是用户对象（新的简化登录方式）
      if (typeof userOrEmail === 'object' && userOrEmail.email) {
        const result = await authManager.loginWithUser(userOrEmail)
        return result
      }
      // 传统的邮箱密码登录方式
      else if (typeof userOrEmail === 'string' && password) {
        const result = await authManager.login(userOrEmail, password)
        return result
      }
      // 只有邮箱的一键登录方式
      else if (typeof userOrEmail === 'string') {
        const result = await authManager.loginWithEmail(userOrEmail)
        return result
      }
      
      throw new Error('Invalid login parameters')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      const result = await authManager.register(userData)
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authManager.logout()
  }, [])

  const updateUsage = useCallback((count) => {
    return authManager.updateUsageCount(count)
  }, [])

  const upgradePlan = useCallback((planType) => {
    return authManager.upgradePlan(planType)
  }, [])

  const hasPermission = useCallback((feature) => {
    return authManager.hasPermission(feature)
  }, [])

  const hasRole = useCallback((role) => {
    return authManager.hasRole(role)
  }, [])

  const getUserStats = useCallback(() => {
    return authManager.getUserStats()
  }, [])

  const startTrialMode = useCallback(() => {
    localStorage.setItem('trialMode', 'true')
    localStorage.setItem('trialStartTime', Date.now().toString())
    setIsTrialMode(true)
  }, [])

  const endTrialMode = useCallback(() => {
    localStorage.removeItem('trialMode')
    localStorage.removeItem('trialStartTime')
    setIsTrialMode(false)
  }, [])

  const getTrialUsage = useCallback(() => {
    const usage = localStorage.getItem('trialUsage')
    return usage ? parseInt(usage) : 0
  }, [])

  const updateTrialUsage = useCallback(() => {
    const currentUsage = getTrialUsage()
    const newUsage = currentUsage + 1
    localStorage.setItem('trialUsage', newUsage.toString())
    return newUsage
  }, [getTrialUsage])

  const isTrialExpired = useCallback(() => {
    const freeLimit = 3 // 免费试用3次
    return getTrialUsage() >= freeLimit
  }, [getTrialUsage])

  return {
    user,
    isLoading,
    isAuthenticated,
    isTrialMode,
    login,
    register,
    logout,
    updateUsage,
    upgradePlan,
    hasPermission,
    hasRole,
    getUserStats,
    startTrialMode,
    endTrialMode,
    getTrialUsage,
    updateTrialUsage,
    isTrialExpired
  }
}

// 权限检查Hook
export function usePermission(feature) {
  const { hasPermission } = useAuth()
  return hasPermission(feature)
}

// 角色检查Hook
export function useRole(role) {
  const { hasRole } = useAuth()
  return hasRole(role)
}

// 用户统计Hook
export function useUserStats() {
  const { getUserStats } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const userStats = getUserStats()
    setStats(userStats)
  }, [getUserStats])

  return stats
}