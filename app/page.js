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
  CheckCircle,
  Target,
  Globe,
  FileText,
  Wand2
} from 'lucide-react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import EmailCenter from './components/EmailCenter'
import VideoScript from './components/VideoScript'
import SocialMediaGenerator from './components/SocialMediaGenerator'
import Pricing from './components/Pricing'
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
    writingStyle: 'Professional',
    contentLength: 'Medium',
    targetKeywords: '',
    priceRange: '',
    yearBuilt: ''
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
      alert('Please fill in all required fields')
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
        throw new Error(`Generation failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data) // 添加调试日志
      
      if (data.content) {
        setGeneratedContent(data.content)
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
      } else {
        throw new Error('API returned empty content')
      }
    } catch (error) {
      console.error('Generation Error:', error)
      alert(`Generation failed: ${error.message}`)
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
      case 'social':
        return <SocialMediaGenerator usageCount={usageCount} setUsageCount={setUsageCount} />
      case 'pricing':
        return <Pricing />
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
  const writingStyles = [
    {
      key: 'Professional',
      label: 'Professional',
      description: 'Clear, factual, and business-focused tone',
      icon: FileText,
      color: 'blue'
    },
    {
      key: 'Luxury',
      label: 'Luxury',
      description: 'Elegant, sophisticated, and premium language',
      icon: Star,
      color: 'purple'
    },
    {
      key: 'Storytelling',
      label: 'Storytelling',
      description: 'Emotional, narrative-driven descriptions',
      icon: Wand2,
      color: 'green'
    }
  ]

  const contentLengths = [
    { key: 'Short', label: 'Short (100 words)', description: 'Concise and to the point' },
    { key: 'Medium', label: 'Medium (200 words)', description: 'Balanced detail and brevity' },
    { key: 'Long', label: 'Long (300 words)', description: 'Comprehensive and detailed' }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Listing Generator</h1>
        <p className="text-gray-600">AI-powered property descriptions with multiple styles, lengths, and SEO optimization</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Target className="h-4 w-4 mr-1" />
            Free uses: {usageCount}/3
          </div>
          <div className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
            <Sparkles className="h-4 w-4 mr-1" />
            SEO Optimized
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Enhanced Form Section */}
        <div className="space-y-6">
          {/* Basic Property Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-600" />
              Property Information
            </h2>
            
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
                  <option value="Condo">Condo</option>
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
                  placeholder="e.g., Downtown Austin, TX"
                />
              </div>

              {/* Price Range and Year Built */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="$450,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Built
                  </label>
                  <input
                    type="number"
                    value={formData.yearBuilt}
                    onChange={(e) => handleInputChange('yearBuilt', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2020"
                  />
                </div>
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
                  placeholder="Hardwood floors, granite countertops, walk-in closet, garage, pool..."
                />
              </div>
            </div>
          </div>

          {/* Writing Style Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-purple-600" />
              Writing Style
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {writingStyles.map((style) => (
                <button
                  key={style.key}
                  onClick={() => handleInputChange('writingStyle', style.key)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.writingStyle === style.key
                      ? `border-${style.color}-500 bg-${style.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <style.icon className={`h-5 w-5 mt-0.5 ${
                      formData.writingStyle === style.key 
                        ? `text-${style.color}-600` 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{style.label}</div>
                      <div className="text-sm text-gray-600">{style.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Length Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-600" />
              Content Length
            </h3>
            <div className="space-y-3">
              {contentLengths.map((length) => (
                <button
                  key={length.key}
                  onClick={() => handleInputChange('contentLength', length.key)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    formData.contentLength === length.key
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{length.label}</div>
                  <div className="text-sm text-gray-600">{length.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* SEO Keywords */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-orange-600" />
              SEO Optimization
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Keywords (Optional)
              </label>
              <input
                type="text"
                value={formData.targetKeywords}
                onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., tech hub, outdoor lifestyle, family-friendly"
              />
              <p className="text-xs text-gray-500 mt-2">
                AI will automatically include local market keywords and optimize for search engines
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!validateForm() || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Smart Listing</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Generated Content</h2>
          
          {generatedContent ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-gray-900">
                      {formData.writingStyle} Style • {formData.contentLength} Length
                    </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {generatedContent}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Create New
                </button>
                <button
                  onClick={handleExport}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Export Content
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Fill in the property details and click "Generate Smart Listing" to create your content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}