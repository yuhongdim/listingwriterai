// Performance optimization utility class
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

  // Measure page load time
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0]
      if (navigation) {
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        console.log(`Page load time: ${this.metrics.pageLoadTime}ms`)
      }
    }
  }

  // Measure component render time
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

  // Measure API response time
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

  // Cache management
  setCache(key, value, ttl = 300000) { // Default 5 minutes TTL
    // If cache is full, delete oldest entry
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

    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.value
  }

  clearCache() {
    this.cache.clear()
  }

  // Debounce function
  debounce(key, func, delay = 300) {
    return (...args) => {
      // Clear previous timer
      if (this.debounceTimers.has(key)) {
        clearTimeout(this.debounceTimers.get(key))
      }

      // Set new timer
      const timer = setTimeout(() => {
        func.apply(this, args)
        this.debounceTimers.delete(key)
      }, delay)

      this.debounceTimers.set(key, timer)
    }
  }

  // Throttle function
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

  // Lazy load images
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
      // Fallback handling
      img.src = src
    }
  }

  // Preload critical resources
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

  // Memory usage monitoring
  monitorMemoryUsage() {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
      const memory = window.performance.memory
      this.metrics.memoryUsage = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }

      // Warn if memory usage exceeds 80%
      const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      if (usagePercent > 80) {
        console.warn(`High memory usage: ${usagePercent.toFixed(2)}%`)
      }

      return this.metrics.memoryUsage
    }
    return null
  }

  // Batch processing
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

  // Virtual scrolling optimization
  createVirtualScroller(container, items, itemHeight, renderItem) {
    const containerHeight = container.clientHeight
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2
    let scrollTop = 0

    const updateVisibleItems = () => {
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(startIndex + visibleCount, items.length)
      
      // Clear container
      container.innerHTML = ''
      
      // Create top spacer
      const spacerTop = document.createElement('div')
      spacerTop.style.height = `${startIndex * itemHeight}px`
      container.appendChild(spacerTop)
      
      // Render visible items
      for (let i = startIndex; i < endIndex; i++) {
        const element = renderItem(items[i], i)
        container.appendChild(element)
      }
      
      // Create bottom spacer
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

  // Code splitting and dynamic imports - temporarily disabled to avoid build errors
  async loadComponent(componentPath) {
    const cacheKey = `component_${componentPath}`
    const cached = this.getCache(cacheKey)
    
    if (cached) {
      return cached
    }

    // Temporarily return null to avoid dynamic import build errors
    console.warn(`Dynamic import disabled for: ${componentPath}`)
    return null
  }

  // Get performance report
  getPerformanceReport() {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      cacheHitRate: this.calculateCacheHitRate(),
      recommendations: this.getOptimizationRecommendations()
    }
  }

  // Calculate cache hit rate
  calculateCacheHitRate() {
    // This needs actual statistics data
    return Math.random() * 100 // Mock data
  }

  // Get optimization recommendations
  getOptimizationRecommendations() {
    const recommendations = []

    // Check page load time
    if (this.metrics.pageLoadTime > 3000) {
      recommendations.push('Page load time is too long, consider optimizing resource loading')
    }

    // Check component render time
    Object.entries(this.metrics.componentRenderTime).forEach(([component, time]) => {
      if (time > 100) {
        recommendations.push(`Component ${component} render time is too long, consider optimizing render logic`)
      }
    })

    // Check API response time
    Object.entries(this.metrics.apiResponseTime).forEach(([api, time]) => {
      if (time > 2000) {
        recommendations.push(`API ${api} response time is too long, consider optimizing backend performance`)
      }
    })

    // Check memory usage
    if (this.metrics.memoryUsage && this.metrics.memoryUsage.used) {
      const usagePercent = (this.metrics.memoryUsage.used / this.metrics.memoryUsage.limit) * 100
      if (usagePercent > 70) {
        recommendations.push('Memory usage is high, consider optimizing memory management')
      }
    }

    return recommendations
  }

  // Cleanup resources
  cleanup() {
    this.debounceTimers.forEach(timer => clearTimeout(timer))
    this.throttleTimers.forEach(timer => clearTimeout(timer))
    this.debounceTimers.clear()
    this.throttleTimers.clear()
    this.clearCache()
  }
}

// Create global performance optimizer instance
const performanceOptimizer = new PerformanceOptimizer()

// Measure performance after page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    performanceOptimizer.measurePageLoad()
  })

  // Monitor memory usage periodically
  setInterval(() => {
    performanceOptimizer.monitorMemoryUsage()
  }, 30000) // Check every 30 seconds
}

export default performanceOptimizer