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
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import EmailCenter from './EmailCenter'
import VideoScript from './VideoScript'
import SocialMediaGenerator from './SocialMediaGenerator'
import BlogManager from './BlogManager'
import BlogPublic from './BlogPublic'
import Pricing from './Pricing'
import LandingPage from './LandingPage'
import Analytics from './Analytics'
import UpgradePrompt from './UpgradePrompt'
import UserProfile from './UserProfile'
import Settings from './Settings'
import usageTracker from '../utils/usageTracker'
import { ToastContainer, useToast } from './Toast'
import errorHandler from '../utils/errorHandler'
import PerformanceMonitor from './PerformanceMonitor'
import { useAuth } from '../hooks/useAuth'
import DataManager from './DataManager'

export default function AppContent({ initialPage = 'dashboard' }) {
  // Auth hook
  const { 
    user, 
    isAuthenticated, 
    isTrialMode, 
    updateUsage, 
    getTrialUsage, 
    updateTrialUsage, 
    isTrialExpired 
  } = useAuth()
  
  // Toast hook - now can be used inside ToastProvider
  const { success, error, warning, info } = useToast()
  
  const [currentPage, setCurrentPage] = useState(initialPage || 'landing')
  
  // 添加调试信息的setCurrentPage函数
  const handleSetCurrentPage = (page) => {
    console.log(`页面跳转: ${currentPage} -> ${page}`)
    setCurrentPage(page)
  }
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
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
  const [showDataManager, setShowDataManager] = useState(false)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // Initialize usage count with useEffect
  useEffect(() => {
    if (isTrialMode) {
      setUsageCount(getTrialUsage())
    } else {
      setUsageCount(usageTracker.getCurrentCount())
    }
  }, [isTrialMode, getTrialUsage])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const required = ['title', 'propertyType', 'squareFeet', 'location']
    return required.every(field => formData[field] && formData[field].trim() !== '')
  }

  const handleGenerate = async () => {
    if (!validateForm()) {
      error('Please fill in all required fields')
      return
    }

    // Check if trial mode has expired
    if (isTrialMode && isTrialExpired()) {
      setShowUpgradePrompt(true)
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
        throw new Error(`Generation failed: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.content) {
        setGeneratedContent(data.content)
        
        // Update usage count
        if (isTrialMode) {
          const newTrialUsage = updateTrialUsage()
          setUsageCount(newTrialUsage)
          
          // Check if approaching limit
          if (newTrialUsage >= 2) { // Remind after 2nd use
            info('Trial Reminder', `You have ${3 - newTrialUsage} free uses remaining`)
          }
        } else {
          const newCount = usageTracker.incrementUsage()
          setUsageCount(newCount)
          
          // Update user usage (if logged in)
          if (isAuthenticated) {
            updateUsage()
          }
        }
        
        success('Content generated successfully!')
      } else {
        throw new Error('API returned empty content')
      }
    } catch (err) {
      console.error('Generation Error:', err)
      error(`Generation failed: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent)
      success('Content copied to clipboard')
    } catch (err) {
      error('Copy failed')
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
          filename: `property_listing_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          // For PDF, create a new window to display HTML content, user can print as PDF
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          // For TXT and CSV, download directly
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        error('Export failed: ' + data.error)
      }
    } catch (err) {
      console.error('Export error:', err)
      error('Export failed, please try again')
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
      case 'landing':
        return <LandingPage onGetStarted={() => handleSetCurrentPage('dashboard')} setCurrentPage={handleSetCurrentPage} />
      case 'dashboard':
        return (
          <Dashboard 
            usageCount={usageCount} 
            setCurrentPage={handleSetCurrentPage}
            handleGenerate={handleGenerate}
            isLoading={isLoading}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        )
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
            setShowDataManager={setShowDataManager}
          />
        )
      case 'email':
        return <EmailCenter usageCount={usageCount} setUsageCount={setUsageCount} />
      case 'video':
        return <VideoScript usageCount={usageCount} setUsageCount={setUsageCount} />
      case 'social':
        return <SocialMediaGenerator usageCount={usageCount} setUsageCount={setUsageCount} setCurrentPage={handleSetCurrentPage} />
      case 'blog':
        return <BlogManager usageCount={usageCount} setUsageCount={setUsageCount} />
      case 'blog-public':
        return <BlogPublic />
      case 'analytics':
        return <Analytics setCurrentPage={handleSetCurrentPage} />
      case 'pricing':
        return <Pricing />
      case 'profile':
        return <UserProfile isOpen={true} onClose={() => handleSetCurrentPage('dashboard')} />
      case 'settings':
        return <Settings />
      default:
        return <LandingPage onGetStarted={() => handleSetCurrentPage('dashboard')} setCurrentPage={handleSetCurrentPage} />
    }
  }

  return (
    <>
      <div className={currentPage === 'landing' ? '' : 'flex h-screen bg-gray-50'}>
        {/* 侧边栏 - 只在非Landing页面显示 */}
        {currentPage !== 'landing' && (
          <Sidebar 
            currentPage={currentPage}
            setCurrentPage={handleSetCurrentPage}
            usageCount={usageCount}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
        )}
        
        {/* 主内容区域 */}
        <div className={currentPage === 'landing' ? '' : `flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          {renderCurrentPage()}
        </div>
      </div>
      
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Performance Monitor */}
      <PerformanceMonitor />
      
      {/* Data Manager */}
      <DataManager 
        isOpen={showDataManager}
        onClose={() => setShowDataManager(false)}
        onContentSelect={(content) => {
          setGeneratedContent(content)
          setShowDataManager(false)
          success('Content loaded')
        }}
      />
      
      {/* Upgrade Prompt */}
      {showUpgradePrompt && (
        <UpgradePrompt
          onClose={() => setShowUpgradePrompt(false)}
          onUpgrade={(plan) => {
            setShowUpgradePrompt(false)
            setCurrentPage('pricing')
            success('升级成功', `欢迎使用${plan}版本！`)
          }}
        />
      )}
    </>
  )
}

// Create property listing component
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
  handleExport,
  setShowDataManager
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
                  onClick={() => setShowDataManager(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Data Management
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