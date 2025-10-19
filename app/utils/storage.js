/**
 * 数据存储管理器
 * 支持本地存储、云存储和数据同步
 */

class StorageManager {
  constructor() {
    this.localStoragePrefix = 'listingwriter_'
    this.cloudStorageEnabled = false
    this.syncQueue = []
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true
    
    // 监听网络状态（仅在浏览器环境中）
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true
        this.syncPendingData()
      })
      
      window.addEventListener('offline', () => {
        this.isOnline = false
      })
    }
  }

  // 本地存储操作
  setLocal(key, value) {
    if (typeof localStorage === 'undefined') return false
    
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: '1.0'
      }
      localStorage.setItem(this.localStoragePrefix + key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Local storage error:', error)
      return false
    }
  }

  getLocal(key) {
    if (typeof localStorage === 'undefined') return null
    
    try {
      const item = localStorage.getItem(this.localStoragePrefix + key)
      if (!item) return null
      
      const data = JSON.parse(item)
      return data.value
    } catch (error) {
      console.error('Local storage read error:', error)
      return null
    }
  }

  removeLocal(key) {
    if (typeof localStorage === 'undefined') return false
    
    try {
      localStorage.removeItem(this.localStoragePrefix + key)
      return true
    } catch (error) {
      console.error('Local storage remove error:', error)
      return false
    }
  }

  // 获取所有本地存储的键
  getAllLocalKeys() {
    if (typeof localStorage === 'undefined') return []
    
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.localStoragePrefix)) {
        keys.push(key.replace(this.localStoragePrefix, ''))
      }
    }
    return keys
  }

  // 云存储操作（模拟）
  async setCloud(key, value, userId = null) {
    if (!this.isOnline) {
      // 离线时加入同步队列
      this.syncQueue.push({
        action: 'set',
        key,
        value,
        userId,
        timestamp: Date.now()
      })
      return false
    }

    try {
      const response = await fetch('/api/cloud-storage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          key,
          value,
          userId,
          timestamp: Date.now()
        })
      })

      if (response.ok) {
        // 同时保存到本地作为缓存
        this.setLocal(`cloud_${key}`, value)
        return true
      }
      return false
    } catch (error) {
      console.error('Cloud storage error:', error)
      // 失败时保存到本地
      this.setLocal(key, value)
      this.syncQueue.push({
        action: 'set',
        key,
        value,
        userId,
        timestamp: Date.now()
      })
      return false
    }
  }

  async getCloud(key, userId = null) {
    if (!this.isOnline) {
      // 离线时从本地缓存获取
      return this.getLocal(`cloud_${key}`)
    }

    try {
      const response = await fetch(`/api/cloud-storage?key=${key}&userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // 更新本地缓存
        this.setLocal(`cloud_${key}`, data.value)
        return data.value
      }
      
      // 云端获取失败时尝试本地缓存
      return this.getLocal(`cloud_${key}`)
    } catch (error) {
      console.error('Cloud storage read error:', error)
      return this.getLocal(`cloud_${key}`)
    }
  }

  async removeCloud(key, userId = null) {
    if (!this.isOnline) {
      this.syncQueue.push({
        action: 'remove',
        key,
        userId,
        timestamp: Date.now()
      })
      return false
    }

    try {
      const response = await fetch('/api/cloud-storage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ key, userId })
      })

      if (response.ok) {
        this.removeLocal(`cloud_${key}`)
        return true
      }
      return false
    } catch (error) {
      console.error('Cloud storage remove error:', error)
      return false
    }
  }

  // 数据同步
  async syncPendingData() {
    if (!this.isOnline || this.syncQueue.length === 0) return

    const queue = [...this.syncQueue]
    this.syncQueue = []

    for (const item of queue) {
      try {
        switch (item.action) {
          case 'set':
            await this.setCloud(item.key, item.value, item.userId)
            break
          case 'remove':
            await this.removeCloud(item.key, item.userId)
            break
        }
      } catch (error) {
        console.error('Sync error:', error)
        // 同步失败的项目重新加入队列
        this.syncQueue.push(item)
      }
    }
  }

  // 获取认证令牌
  getAuthToken() {
    return this.getLocal('auth_token') || ''
  }

  // 用户数据管理
  async saveUserData(userId, data) {
    const key = `user_data_${userId}`
    const success = await this.setCloud(key, data, userId)
    
    // 同时保存到本地
    this.setLocal(key, data)
    
    return success
  }

  async getUserData(userId) {
    const key = `user_data_${userId}`
    
    // 优先从云端获取
    let data = await this.getCloud(key, userId)
    
    // 如果云端没有，尝试本地
    if (!data) {
      data = this.getLocal(key)
    }
    
    return data
  }

  // 内容历史管理
  async saveContentHistory(userId, content) {
    const historyKey = `content_history_${userId}`
    let history = await this.getUserData(userId) || { contents: [] }
    
    const newContent = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      type: 'listing'
    }
    
    history.contents.unshift(newContent)
    
    // 限制历史记录数量
    if (history.contents.length > 100) {
      history.contents = history.contents.slice(0, 100)
    }
    
    return await this.saveUserData(userId, history)
  }

  async getContentHistory(userId, limit = 20) {
    const data = await this.getUserData(userId)
    if (!data || !data.contents) return []
    
    return data.contents.slice(0, limit)
  }

  // 模板管理
  async saveTemplate(userId, template) {
    const templatesKey = `templates_${userId}`
    let templates = this.getLocal(templatesKey) || []
    
    const newTemplate = {
      id: Date.now().toString(),
      ...template,
      timestamp: Date.now()
    }
    
    templates.push(newTemplate)
    
    this.setLocal(templatesKey, templates)
    await this.setCloud(templatesKey, templates, userId)
    
    return newTemplate
  }

  async getTemplates(userId) {
    const templatesKey = `templates_${userId}`
    
    // 优先从云端获取
    let templates = await this.getCloud(templatesKey, userId)
    
    // 如果云端没有，尝试本地
    if (!templates) {
      templates = this.getLocal(templatesKey) || []
    }
    
    return templates
  }

  async deleteTemplate(userId, templateId) {
    const templatesKey = `templates_${userId}`
    let templates = await this.getTemplates(userId)
    
    templates = templates.filter(t => t.id !== templateId)
    
    this.setLocal(templatesKey, templates)
    await this.setCloud(templatesKey, templates, userId)
    
    return true
  }

  // 设置管理
  async saveSettings(userId, settings) {
    const settingsKey = `settings_${userId}`
    
    this.setLocal(settingsKey, settings)
    await this.setCloud(settingsKey, settings, userId)
    
    return true
  }

  async getSettings(userId) {
    const settingsKey = `settings_${userId}`
    
    // 优先从云端获取
    let settings = await this.getCloud(settingsKey, userId)
    
    // 如果云端没有，尝试本地
    if (!settings) {
      settings = this.getLocal(settingsKey) || {
        theme: 'light',
        language: 'zh-CN',
        autoSave: true,
        notifications: true
      }
    }
    
    return settings
  }

  // 数据导出
  async exportUserData(userId) {
    const userData = await this.getUserData(userId)
    const templates = await this.getTemplates(userId)
    const settings = await this.getSettings(userId)
    
    return {
      userData,
      templates,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
  }

  // 数据导入
  async importUserData(userId, data) {
    try {
      if (data.userData) {
        await this.saveUserData(userId, data.userData)
      }
      
      if (data.templates) {
        const templatesKey = `templates_${userId}`
        this.setLocal(templatesKey, data.templates)
        await this.setCloud(templatesKey, data.templates, userId)
      }
      
      if (data.settings) {
        await this.saveSettings(userId, data.settings)
      }
      
      return true
    } catch (error) {
      console.error('Import error:', error)
      return false
    }
  }

  // 清理过期数据
  cleanupExpiredData(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30天
    if (typeof localStorage === 'undefined') return
    
    const keys = this.getAllLocalKeys()
    const now = Date.now()
    
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(this.localStoragePrefix + key)
        if (item) {
          const data = JSON.parse(item)
          if (data.timestamp && (now - data.timestamp) > maxAge) {
            this.removeLocal(key)
          }
        }
      } catch (error) {
        // 如果解析失败，删除该项
        this.removeLocal(key)
      }
    })
  }

  // 获取存储统计信息
  getStorageStats() {
    if (typeof localStorage === 'undefined') {
      return {
        totalKeys: 0,
        totalSize: 0,
        availableSpace: 0
      }
    }
    
    const keys = this.getAllLocalKeys()
    let totalSize = 0
    
    keys.forEach(key => {
      const item = localStorage.getItem(this.localStoragePrefix + key)
      if (item) {
        totalSize += item.length
      }
    })
    
    return {
      itemCount: keys.length,
      totalSize: totalSize,
      formattedSize: this.formatBytes(totalSize),
      syncQueueLength: this.syncQueue.length,
      isOnline: this.isOnline
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// 创建全局实例
const storageManager = new StorageManager()

export default storageManager