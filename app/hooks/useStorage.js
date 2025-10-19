/**
 * 存储相关的React钩子
 * 提供数据持久化和云同步功能
 */

import { useState, useEffect, useCallback } from 'react'
import storageManager from '../utils/storage'
import { useAuth } from './useAuth'

// 本地存储钩子
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = storageManager.getLocal(key)
      return item !== null ? item : initialValue
    } catch (error) {
      console.error('useLocalStorage error:', error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      storageManager.setLocal(key, valueToStore)
    } catch (error) {
      console.error('useLocalStorage setValue error:', error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// 云存储钩子
export function useCloudStorage(key, initialValue) {
  const { user, isAuthenticated } = useAuth()
  const [storedValue, setStoredValue] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const data = await storageManager.getCloud(key, user.id)
        if (data !== null) {
          setStoredValue(data)
        }
      } catch (err) {
        setError(err)
        console.error('useCloudStorage load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [key, user, isAuthenticated])

  const setValue = useCallback(async (value) => {
    if (!isAuthenticated || !user) return false

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      const success = await storageManager.setCloud(key, valueToStore, user.id)
      return success
    } catch (err) {
      setError(err)
      console.error('useCloudStorage setValue error:', err)
      return false
    }
  }, [key, user, isAuthenticated, storedValue])

  return [storedValue, setValue, { loading, error }]
}

// 用户数据钩子
export function useUserData() {
  const { user, isAuthenticated } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    const loadUserData = async () => {
      try {
        setLoading(true)
        const data = await storageManager.getUserData(user.id)
        setUserData(data)
      } catch (err) {
        setError(err)
        console.error('useUserData load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [user, isAuthenticated])

  const saveUserData = useCallback(async (data) => {
    if (!isAuthenticated || !user) return false

    try {
      const success = await storageManager.saveUserData(user.id, data)
      if (success) {
        setUserData(data)
      }
      return success
    } catch (err) {
      setError(err)
      console.error('useUserData save error:', err)
      return false
    }
  }, [user, isAuthenticated])

  return { userData, saveUserData, loading, error }
}

// 内容历史钩子
export function useContentHistory() {
  const { user, isAuthenticated } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    const loadHistory = async () => {
      try {
        setLoading(true)
        const data = await storageManager.getContentHistory(user.id)
        setHistory(data)
      } catch (err) {
        setError(err)
        console.error('useContentHistory load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [user, isAuthenticated])

  const saveContent = useCallback(async (content) => {
    if (!isAuthenticated || !user) return false

    try {
      const success = await storageManager.saveContentHistory(user.id, content)
      if (success) {
        // 重新加载历史记录
        const updatedHistory = await storageManager.getContentHistory(user.id)
        setHistory(updatedHistory)
      }
      return success
    } catch (err) {
      setError(err)
      console.error('useContentHistory save error:', err)
      return false
    }
  }, [user, isAuthenticated])

  return { history, saveContent, loading, error }
}

// 模板管理钩子
export function useTemplates() {
  const { user, isAuthenticated } = useAuth()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    const loadTemplates = async () => {
      try {
        setLoading(true)
        const data = await storageManager.getTemplates(user.id)
        setTemplates(data)
      } catch (err) {
        setError(err)
        console.error('useTemplates load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [user, isAuthenticated])

  const saveTemplate = useCallback(async (template) => {
    if (!isAuthenticated || !user) return null

    try {
      const newTemplate = await storageManager.saveTemplate(user.id, template)
      if (newTemplate) {
        setTemplates(prev => [newTemplate, ...prev])
      }
      return newTemplate
    } catch (err) {
      setError(err)
      console.error('useTemplates save error:', err)
      return null
    }
  }, [user, isAuthenticated])

  const deleteTemplate = useCallback(async (templateId) => {
    if (!isAuthenticated || !user) return false

    try {
      const success = await storageManager.deleteTemplate(user.id, templateId)
      if (success) {
        setTemplates(prev => prev.filter(t => t.id !== templateId))
      }
      return success
    } catch (err) {
      setError(err)
      console.error('useTemplates delete error:', err)
      return false
    }
  }, [user, isAuthenticated])

  return { templates, saveTemplate, deleteTemplate, loading, error }
}

// 设置管理钩子
export function useSettings() {
  const { user, isAuthenticated } = useAuth()
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'zh-CN',
    autoSave: true,
    notifications: true
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false)
      return
    }

    const loadSettings = async () => {
      try {
        setLoading(true)
        const data = await storageManager.getSettings(user.id)
        setSettings(data)
      } catch (err) {
        setError(err)
        console.error('useSettings load error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [user, isAuthenticated])

  const updateSettings = useCallback(async (newSettings) => {
    if (!isAuthenticated || !user) return false

    try {
      const updatedSettings = { ...settings, ...newSettings }
      const success = await storageManager.saveSettings(user.id, updatedSettings)
      if (success) {
        setSettings(updatedSettings)
      }
      return success
    } catch (err) {
      setError(err)
      console.error('useSettings update error:', err)
      return false
    }
  }, [user, isAuthenticated, settings])

  return { settings, updateSettings, loading, error }
}

// 数据同步钩子
export function useDataSync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [error, setError] = useState(null)

  const syncData = useCallback(async () => {
    try {
      setSyncing(true)
      setError(null)
      await storageManager.syncPendingData()
      setLastSync(new Date())
    } catch (err) {
      setError(err)
      console.error('useDataSync error:', err)
    } finally {
      setSyncing(false)
    }
  }, [])

  // 自动同步
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine) {
        syncData()
      }
    }, 5 * 60 * 1000) // 每5分钟同步一次

    return () => clearInterval(interval)
  }, [syncData])

  return { syncing, lastSync, error, syncData }
}

// 存储统计钩子
export function useStorageStats() {
  const [stats, setStats] = useState({
    itemCount: 0,
    totalSize: 0,
    formattedSize: '0 Bytes',
    syncQueueLength: 0,
    isOnline: navigator.onLine
  })

  const updateStats = useCallback(() => {
    const newStats = storageManager.getStorageStats()
    setStats(newStats)
  }, [])

  useEffect(() => {
    updateStats()
    
    // 定期更新统计信息
    const interval = setInterval(updateStats, 30000) // 每30秒更新一次
    
    return () => clearInterval(interval)
  }, [updateStats])

  const cleanup = useCallback(() => {
    storageManager.cleanupExpiredData()
    updateStats()
  }, [updateStats])

  return { stats, updateStats, cleanup }
}

// 数据导入导出钩子
export function useDataImportExport() {
  const { user, isAuthenticated } = useAuth()
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState(null)

  const exportData = useCallback(async () => {
    if (!isAuthenticated || !user) return null

    try {
      setExporting(true)
      setError(null)
      const data = await storageManager.exportUserData(user.id)
      
      // 创建下载链接
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `listingwriter_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      return data
    } catch (err) {
      setError(err)
      console.error('exportData error:', err)
      return null
    } finally {
      setExporting(false)
    }
  }, [user, isAuthenticated])

  const importData = useCallback(async (file) => {
    if (!isAuthenticated || !user) return false

    try {
      setImporting(true)
      setError(null)
      
      const text = await file.text()
      const data = JSON.parse(text)
      
      const success = await storageManager.importUserData(user.id, data)
      return success
    } catch (err) {
      setError(err)
      console.error('importData error:', err)
      return false
    } finally {
      setImporting(false)
    }
  }, [user, isAuthenticated])

  return { exportData, importData, exporting, importing, error }
}