// Error handling utility class
class ErrorHandler {
  constructor() {
    this.errorLog = []
    this.maxLogSize = 100
  }

  // Log error
  logError(error, context = {}) {
    const errorEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      message: error.message || error,
      stack: error.stack,
      context,
      type: this.getErrorType(error),
      severity: this.getErrorSeverity(error)
    }

    this.errorLog.unshift(errorEntry)
    
    // Keep log size limit
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize)
    }

    // Print error in development environment
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorEntry)
    }

    return errorEntry.id
  }

  // Get error type
  getErrorType(error) {
    if (error.name) {
      switch (error.name) {
        case 'TypeError':
          return 'type_error'
        case 'ReferenceError':
          return 'reference_error'
        case 'SyntaxError':
          return 'syntax_error'
        case 'NetworkError':
          return 'network_error'
        default:
          return 'unknown_error'
      }
    }
    return 'unknown_error'
  }

  // Get error severity
  getErrorSeverity(error) {
    const criticalErrors = ['ReferenceError', 'SyntaxError']
    const warningErrors = ['TypeError', 'NetworkError']
    
    if (criticalErrors.includes(error.name)) {
      return 'critical'
    } else if (warningErrors.includes(error.name)) {
      return 'warning'
    } else if (error.message && error.message.includes('API')) {
      return 'warning'
    } else {
      return 'info'
    }
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error) {
    const errorType = this.getErrorType(error)
    
    const messages = {
      network_error: 'Network connection issue, please check your internet connection',
      type_error: 'Data processing error, please try again',
      reference_error: 'System error, please refresh the page',
      syntax_error: 'Configuration error, please contact support',
      unknown_error: 'Unknown error occurred, please try again'
    }

    return messages[errorType] || messages.unknown_error
  }

  // Handle API errors
  handleApiError(error, endpoint = '') {
    const context = { endpoint, type: 'api_error' }
    const errorId = this.logError(error, context)
    
    if (error.status) {
      switch (error.status) {
        case 400:
          return { message: 'Request parameter error', code: 400, errorId }
        case 401:
          return { message: 'Authentication failed, please log in again', code: 401, errorId }
        case 403:
          return { message: 'Access denied', code: 403, errorId }
        case 404:
          return { message: 'Resource not found', code: 404, errorId }
        case 500:
          return { message: 'Server error, please try again later', code: 500, errorId }
        default:
          return { message: this.getUserFriendlyMessage(error), code: error.status, errorId }
      }
    }
    
    return { message: this.getUserFriendlyMessage(error), code: 'unknown', errorId }
  }

  // Handle form validation errors
  handleValidationError(errors) {
    const validationErrors = {}
    
    if (Array.isArray(errors)) {
      errors.forEach(error => {
        if (error.field) {
          validationErrors[error.field] = error.message
        }
      })
    } else if (typeof errors === 'object') {
      Object.keys(errors).forEach(field => {
        validationErrors[field] = errors[field]
      })
    }
    
    const context = { type: 'validation_error', fields: Object.keys(validationErrors) }
    this.logError(new Error('Form validation failed'), context)
    
    return validationErrors
  }

  // Check if should retry
  shouldRetry(error, retryCount = 0) {
    const maxRetries = 3
    const retryableErrors = ['NetworkError', 'TimeoutError']
    
    return retryCount < maxRetries && retryableErrors.includes(error.name)
  }

  // Show error notification
  showErrorToast(message, duration = 5000) {
    // Create toast element
    const toast = document.createElement('div')
    toast.className = 'error-toast'
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f56565;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      font-size: 14px;
      line-height: 1.4;
    `
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    // Auto remove toast
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, duration)
  }

  // Show success notification
  showSuccessToast(message, duration = 3000) {
    const toast = document.createElement('div')
    toast.className = 'success-toast'
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #48bb78;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      font-size: 14px;
      line-height: 1.4;
    `
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, duration)
  }

  // Show warning notification
  showWarningToast(message, duration = 4000) {
    const toast = document.createElement('div')
    toast.className = 'warning-toast'
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ed8936;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      font-size: 14px;
      line-height: 1.4;
    `
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, duration)
  }

  // Get error statistics
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

  // Clear error log
  clearErrorLog() {
    this.errorLog = []
  }

  // Export error log
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
    a.download = `error-log-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    URL.revokeObjectURL(url)
  }
}

// Create global error handler instance
const errorHandler = new ErrorHandler()

// Global error listener
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