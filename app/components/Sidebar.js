'use client'

import { useState } from 'react'
import { 
  Home, 
  PenTool, 
  Mail, 
  Video, 
  Globe,
  BarChart3, 
  Settings,
  Menu,
  X,
  CreditCard
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'
import pricingTiers from '../utils/pricingTiers'

const Sidebar = ({ currentPage, setCurrentPage, usageCount, collapsed, setCollapsed }) => {
  // 使用传入的collapsed状态而不是本地状态
  const isCollapsed = collapsed

  // 获取当前用户层级信息
  const currentTier = pricingTiers.getCurrentTierInfo()
  const dailyLimit = pricingTiers.getDailyLimit()
  const remainingCount = pricingTiers.getRemainingUsage(usageCount)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'create', label: 'Create Listing', icon: PenTool },
    { id: 'email', label: 'Email Center', icon: Mail },
    { id: 'video', label: 'Video Script', icon: Video },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold gradient-text">ListingWriterAI</h1>
            <p className="text-sm text-gray-500">{currentTier.name}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Usage Counter */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Remaining</span>
              <span className="text-xs text-gray-500">
                {dailyLimit === -1 ? '∞' : `${remainingCount}/${dailyLimit}`}
              </span>
            </div>
            {dailyLimit !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(usageCount / dailyLimit) * 100}%` }}
                ></div>
              </div>
            )}
            {dailyLimit === -1 ? (
              <p className="text-xs text-gray-500 mt-2">
                Unlimited usage
              </p>
            ) : usageCount >= dailyLimit ? (
              <div className="mt-2">
                <p className="text-xs text-red-500">Daily limit reached</p>
                <p className="text-xs text-gray-500">
                  {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                {remainingCount} uses remaining
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 ListingWriterAI</p>
            <p>Real Estate Marketing Platform</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar