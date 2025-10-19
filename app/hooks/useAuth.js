'use client'

import { useState, useEffect, useCallback } from 'react'
import authManager from '../utils/auth'

// 认证Hook
export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 初始化认证状态
    const initAuth = () => {
      const currentUser = authManager.getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
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

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const result = await authManager.login(email, password)
      return result
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

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUsage,
    upgradePlan,
    hasPermission,
    hasRole,
    getUserStats
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