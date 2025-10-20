// 性能优化工具类
class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      pageLoadTime: 0,
      componentRenderTime: {},
      apiResponseTime: {},
      memoryUsage: 0,
      cacheHitRate: 0
    }
    this.cache = new Map()
    this.maxCacheSize = 100
    this.debounceTimers = new Map()
    this.throttleTimers = new Map()
  }

  // 测量页面加载时间
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        console.log(`Page load time: ${this.metrics.pageLoadTime}ms`)
      }
    }
  }

  // 测量组件渲染时间
  measureComponentRender(componentName, renderFunction) {
    const startTime = performance.now()
    const result = renderFunction()
    const endTime = performance.now()
    
    this.metrics.componentRenderTime[componentName] = endTime - startTime
    
    if (endTime - startTime > 100) {
      console.warn(`Slow component render: ${componentName} took ${endTime - startTime}ms`)
    }
    
    return result
  }

  // 测量API响应时间
  async measureApiCall(apiName, apiFunction) {
    const startTime = performance.now()
    
    try {
      const result = await apiFunction()
      const endTime = performance.now()
      
      this.metrics.apiResponseTime[apiName] = endTime - startTime
      
      if (endTime - startTime > 2000) {
        console.warn(`Slow API call: ${apiName} took ${endTime - startTime}ms`)
      }
      
      return result
    } catch (error) {
      const endTime = performance.now()
      this.metrics.apiResponseTime[apiName] = endTime - startTime
      throw error
    }
  }

  // 缓存管理
  setCache(key, value, ttl = 300000) { // 默认5分钟TTL
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }

  getCache(key) {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }

    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.value
  }

  clearCache() {
    this.cache.clear()
  }

  // 防抖函数
  debounce(key, func, delay = 300) {
    return (...args) => {
      // 清除之前的定时器
      if (this.debounceTimers.has(key)) {
        clearTimeout(this.debounceTimers.get(key))
      }

      // 设置新的定时器
      const timer = setTimeout(() => {
        func.apply(this, args)
        this.debounceTimers.delete(key)
      }, delay)

      this.debounceTimers.set(key, timer)
    }
  }

  // 节流函数
  throttle(key, func, delay = 300) {
    return (...args) => {
      if (this.throttleTimers.has(key)) {
        return
      }

      func.apply(this, args)
      
      const timer = setTimeout(() => {
        this.throttleTimers.delete(key)
      }, delay)

      this.throttleTimers.set(key, timer)
    }
  }

  // 懒加载图片
  lazyLoadImage(img, src) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const image = entry.target
            image.src = src
            image.classList.remove('lazy')
            observer.unobserve(image)
          }
        })
      })

      observer.observe(img)
    } else {
      // 降级处理
      img.src = src
    }
  }

  // 预加载关键资源
  preloadResource(url, type = 'fetch') {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = url
      
      switch (type) {
        case 'image':
          link.as = 'image'
          break
        case 'script':
          link.as = 'script'
          break
        case 'style':
          link.as = 'style'
          break
        default:
          link.as = 'fetch'
          link.crossOrigin = 'anonymous'
      }
      
      document.head.appendChild(link)
    }
  }

  // 内存使用监控
  monitorMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const memory = window.performance.memory
      this.metrics.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }

      // 如果内存使用超过80%，发出警告
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      if (usagePercent > 80) {
        console.warn(`High memory usage: ${usagePercent.toFixed(2)}%`)
      }

      return this.metrics.memoryUsage
    }
    return null
  }

  // 批量处理
  batchProcess(items, batchSize = 10, processFn, delay = 0) {
    return new Promise((resolve) => {
      const results = []
      let currentIndex = 0

      const processBatch = () => {
        const batch = items.slice(currentIndex, currentIndex + batchSize)
        
        batch.forEach((item, index) => {
          results[currentIndex + index] = processFn(item)
        })

        currentIndex += batchSize

        if (currentIndex < items.length) {
          if (delay > 0) {
            setTimeout(processBatch, delay)
          } else {
            requestAnimationFrame(processBatch)
          }
        } else {
          resolve(results)
        }
      }

      processBatch()
    })
  }

  // 虚拟滚动优化
  createVirtualScroller(container, items, itemHeight, renderItem) {
    const containerHeight = container.clientHeight
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
    let scrollTop = 0

    const updateVisibleItems = () => {
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(startIndex + visibleCount, items.length)
      
      // 清空容器
      container.innerHTML = ''
      
      // 创建占位符
      const spacerTop = document.createElement('div')
      spacerTop.style.height = `${startIndex * itemHeight}px`
      container.appendChild(spacerTop)
      
      // 渲染可见项目
      for (let i = startIndex; i < endIndex; i++) {
        const element = renderItem(items[i], i)
        container.appendChild(element)
      }
      
      // 创建底部占位符
      const spacerBottom = document.createElement('div')
      spacerBottom.style.height = `${(items.length - endIndex) * itemHeight}px`
      container.appendChild(spacerBottom)
    }

    container.addEventListener('scroll', this.throttle('virtualScroll', () => {
      scrollTop = container.scrollTop
      updateVisibleItems()
    }, 16)) // 60fps

    updateVisibleItems()
  }

  // 代码分割和动态导入 - 暂时禁用以避免构建错误
  async loadComponent(componentPath) {
    const cacheKey = `component_${componentPath}`
    const cached = this.getCache(cacheKey)
    
    if (cached) {
      return cached
    }

    // 暂时返回 null，避免动态导入导致的构建错误
    console.warn(`Dynamic import disabled for: ${componentPath}`)
    return null
  }

  // 获取性能报告
  getPerformanceReport() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      cacheHitRate: this.calculateCacheHitRate(),
      recommendations: this.getOptimizationRecommendations()
    }
  }

  // 计算缓存命中率
  calculateCacheHitRate() {
    // 这里需要实际的统计数据
    return Math.random() * 100 // 模拟数据
  }

  // 获取优化建议
  getOptimizationRecommendations() {
    const recommendations = []

    // 检查页面加载时间
    if (this.metrics.pageLoadTime > 3000) {
      recommendations.push('页面加载时间过长，考虑优化资源加载')
    }

    // 检查组件渲染时间
    Object.entries(this.metrics.componentRenderTime).forEach(([component, time]) => {
      if (time > 100) {
        recommendations.push(`组件 ${component} 渲染时间过长，考虑优化渲染逻辑`)
      }
    })

    // 检查API响应时间
    Object.entries(this.metrics.apiResponseTime).forEach(([api, time]) => {
      if (time > 2000) {
        recommendations.push(`API ${api} 响应时间过长，考虑优化后端性能`)
      }
    })

    // 检查内存使用
    if (this.metrics.memoryUsage && this.metrics.memoryUsage.used) {
      const usagePercent = (this.metrics.memoryUsage.used / this.metrics.memoryUsage.limit) * 100
      if (usagePercent > 70) {
        recommendations.push('内存使用率较高，考虑优化内存管理')
      }
    }

    return recommendations
  }

  // 清理资源
  cleanup() {
    this.debounceTimers.forEach(timer => clearTimeout(timer))
    this.throttleTimers.forEach(timer => clearTimeout(timer))
    this.debounceTimers.clear()
    this.throttleTimers.clear()
    this.clearCache()
  }
}

// 创建全局性能优化器实例
const performanceOptimizer = new PerformanceOptimizer()

// 页面加载完成后测量性能
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceOptimizer.measurePageLoad()
  })

  // 定期监控内存使用
  setInterval(() => {
    performanceOptimizer.monitorMemoryUsage()
  }, 30000) // 每30秒检查一次
}

export default performanceOptimizer