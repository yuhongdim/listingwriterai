'use client'

import pricingTiers from './pricingTiers'

// Usage tracking utility class
class UsageTracker {
  constructor() {
    this.storageKey = 'listingai_usage'
    this.data = this.loadData()
    this.listeners = []
  }

  // Load data
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

  // Save data
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

  // Get current daily limit (based on user tier)
  getDailyLimit() {
    return pricingTiers.getDailyLimit()
  }

  // Get current usage data
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

  // Save usage data
  saveUsageData(data) {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  // Check if reset is needed
  shouldReset(lastDate) {
    const today = new Date().toDateString()
    return lastDate !== today
  }

  // Get current usage count
  getCurrentCount() {
    const data = this.getUsageData()
    
    if (this.shouldReset(data.date)) {
      // If it's a new day, reset count
      const newData = { count: 0, date: new Date().toDateString() }
      this.saveUsageData(newData)
      return 0
    }
    
    return data.count
  }

  // Check if usage is allowed
  canUse() {
    const dailyLimit = this.getDailyLimit()
    if (dailyLimit === -1) return true // unlimited
    return this.getCurrentCount() < dailyLimit
  }

  // Increment usage count
  incrementUsage() {
    const data = this.getUsageData()
    const dailyLimit = this.getDailyLimit()
    
    if (this.shouldReset(data.date)) {
      // New day, reset and set to 1
      const newData = { count: 1, date: new Date().toDateString() }
      this.saveUsageData(newData)
      return 1
    } else {
      // Same day, increment count
      const newCount = dailyLimit === -1 ? data.count + 1 : Math.min(data.count + 1, dailyLimit)
      const newData = { count: newCount, date: data.date }
      this.saveUsageData(newData)
      return newCount
    }
  }

  // Get remaining usage count
  getRemainingCount() {
    const dailyLimit = this.getDailyLimit()
    if (dailyLimit === -1) return -1 // unlimited
    return Math.max(0, dailyLimit - this.getCurrentCount())
  }

  // Get reset time (next midnight)
  getResetTime() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  // Get time until reset (milliseconds)
  getTimeUntilReset() {
    return this.getResetTime().getTime() - new Date().getTime()
  }

  // Format reset countdown
  formatTimeUntilReset() {
    const ms = this.getTimeUntilReset()
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `Resets in ${hours} hours ${minutes} minutes`
    } else {
      return `Resets in ${minutes} minutes`
    }
  }

  // Clear usage data (for testing)
  clearUsageData() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.storageKey)
  }

  // Clear data
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

  // Reset usage count (for testing)
  resetUsage() {
    const newData = { count: 0, date: new Date().toDateString() }
    this.saveUsageData(newData)
    return 0
  }
}

// 创建单例实例
const usageTracker = new UsageTracker()

export default usageTracker