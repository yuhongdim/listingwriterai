'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Zap, 
  Clock, 
  MemoryStick, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  X,
  Minimize2,
  Maximize2,
  Settings
} from 'lucide-react'
import { usePerformance, useMemoryMonitor, useOptimizationTips } from '../hooks/usePerformance'
import performanceOptimizer from '../utils/performanceOptimizer'

const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState('metrics')
  
  const { metrics } = usePerformance('PerformanceMonitor')
  const memoryUsage = useMemoryMonitor(5000) // Update every 5 seconds
  const optimizationTips = useOptimizationTips()

  // 获取性能报告
  const [performanceReport, setPerformanceReport] = useState(null)

  useEffect(() => {
    const updateReport = () => {
      const report = performanceOptimizer.getPerformanceReport()
      setPerformanceReport(report)
    }

    updateReport()
    const interval = setInterval(updateReport, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // 格式化内存大小
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 获取性能等级
  const getPerformanceGrade = () => {
    if (!performanceReport) return { grade: 'N/A', color: 'gray' }
    
    const { pageLoadTime, recommendations } = performanceReport
    
    if (pageLoadTime < 1000 && recommendations.length === 0) {
      return { grade: 'A+', color: 'green' }
    } else if (pageLoadTime < 2000 && recommendations.length <= 2) {
      return { grade: 'A', color: 'green' }
    } else if (pageLoadTime < 3000 && recommendations.length <= 4) {
      return { grade: 'B', color: 'yellow' }
    } else if (pageLoadTime < 5000 && recommendations.length <= 6) {
      return { grade: 'C', color: 'orange' }
    } else {
      return { grade: 'D', color: 'red' }
    }
  }

  const performanceGrade = getPerformanceGrade()

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performance Monitor"
      >
        <Activity className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all ${
      isMinimized ? 'w-64 h-16' : 'w-96 h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            performanceGrade.color === 'green' ? 'bg-green-100 text-green-800' :
            performanceGrade.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
            performanceGrade.color === 'orange' ? 'bg-orange-100 text-orange-800' :
            performanceGrade.color === 'red' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {performanceGrade.grade}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { id: 'metrics', label: 'Metrics', icon: Activity },
              { id: 'memory', label: 'Memory', icon: MemoryStick },
              { id: 'tips', label: 'Tips', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 h-64 overflow-y-auto">
            {activeTab === 'metrics' && (
              <div className="space-y-4">
                {/* Page load time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Page Load Time</span>
                  </div>
                  <span className="text-sm font-medium">
                    {performanceReport?.pageLoadTime ? `${performanceReport.pageLoadTime.toFixed(0)}ms` : 'N/A'}
                  </span>
                </div>

                {/* Component render time */}
                {performanceReport?.componentRenderTime && Object.keys(performanceReport.componentRenderTime).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Component Render Time</h4>
                    <div className="space-y-1">
                      {Object.entries(performanceReport.componentRenderTime).map(([component, time]) => (
                        <div key={component} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{component}</span>
                          <span className={`font-medium ${time > 100 ? 'text-red-600' : 'text-green-600'}`}>
                            {time.toFixed(1)}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* API response time */}
                {performanceReport?.apiResponseTime && Object.keys(performanceReport.apiResponseTime).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">API Response Time</h4>
                    <div className="space-y-1">
                      {Object.entries(performanceReport.apiResponseTime).map(([api, time]) => (
                        <div key={api} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">{api}</span>
                          <span className={`font-medium ${time > 2000 ? 'text-red-600' : 'text-green-600'}`}>
                            {time.toFixed(0)}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cache statistics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Cache Size</span>
                  </div>
                  <span className="text-sm font-medium">
                    {performanceReport?.cacheSize || 0} items
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="space-y-4">
                {memoryUsage ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Used Memory</span>
                      <span className="text-sm font-medium">{formatBytes(memoryUsage.used)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Memory</span>
                      <span className="text-sm font-medium">{formatBytes(memoryUsage.total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Memory Limit</span>
                      <span className="text-sm font-medium">{formatBytes(memoryUsage.limit)}</span>
                    </div>
                    
                    {/* Memory usage rate */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Usage Rate</span>
                        <span className="text-sm font-medium">
                          {((memoryUsage.used / memoryUsage.limit) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (memoryUsage.used / memoryUsage.limit) * 100 > 80 ? 'bg-red-600' :
                            (memoryUsage.used / memoryUsage.limit) * 100 > 60 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${(memoryUsage.used / memoryUsage.limit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 text-sm">
                    Memory information unavailable
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tips' && (
              <div className="space-y-3">
                {optimizationTips.length > 0 ? (
                  optimizationTips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">{tip}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">Performance is good, no optimization suggestions</span>
                  </div>
                )}
                
                {/* General optimization suggestions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">General Optimization Tips</h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div>• Use image lazy loading to reduce initial load time</div>
                    <div>• Enable caching mechanisms to improve repeat visit speed</div>
                    <div>• Compress static resources to reduce transfer time</div>
                    <div>• Use CDN to accelerate resource loading</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PerformanceMonitor