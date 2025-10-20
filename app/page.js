'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import LandingPage from './components/LandingPage'
import ToastWrapper from './components/ToastWrapper'
import AppContent from './components/AppContent'

export default function Home() {
  const [showApp, setShowApp] = useState(false)
  const [targetPage, setTargetPage] = useState('dashboard')
  const { isAuthenticated, isLoading, isTrialMode, startTrialMode } = useAuth()

  // 监听认证状态变化，自动跳转到应用
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setShowApp(true)
    }
  }, [isAuthenticated, isLoading])

  const handleSetCurrentPage = (page) => {
    // 启动试用模式并跳转到指定页面
    setTargetPage(page)
    startTrialMode()
    setShowApp(true)
  }

  const handleGetStarted = () => {
    // 启动试用模式
    startTrialMode()
    setShowApp(true)
  }

  const handleLogin = () => {
    setShowApp(true)
  }

  // 如果正在加载认证状态，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showApp || isAuthenticated || isTrialMode) {
    return (
      <ToastWrapper>
        <AppContent initialPage={targetPage} />
      </ToastWrapper>
    )
  }

  return (
    <LandingPage 
      onGetStarted={handleGetStarted}
      onLogin={handleLogin}
      setCurrentPage={handleSetCurrentPage}
    />
  )
}