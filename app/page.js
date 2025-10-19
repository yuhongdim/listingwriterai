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

    // 临时移除使用限制检查，确保测试能正常进行
    // if (!usageTracker.canUse()) {
    //   const resetTime = usageTracker.formatTimeUntilReset()
    //   alert(`您已达到今日免费使用限制（3次），${resetTime}`)
    //   return
    // }

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
        throw new Error(`生成失败: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data) // 添加调试日志
      
      if (data.content) {
        setGeneratedContent(data.content)
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
      } else {
        throw new Error('API返回的内容为空')
      }
    } catch (error) {
      console.error('Generation Error:', error)
      alert(`生成失败：${error.message}`)
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Property Listing</h1>
        <p className="text-gray-600">Fill in property details and AI will generate professional listing descriptions</p>
        <div className="mt-4 text-sm text-gray-500">
          Free uses remaining: {usageCount}/3
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Property Information</h2>
          
          <div className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Property Type</option>
                <option value="Single Family Home">Single Family Home</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Duplex">Duplex</option>
                <option value="Commercial Property">Commercial Property</option>
                <option value="Land">Land</option>
              </select>
            </div>

            {/* Bedrooms, Bathrooms, Square Feet */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
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
                  Bathrooms *
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
                  Square Feet *
                </label>
                <input
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1200"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Downtown Los Angeles, CA"
              />
            </div>

            {/* Special Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Features
              </label>
              <textarea
                value={formData.specialFeatures}
                onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hardwood floors, granite countertops, walk-in closet, garage..."
              />
            </div>

            {/* Writing Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Writing Style
              </label>
              <div className="flex space-x-4">
                {[
                  { key: 'Professional', label: 'Professional' },
                  { key: 'Luxury', label: 'Luxury' },
                  { key: 'Modern', label: 'Modern' }
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
                  Daily uses remaining: <span className="font-semibold">{3 - usageCount}</span>/3
                </span>
                {usageCount >= 3 && (
                  <span className="text-blue-600 text-xs">
                    {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                  </span>
                )}
              </div>
              {usageCount >= 3 && (
                <div className="mt-1 text-xs text-blue-600">
                  Free quota exhausted, resets at midnight
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
                  <span>Generating...</span>
                </div>
              ) : usageCount >= 3 ? (
                'Daily free limit reached'
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Generate Listing</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Generated Content</h2>
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
                  <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
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
                  Generate New
                </button>
                <div className="flex-1 relative group">
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Export Content
                  </button>
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <button
                      onClick={() => handleExport('txt')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
                    >
                      Export as TXT
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      Export as PDF
                    </button>
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
                    >
                      Export as CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Fill in the property details on the left and click generate</p>
              <p className="text-sm mt-2">AI will create professional listing descriptions for you</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}