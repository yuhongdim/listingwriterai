'use client'

import pricingTiers from './pricingTiers'

// 使用量追踪工具类
class UsageTracker {
  constructor() {
    this.storageKey = 'listingai_usage'
    this.data = this.loadData()
    this.listeners = []
  }

  // 加载数据
  loadData() {
    if (typeof localStorage === 'undefined') {
      return {
        daily: {},
        monthly: {},
        total: 0,
        features: {},
        lastReset: new Date().toISOString()
      }
    }
    
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load usage data:', error)
    }
    
    return {
      daily: {},
      monthly: {},
      total: 0,
      features: {},
      lastReset: new Date().toISOString()
    }
  }

  // 保存数据
  saveData() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data))
      } catch (error) {
        console.error('Failed to save usage data:', error)
      }
    }
    this.notifyListeners()
  }

  // 获取当前每日限制（基于用户层级）
  getDailyLimit() {
    return pricingTiers.getDailyLimit()
  }

  // 获取当前使用数据
  getUsageData() {
    if (typeof window === 'undefined') return { count: 0, date: new Date().toDateString() }
    
    const stored = localStorage.getItem(this.storageKey)
    if (!stored) {
      return { count: 0, date: new Date().toDateString() }
    }
    
    try {
      return JSON.parse(stored)
    } catch {
      return { count: 0, date: new Date().toDateString() }
    }
  }

  // 保存使用数据
  saveUsageData(data) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // 检查是否需要重置计数
  shouldReset(lastDate) {
    const today = new Date().toDateString()
    return lastDate !== today
  }

  // 获取当前使用次数
  getCurrentCount() {
    const data = this.getUsageData()
    
    if (this.shouldReset(data.date)) {
      // 如果是新的一天，重置计数
      const newData = { count: 0, date: new Date().toDateString() }
      this.saveUsageData(newData)
      return 0
    }
    
    return data.count
  }

  // 检查是否可以使用
  canUse() {
    const dailyLimit = this.getDailyLimit()
    if (dailyLimit === -1) return true // unlimited
    return this.getCurrentCount() < dailyLimit
  }

  // 增加使用次数
  incrementUsage() {
    const data = this.getUsageData()
    const dailyLimit = this.getDailyLimit()
    
    if (this.shouldReset(data.date)) {
      // 新的一天，重置并设为1
      const newData = { count: 1, date: new Date().toDateString() }
      this.saveUsageData(newData)
      return 1
    } else {
      // 同一天，增加计数
      const newCount = dailyLimit === -1 ? data.count + 1 : Math.min(data.count + 1, dailyLimit)
      const newData = { count: newCount, date: data.date }
      this.saveUsageData(newData)
      return newCount
    }
  }

  // 获取剩余使用次数
  getRemainingCount() {
    const dailyLimit = this.getDailyLimit()
    if (dailyLimit === -1) return -1 // unlimited
    return Math.max(0, dailyLimit - this.getCurrentCount())
  }

  // 获取重置时间（下一个0点）
  getResetTime() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  // 获取距离重置的时间（毫秒）
  getTimeUntilReset() {
    return this.getResetTime().getTime() - new Date().getTime()
  }

  // 格式化重置倒计时
  formatTimeUntilReset() {
    const ms = this.getTimeUntilReset()
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}小时${minutes}分钟后重置`
    } else {
      return `${minutes}分钟后重置`
    }
  }

  // 清除使用数据（用于测试）
  clearUsageData() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.storageKey)
  }

  // 清理数据
  clearData() {
    this.data = {
      daily: {},
      monthly: {},
      total: 0,
      features: {},
      lastReset: new Date().toISOString()
    }
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey)
    }
    
    this.notifyListeners()
  }

  // 重置使用次数（用于测试）
  resetUsage() {
    const newData = { count: 0, date: new Date().toDateString() }
    this.saveUsageData(newData)
    return 0
  }
}

// 创建单例实例
const usageTracker = new UsageTracker()

export default usageTracker