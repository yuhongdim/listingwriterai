'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Zap,
  Heart,
  Star,
  Gift
} from 'lucide-react'

const Toast = ({ 
  id,
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  action = null,
  persistent = false,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, persistent])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose && onClose(id)
    }, 300)
  }

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50 border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800',
        messageColor: 'text-green-700'
      },
      error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50 border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800',
        messageColor: 'text-red-700'
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50 border-yellow-200',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-800',
        messageColor: 'text-yellow-700'
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800',
        messageColor: 'text-blue-700'
      },
      premium: {
        icon: Star,
        bgColor: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-600',
        titleColor: 'text-purple-800',
        messageColor: 'text-purple-700'
      },
      achievement: {
        icon: Gift,
        bgColor: 'bg-pink-50 border-pink-200',
        iconColor: 'text-pink-600',
        titleColor: 'text-pink-800',
        messageColor: 'text-pink-700'
      }
    }

    return configs[type] || configs.info
  }

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }

    return positions[position] || positions['top-right']
  }

  const config = getToastConfig()
  const IconComponent = config.icon

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed z-50 max-w-sm w-full
        ${getPositionClasses()}
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 transform translate-x-full' : 'opacity-100 transform translate-x-0'}
      `}
    >
      <div className={`
        rounded-lg border shadow-lg p-4
        ${config.bgColor}
        backdrop-blur-sm
      `}>
        <div className="flex items-start">
          {/* 图标 */}
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          </div>

          {/* 内容 */}
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={`text-sm font-medium ${config.titleColor}`}>
                {title}
              </h3>
            )}
            {message && (
              <p className={`text-sm ${title ? 'mt-1' : ''} ${config.messageColor}`}>
                {message}
              </p>
            )}

            {/* 操作按钮 */}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`
                    text-sm font-medium underline
                    ${config.iconColor} hover:opacity-80
                    transition-opacity
                  `}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* 关闭按钮 */}
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className={`
                inline-flex rounded-md p-1.5
                ${config.iconColor} hover:opacity-80
                transition-opacity
              `}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 进度条 */}
        {!persistent && duration > 0 && (
          <div className="mt-3 w-full bg-white bg-opacity-30 rounded-full h-1">
            <div 
              className={`h-1 rounded-full ${config.iconColor.replace('text-', 'bg-')}`}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
}

// Toast容器组件
export const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  )
}

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (toastData) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      ...toastData
    }

    setToasts(prev => [...prev, toast])
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearAllToasts = () => {
    setToasts([])
  }

  // 便捷方法
  const success = (title, message, options = {}) => {
    return addToast({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title, message, options = {}) => {
    return addToast({
      type: 'error',
      title,
      message,
      persistent: true, // 错误消息默认持久显示
      ...options
    })
  }

  const warning = (title, message, options = {}) => {
    return addToast({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title, message, options = {}) => {
    return addToast({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const premium = (title, message, options = {}) => {
    return addToast({
      type: 'premium',
      title,
      message,
      ...options
    })
  }

  const achievement = (title, message, options = {}) => {
    return addToast({
      type: 'achievement',
      title,
      message,
      duration: 8000, // 成就消息显示更久
      ...options
    })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    premium,
    achievement
  }
}

// 预定义的Toast消息
export const showSuccessToast = (message) => {
  // 这里可以集成到全局状态管理中
  console.log('Success:', message)
}

export const showErrorToast = (message) => {
  console.log('Error:', message)
}

export const showWarningToast = (message) => {
  console.log('Warning:', message)
}

export const showInfoToast = (message) => {
  console.log('Info:', message)
}

export default Toast