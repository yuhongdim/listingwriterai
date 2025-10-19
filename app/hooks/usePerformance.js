import { useState, useEffect, useCallback, useRef } from 'react'
import performanceOptimizer from '../utils/performanceOptimizer'

// 性能监控Hook
export const usePerformance = (componentName) => {
  const [metrics, setMetrics] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const renderStartTime = useRef(null)

  // 组件渲染性能监控
  useEffect(() => {
    renderStartTime.current = performance.now()
    
    return () => {
      if (renderStartTime.current && componentName) {
        const renderTime = performance.now() - renderStartTime.current
        performanceOptimizer.metrics.componentRenderTime[componentName] = renderTime
        
        setMetrics(prev => ({
          ...prev,
          [componentName]: renderTime
        }))
      }
    }
  }, [componentName])

  // 测量API调用性能
  const measureApiCall = useCallback(async (apiName, apiFunction) => {
    setIsLoading(true)
    try {
      const result = await performanceOptimizer.measureApiCall(apiName, apiFunction)
      setMetrics(prev => ({
        ...prev,
        [`api_${apiName}`]: performanceOptimizer.metrics.apiResponseTime[apiName]
      }))
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 获取性能报告
  const getReport = useCallback(() => {
    return performanceOptimizer.getPerformanceReport()
  }, [])

  return {
    metrics,
    isLoading,
    measureApiCall,
    getReport
  }
}

// 缓存Hook
export const useCache = () => {
  const setCache = useCallback((key, value, ttl) => {
    performanceOptimizer.setCache(key, value, ttl)
  }, [])

  const getCache = useCallback((key) => {
    return performanceOptimizer.getCache(key)
  }, [])

  const clearCache = useCallback(() => {
    performanceOptimizer.clearCache()
  }, [])

  return {
    setCache,
    getCache,
    clearCache
  }
}

// 防抖Hook
export const useDebounce = (callback, delay = 300, deps = []) => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay, ...deps])
}

// 节流Hook
export const useThrottle = (callback, delay = 300, deps = []) => {
  const callbackRef = useRef(callback)
  const lastCallRef = useRef(0)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback((...args) => {
    const now = Date.now()
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now
      callbackRef.current(...args)
    }
  }, [delay, ...deps])
}

// 懒加载Hook
export const useLazyLoad = () => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [])

  return [elementRef, isVisible]
}

// 虚拟滚动Hook
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
  const [scrollTop, setScrollTop] = useState(0)

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2

  useEffect(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount, items.length)
    
    setVisibleRange({ start: startIndex, end: endIndex })
  }, [scrollTop, itemHeight, visibleCount, items.length])

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  const getVisibleItems = useCallback(() => {
    return items.slice(visibleRange.start, visibleRange.end)
  }, [items, visibleRange])

  const getOffsetY = useCallback(() => {
    return visibleRange.start * itemHeight
  }, [visibleRange.start, itemHeight])

  const getTotalHeight = useCallback(() => {
    return items.length * itemHeight
  }, [items.length, itemHeight])

  return {
    visibleItems: getVisibleItems(),
    offsetY: getOffsetY(),
    totalHeight: getTotalHeight(),
    handleScroll
  }
}

// 内存监控Hook
export const useMemoryMonitor = (interval = 30000) => {
  const [memoryUsage, setMemoryUsage] = useState(null)

  useEffect(() => {
    const updateMemoryUsage = () => {
      const usage = performanceOptimizer.monitorMemoryUsage()
      setMemoryUsage(usage)
    }

    updateMemoryUsage()
    const timer = setInterval(updateMemoryUsage, interval)

    return () => clearInterval(timer)
  }, [interval])

  return memoryUsage
}

// 预加载Hook
export const usePreload = () => {
  const preloadResource = useCallback((url, type = 'fetch') => {
    performanceOptimizer.preloadResource(url, type)
  }, [])

  const preloadComponent = useCallback(async (componentPath) => {
    return performanceOptimizer.loadComponent(componentPath)
  }, [])

  return {
    preloadResource,
    preloadComponent
  }
}

// 批量处理Hook
export const useBatchProcess = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const batchProcess = useCallback(async (items, batchSize, processFn, delay = 0) => {
    setIsProcessing(true)
    setProgress(0)

    try {
      const results = []
      let currentIndex = 0

      while (currentIndex < items.length) {
        const batch = items.slice(currentIndex, currentIndex + batchSize)
        
        const batchResults = await Promise.all(
          batch.map(item => processFn(item))
        )
        
        results.push(...batchResults)
        currentIndex += batchSize
        
        setProgress((currentIndex / items.length) * 100)

        if (delay > 0 && currentIndex < items.length) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      return results
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }, [])

  return {
    batchProcess,
    isProcessing,
    progress
  }
}

// 性能优化建议Hook
export const useOptimizationTips = () => {
  const [tips, setTips] = useState([])

  useEffect(() => {
    const updateTips = () => {
      const report = performanceOptimizer.getPerformanceReport()
      setTips(report.recommendations || [])
    }

    updateTips()
    const timer = setInterval(updateTips, 60000) // 每分钟更新一次

    return () => clearInterval(timer)
  }, [])

  return tips
}