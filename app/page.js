'use client'

import { useState, useEffect } from 'react'
import { 
  Home, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Zap, 
  Check, 
  ChevronRight,
  Star,
  Copy,
  CheckCircle
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import EmailCenter from './components/EmailCenter'
import VideoScript from './components/VideoScript'
import usageTracker from './utils/usageTracker'

export default function ListingWriterAI() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    location: '',
    specialFeatures: '',
    writingStyle: 'Professional'
  })
  const [generatedContent, setGeneratedContent] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // 使用 useEffect 初始化使用计数
  useEffect(() => {
    setUsageCount(usageTracker.getCurrentCount())
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const required = ['propertyType', 'bedrooms', 'bathrooms', 'squareFeet', 'location']
    return required.every(field => formData[field].trim() !== '')
  }

  const handleGenerate = async () => {
    if (!validateForm()) {
      alert('请填写所有必填字段')
      return
    }

    if (!usageTracker.canUse()) {
      const resetTime = usageTracker.formatTimeUntilReset()
      alert(`您已达到今日免费使用限制（3次），${resetTime}`)
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const data = await response.json()
      setGeneratedContent(data.content)
      const newCount = usageTracker.incrementUsage()
      setUsageCount(newCount)
    } catch (error) {
      alert('生成失败，请重试')
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      alert('复制失败')
    }
  }

  const handleExport = async (format) => {
    if (!generatedContent) return

    try {
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generatedContent,
          format: format,
          type: 'listing',
          filename: `房产文案_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          // 对于PDF，创建一个新窗口显示HTML内容，用户可以打印为PDF
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          // 对于TXT和CSV，直接下载
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        alert('导出失败：' + data.error)
      }
    } catch (error) {
      console.error('导出错误:', error)
      alert('导出失败，请重试')
    }
  }

  const resetForm = () => {
    setFormData({
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      location: '',
      specialFeatures: '',
      writingStyle: 'Professional'
    })
    setGeneratedContent('')
  }

  // 渲染当前页面内容
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard usageCount={usageCount} setCurrentPage={setCurrentPage} />
      case 'create':
        return (
          <CreateListing 
            formData={formData}
            handleInputChange={handleInputChange}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            validateForm={validateForm}
            generatedContent={generatedContent}
            handleCopy={handleCopy}
            copySuccess={copySuccess}
            resetForm={resetForm}
            usageCount={usageCount}
            handleExport={handleExport}
          />
        )
      case 'email':
        return <EmailCenter usageCount={usageCount} setUsageCount={setUsageCount} />
      case 'video':
        return <VideoScript usageCount={usageCount} setUsageCount={setUsageCount} />
      default:
        return <Dashboard usageCount={usageCount} setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        usageCount={usageCount}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      {/* 主内容区域 */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {renderCurrentPage()}
      </div>
    </div>
  )
}

// 创建房源文案组件
function CreateListing({ 
  formData, 
  handleInputChange, 
  handleGenerate, 
  isLoading, 
  validateForm, 
  generatedContent, 
  handleCopy, 
  copySuccess, 
  resetForm,
  usageCount,
  handleExport
}) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">创建房源文案</h1>
        <p className="text-gray-600">填写房产信息，AI将为您生成专业的房源描述</p>
        <div className="mt-4 text-sm text-gray-500">
          免费使用次数：{usageCount}/3
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 表单区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">房产信息</h2>
          
          <div className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房产类型 *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">选择房产类型</option>
                <option value="独栋别墅">独栋别墅</option>
                <option value="公寓">公寓</option>
                <option value="联排别墅">联排别墅</option>
                <option value="复式">复式</option>
                <option value="商业地产">商业地产</option>
                <option value="土地">土地</option>
              </select>
            </div>

            {/* Bedrooms, Bathrooms, Square Feet */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  卧室数 *
                </label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  卫生间数 *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  面积(㎡) *
                </label>
                <input
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="120"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                位置 *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：北京市朝阳区CBD"
              />
            </div>

            {/* Special Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                特色亮点
              </label>
              <textarea
                value={formData.specialFeatures}
                onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="精装修、南北通透、地铁口、学区房..."
              />
            </div>

            {/* Writing Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                文案风格
              </label>
              <div className="flex space-x-4">
                {[
                  { key: 'Professional', label: '专业' },
                  { key: 'Luxury', label: '豪华' },
                  { key: 'Modern', label: '现代' }
                ].map((style) => (
                  <button
                    key={style.key}
                    onClick={() => handleInputChange('writingStyle', style.key)}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                      formData.writingStyle === style.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Usage Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700">
                  今日剩余次数: <span className="font-semibold">{3 - usageCount}</span>/3
                </span>
                {usageCount >= 3 && (
                  <span className="text-blue-600 text-xs">
                    {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                  </span>
                )}
              </div>
              {usageCount >= 3 && (
                <div className="mt-1 text-xs text-blue-600">
                  免费额度已用完，明日0点自动重置
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !validateForm() || usageCount >= 3}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isLoading || !validateForm() || usageCount >= 3
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>生成中...</span>
                </div>
              ) : usageCount >= 3 ? (
                '已达到今日免费使用限制'
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>生成房源文案</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* 结果区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">生成结果</h2>
            {generatedContent && (
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  copySuccess
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {copySuccess ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span>{copySuccess ? '已复制!' : '复制'}</span>
                </div>
              </button>
            )}
          </div>
          
          {generatedContent ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {generatedContent}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  重新生成
                </button>
                <div className="flex-1 relative group">
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    导出文案
                  </button>
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <button
                      onClick={() => handleExport('txt')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
                    >
                      导出为 TXT
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      导出为 PDF
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
                    >
                      导出为 CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>填写左侧信息后，点击生成按钮</p>
              <p className="text-sm mt-2">AI将为您创建专业的房源描述</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}