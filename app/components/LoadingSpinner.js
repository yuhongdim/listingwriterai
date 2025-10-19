'use client'

import { Loader2, Sparkles, Zap, RefreshCw } from 'lucide-react'

const LoadingSpinner = ({ 
  size = 'medium', 
  type = 'default', 
  message = '', 
  fullScreen = false,
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  }

  const getSpinnerIcon = () => {
    switch (type) {
      case 'sparkles':
        return <Sparkles className={`${sizeClasses[size]} animate-pulse text-purple-600`} />
      case 'zap':
        return <Zap className={`${sizeClasses[size]} animate-bounce text-yellow-500`} />
      case 'refresh':
        return <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
    }
  }

  const getLoadingDots = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  )

  const getPulseRings = () => (
    <div className="relative">
      <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping"></div>
      <div className="absolute inset-2 rounded-full border-4 border-blue-400 animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="relative w-8 h-8 bg-blue-600 rounded-full"></div>
    </div>
  )

  const getSpinnerContent = () => {
    if (type === 'dots') {
      return getLoadingDots()
    }
    if (type === 'pulse') {
      return getPulseRings()
    }
    return getSpinnerIcon()
  }

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center z-50'
    : 'flex items-center justify-center'

  const backgroundClasses = overlay || fullScreen
    ? 'bg-white bg-opacity-90 backdrop-blur-sm'
    : ''

  return (
    <div className={`${containerClasses} ${backgroundClasses}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* 主要加载动画 */}
        <div className="flex items-center justify-center">
          {getSpinnerContent()}
        </div>

        {/* 加载消息 */}
        {message && (
          <div className="text-center">
            <p className="text-gray-600 font-medium">{message}</p>
            {type === 'ai' && (
              <p className="text-sm text-gray-500 mt-1">
                AI正在为您生成内容...
              </p>
            )}
          </div>
        )}

        {/* 进度条（可选） */}
        {type === 'progress' && (
          <div className="w-64 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}

        {/* 特殊效果 */}
        {type === 'ai' && (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  )
}

// 预定义的加载状态组件
export const ContentGeneratingLoader = ({ message = "正在生成内容..." }) => (
  <LoadingSpinner 
    type="ai" 
    size="large" 
    message={message}
    fullScreen={true}
    overlay={true}
  />
)

export const ApiLoadingSpinner = ({ message = "处理中..." }) => (
  <LoadingSpinner 
    type="refresh" 
    size="medium" 
    message={message}
  />
)

export const PageLoadingSpinner = () => (
  <LoadingSpinner 
    type="pulse" 
    size="large" 
    message="加载中..."
    fullScreen={true}
    overlay={true}
  />
)

export const ButtonLoadingSpinner = ({ size = "small" }) => (
  <LoadingSpinner 
    type="default" 
    size={size}
  />
)

export const InlineLoadingDots = () => (
  <LoadingSpinner 
    type="dots" 
    size="small"
  />
)

export default LoadingSpinner