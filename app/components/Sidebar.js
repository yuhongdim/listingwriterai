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
  CreditCard,
  User,
  LogIn,
  Crown
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'
import pricingTiers from '../utils/pricingTiers'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './AuthModal'
import UserProfile from './UserProfile'

const Sidebar = ({ currentPage, setCurrentPage, usageCount, collapsed, setCollapsed }) => {
  // 使用传入的collapsed状态而不是本地状态
  const isCollapsed = collapsed
  const { user, isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)

  // 获取当前用户层级信息
  const currentTier = pricingTiers.getCurrentTier()
  const dailyLimit = pricingTiers.getDailyLimit()
  const remainingCount = usageTracker.getRemainingCount()

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
            <p className="text-sm text-gray-500">
              {isAuthenticated ? user?.plan || 'Free' : 'Guest Mode'}
            </p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* User Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          {isAuthenticated ? (
            <button
              onClick={() => setShowUserProfile(true)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500 flex items-center">
                  {user?.plan === 'premium' && <Crown className="h-3 w-3 mr-1 text-purple-500" />}
                  {user?.plan || 'Free'}
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>Login/Register</span>
            </button>
          )}
        </div>
      )}

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

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <UserProfile 
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
        />
      )}
    </div>
  )
}

export default Sidebar