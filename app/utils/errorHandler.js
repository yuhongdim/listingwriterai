// 错误处理工具类
class ErrorHandler {
  constructor() {
    this.errorLog = []
    this.maxLogSize = 100
  }

  // 记录错误
  logError(error, context = {}) {
    const errorEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context,
      type: this.getErrorType(error),
      severity: this.getErrorSeverity(error)
    }

    this.errorLog.unshift(errorEntry)
    
    // 保持日志大小限制
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize)
    }

    // 在开发环境中打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry)
    }

    return errorEntry
  }

  // 获取错误类型
  getErrorType(error) {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return 'network'
    }
    if (error.name === 'ValidationError') {
      return 'validation'
    }
    if (error.name === 'AuthenticationError') {
      return 'auth'
    }
    if (error.message.includes('API')) {
      return 'api'
    }
    return 'general'
  }

  // 获取错误严重程度
  getErrorSeverity(error) {
    const criticalKeywords = ['crash', 'fatal', 'critical', 'security']
    const warningKeywords = ['deprecated', 'warning', 'timeout']
    
    const message = (error.message || '').toLowerCase()
    
    if (criticalKeywords.some(keyword => message.includes(keyword))) {
      return 'critical'
    }
    if (warningKeywords.some(keyword => message.includes(keyword))) {
      return 'warning'
    }
    return 'error'
  }

  // 获取用户友好的错误消息
  getUserFriendlyMessage(error) {
    const errorType = this.getErrorType(error)
    
    const messages = {
      network: '网络连接出现问题，请检查您的网络连接后重试。',
      validation: '输入的信息有误，请检查并重新填写。',
      auth: '身份验证失败，请重新登录。',
      api: '服务暂时不可用，请稍后重试。',
      general: '出现了一个意外错误，请刷新页面后重试。'
    }

    return messages[errorType] || messages.general
  }

  // 处理API错误
  handleApiError(error, showToast = true) {
    const errorEntry = this.logError(error, { source: 'api' })
    const userMessage = this.getUserFriendlyMessage(error)
    
    if (showToast) {
      this.showErrorToast(userMessage)
    }
    
    return {
      error: errorEntry,
      userMessage,
      shouldRetry: this.shouldRetry(error)
    }
  }

  // 处理表单验证错误
  handleValidationError(errors, fieldName = null) {
    const errorMessages = []
    
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        errorMessages.push(error.message || error)
      })
    } else if (typeof errors === 'object') {
      Object.keys(errors).forEach(key => {
        errorMessages.push(`${key}: ${errors[key]}`)
      })
    } else {
      errorMessages.push(errors)
    }
    
    return {
      isValid: false,
      errors: errorMessages,
      fieldName
    }
  }

  // 判断是否应该重试
  shouldRetry(error) {
    const retryableErrors = ['network', 'timeout', 'server']
    const errorType = this.getErrorType(error)
    return retryableErrors.includes(errorType)
  }

  // 显示错误提示
  showErrorToast(message, duration = 5000) {
    // 创建toast元素
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm'
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `
    
    document.body.appendChild(toast)
    
    // 自动移除toast
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, duration)
  }

  // 显示成功提示
  showSuccessToast(message, duration = 3000) {
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm'
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, duration)
  }

  // 显示警告提示
  showWarningToast(message, duration = 4000) {
    const toast = document.createElement('div')
    toast.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm'
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, duration)
  }

  // 获取错误统计
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      bySeverity: {},
      recent: this.errorLog.slice(0, 10)
    }

    this.errorLog.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1
    })

    return stats
  }

  // 清除错误日志
  clearErrorLog() {
    this.errorLog = []
  }

  // 导出错误日志
  exportErrorLog() {
    const data = {
      timestamp: new Date().toISOString(),
      errors: this.errorLog,
      stats: this.getErrorStats()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `error-log-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  }
}

// 创建全局错误处理器实例
const errorHandler = new ErrorHandler()

// 全局错误监听
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorHandler.logError(event.error, {
      source: 'global',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.logError(event.reason, {
      source: 'promise',
      type: 'unhandled_rejection'
    })
  })
}

export default errorHandler