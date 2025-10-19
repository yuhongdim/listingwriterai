'use client'

import { useState } from 'react'
import { 
  Home, 
  PenTool, 
  Mail, 
  Video, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'

const Sidebar = ({ activeTab, setActiveTab, usageCount }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: '工作台', icon: Home },
    { id: 'create', label: '创建文案', icon: PenTool },
    { id: 'email', label: '邮件中心', icon: Mail },
    { id: 'video', label: '视频脚本', icon: Video },
    { id: 'analytics', label: '数据统计', icon: BarChart3 },
    { id: 'settings', label: '设置', icon: Settings },
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
            <p className="text-sm text-gray-500">Pro版本</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
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
              <span className="text-sm font-medium text-gray-700">今日剩余</span>
              <span className="text-xs text-gray-500">{3 - usageCount}/3</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(usageCount / 3) * 100}%` }}
              ></div>
            </div>
            {usageCount >= 3 ? (
              <div className="mt-2">
                <p className="text-xs text-red-500">已达到今日限制</p>
                <p className="text-xs text-gray-500">
                  {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                还可使用 {3 - usageCount} 次
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
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
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
            <p>房产营销自动化平台</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar