'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Mail, 
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Target,
  Globe,
  Camera,
  Settings,
  Plus,
  Clock,
  Star,
  Activity,
  PieChart,
  MessageSquare,
  Share2,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Home,
  Upload,
  Languages,
  Palette,
  Send,
  UserPlus,
  Database,
  TestTube,
  Image,
  Wand2,
  Layers,
  Maximize,
  Crown,
  AlertCircle
} from 'lucide-react'
import PricingModal from './PricingModal'

const Dashboard = ({ usageCount = 0, setCurrentPage, handleGenerate, isLoading, formData, handleInputChange }) => {
  const [activeTab, setActiveTab] = useState('listing-generator')
  const [listingStyle, setListingStyle] = useState('professional')
  const [listingLength, setListingLength] = useState('medium')
  const [listingLanguage, setListingLanguage] = useState('chinese')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free') // Simulate current plan
  
  // Simulate usage limits
  const planLimits = {
    free: { daily: 3, monthly: 90 },
    starter: { daily: 50, monthly: 1500 },
    pro: { daily: 200, monthly: 6000 },
    agency: { daily: -1, monthly: -1 } // -1 means unlimited
  }
  
  const currentLimit = planLimits[currentPlan]
  const dailyUsage = 2 // Simulate today's usage count
  const monthlyUsage = 45 // Simulate this month's usage count
  
  const isNearLimit = currentLimit.daily > 0 && dailyUsage >= currentLimit.daily * 0.8
  const isAtLimit = currentLimit.daily > 0 && dailyUsage >= currentLimit.daily

  // Workbench tabs configuration
  const workbenchTabs = [
    { 
      id: 'listing-generator', 
      label: 'Smart Property Listing Generator', 
      icon: FileText,
      description: '3 styles × 3 lengths, SEO optimized, multi-language support'
    },
    { 
      id: 'email-marketing', 
      label: 'Bulk Email Marketing System', 
      icon: Mail,
      description: 'Contact management, CSV import, A/B testing optimization'
    },
    { 
      id: 'social-media', 
      label: 'Social Media Content Generator', 
      icon: Share2,
      description: 'Multi-platform one-click generation, video script creation'
    },
    { 
      id: 'ai-image', 
      label: 'AI Image Enhancement Suite', 
      icon: Camera,
      description: 'Virtual furniture staging, photo enhancement, panoramic generation'
    }
  ]

  // Listen for tab activation events from LandingPage
  useEffect(() => {
    const handleActivateTab = (event) => {
      if (event.detail === 'listing') {
        setActiveTab('listing-generator');
      }
    };

    window.addEventListener('activateTab', handleActivateTab);
    return () => {
      window.removeEventListener('activateTab', handleActivateTab);
    };
  }, []);

  // Statistics data
  const stats = [
    {
      title: 'Property Listings Generated',
      value: '1,247',
      change: '+23%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Emails Sent',
      value: '15,680',
      change: '+18%',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Social Media Content',
      value: '892',
      change: '+35%',
      icon: Share2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Images Processed',
      value: '456',
      change: '+42%',
      icon: Camera,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  // Property listing generator configuration
  const listingStyles = [
    { id: 'professional', name: 'Professional Style', description: 'Formal, authoritative, highlighting expertise' },
    { id: 'luxury', name: 'Luxury Style', description: 'High-end, refined, emphasizing quality' },
    { id: 'storytelling', name: 'Storytelling Style', description: 'Warm, vivid, emotional expression' }
  ]

  const listingLengths = [
    { id: 'short', name: 'Short Copy', description: 'Under 100 words, concise and clear' },
    { id: 'medium', name: 'Medium Copy', description: 'Around 200 words, detailed introduction' },
    { id: 'long', name: 'Long Copy', description: 'Over 300 words, comprehensive description' }
  ]

  const languages = [
    { id: 'chinese', name: 'Chinese', flag: '🇨🇳' },
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'spanish', name: 'Español', flag: '🇪🇸' }
  ]

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'listing-generator':
        return (
          <div className="space-y-8">
            {/* Property Information Input */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Home className="h-5 w-5 mr-2 text-blue-600" />
                Property Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData?.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Luxury 3BR in CBD Core Area"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData?.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Downtown Financial District"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Size</label>
                  <input
                    type="text"
                    name="squareFeet"
                    value={formData?.squareFeet || ''}
                    onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                    placeholder="e.g., 1,200 sq ft"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <input
                    type="text"
                    name="propertyType"
                    value={formData?.propertyType || ''}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                    placeholder="e.g., 3BR/2BA Condo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Features</label>
                  <textarea
                    rows="3"
                    name="specialFeatures"
                    value={formData?.specialFeatures || ''}
                    onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                    placeholder="e.g., Panoramic views, modern finishes, near transit, top schools"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Copy Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-purple-600" />
                  Copy Style
                </h4>
                <div className="space-y-3">
                  {listingStyles.map((style) => (
                    <label key={style.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="style"
                        value={style.id}
                        checked={listingStyle === style.id}
                        onChange={(e) => setListingStyle(e.target.value)}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{style.name}</div>
                        <div className="text-sm text-gray-500">{style.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Copy Length */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-600" />
                  Copy Length
                </h4>
                <div className="space-y-3">
                  {listingLengths.map((length) => (
                    <label key={length.id} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="length"
                        value={length.id}
                        checked={listingLength === length.id}
                        onChange={(e) => setListingLength(e.target.value)}
                        className="mt-1 text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{length.name}</div>
                        <div className="text-sm text-gray-500">{length.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Languages className="h-4 w-4 mr-2 text-orange-600" />
                  Output Language
                </h4>
                <div className="space-y-3">
                  {languages.map((lang) => (
                    <label key={lang.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="language"
                        value={lang.id}
                        checked={listingLanguage === lang.id}
                        onChange={(e) => setListingLanguage(e.target.value)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium text-gray-900">{lang.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">Smart Property Listing Generator</h4>
                  <p className="text-sm text-gray-500 mt-1">AI will generate professional property descriptions based on your settings</p>
                </div>
                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {isLoading ? 'Generating...' : 'Generate Copy'}
                </button>
              </div>
            </div>

            {/* SEO Optimization Options */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-4 w-4 mr-2 text-red-600" />
                SEO Optimization Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">Auto-add local keywords</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">Sentiment analysis optimization</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">FHA compliance check</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Include trending keywords</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 'email-marketing':
        return (
          <div className="space-y-8">
            {/* Contact Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Database className="h-5 w-5 mr-2 text-green-600" />
                Contact Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">CSV Bulk Import</h4>
                  <p className="text-sm text-gray-500">Supports Excel and CSV file formats</p>
                </div>
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                  <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Add Contacts Manually</h4>
                  <p className="text-sm text-gray-500">Add client information one by one</p>
                </div>
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <Filter className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Smart Grouping</h4>
                  <p className="text-sm text-gray-500">Buyer/Seller/Investor tags</p>
                </div>
              </div>
            </div>

            {/* Email Template Generation */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Email Template Generation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Type</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Cold Outreach</option>
                    <option>Follow-up Email</option>
                    <option>Property Recommendation</option>
                    <option>Market Report</option>
                    <option>Holiday Greetings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Potential Buyers</option>
                    <option>Potential Sellers</option>
                    <option>Investment Clients</option>
                    <option>Existing Clients</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personalized Information</label>
                  <textarea
                    rows="3"
                    placeholder="Enter personalized content you want to include..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all">
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Email Template
                </button>
              </div>
            </div>

            {/* A/B Testing */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TestTube className="h-5 w-5 mr-2 text-purple-600" />
                A/B Testing Optimization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Version A - Direct Approach</h4>
                  <p className="text-sm text-gray-600 mb-3">Subject: Your Dream Home Awaits</p>
                  <div className="text-xs text-gray-500">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">Open Rate: 24%</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">Click Rate: 8%</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Version B - Emotional Approach</h4>
                  <p className="text-sm text-gray-600 mb-3">Subject: Find Your Perfect Haven</p>
                  <div className="text-xs text-gray-500">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">Open Rate: 31%</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">Click Rate: 12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'social-media':
        return (
          <div className="space-y-8">
            {/* 平台选择 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-pink-600" />
                Multi-Platform Content Generation
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'WeChat Moments', icon: '💬', color: 'bg-green-100 text-green-800' },
                  { name: 'TikTok', icon: '🎵', color: 'bg-black text-white' },
                  { name: 'Xiaohongshu', icon: '📖', color: 'bg-red-100 text-red-800' },
                  { name: 'Instagram', icon: '📷', color: 'bg-pink-100 text-pink-800' }
                ].map((platform, index) => (
                  <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-2xl mr-2">{platform.icon}</span>
                    <span className="font-medium text-gray-900">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 内容类型 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Layers className="h-5 w-5 mr-2 text-blue-600" />
                Content Type Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Property Listing Copy</h4>
                  <p className="text-sm text-gray-500">Professional property descriptions and selling points</p>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <Video className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Video Scripts</h4>
                  <p className="text-sm text-gray-500">Short video shooting scripts and narration</p>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <MessageSquare className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Interactive Content</h4>
                  <p className="text-sm text-gray-500">Q&A, polls, and topic discussions</p>
                </div>
              </div>
            </div>

            {/* Video Script Generator */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Video className="h-5 w-5 mr-2 text-red-600" />
                Video Script Generator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Video Duration</label>
                   <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                     <option>15 seconds (TikTok/Shorts)</option>
                     <option>30 seconds (Social Media)</option>
                     <option>60 seconds (Xiaohongshu)</option>
                     <option>3 minutes (Detailed Tour)</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Video Style</label>
                   <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                     <option>Professional Introduction</option>
                     <option>Lifestyle Showcase</option>
                     <option>Story Narrative</option>
                     <option>Comparison Analysis</option>
                   </select>
                 </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all">
                   <Video className="h-5 w-5 mr-2" />
                   Generate Video Script
                 </button>
              </div>
            </div>
          </div>
        )

      case 'ai-image':
        return (
          <div className="space-y-8">
            {/* Image Upload */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                Image Upload & Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">Upload Property Photos</h4>
                  <p className="text-sm text-gray-500">Supports JPG, PNG formats, max 10MB</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">Batch Processing</h4>
                  <p className="text-sm text-gray-500">Upload multiple images for batch processing</p>
                </div>
              </div>
            </div>

            {/* AI Enhancement Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-purple-600" />
                AI Image Enhancement Suite
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <Home className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Virtual Furniture Staging</h4>
                  <p className="text-sm text-gray-500 mb-3">Add virtual furniture to empty rooms</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Modern Style</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Traditional Style</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Luxury Style</span>
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <Sparkles className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Smart Photo Enhancement</h4>
                  <p className="text-sm text-gray-500 mb-3">Auto-adjust brightness and contrast</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Remove Clutter</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Sky Replacement</span>
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-orange-400 transition-colors cursor-pointer">
                  <Maximize className="h-8 w-8 text-orange-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">Panoramic Generation</h4>
                  <p className="text-sm text-gray-500 mb-3">Stitch multiple photos into 360° panorama</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Auto Stitch</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">VR Display</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                Processing Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Quality</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>High Quality (Print Ready)</option>
                    <option>Standard Quality (Web Ready)</option>
                    <option>Compressed Quality (Quick Share)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>JPG (Universal Format)</option>
                    <option>PNG (Transparent Background)</option>
                    <option>WebP (Web Optimized)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all">
                  <Camera className="h-5 w-5 mr-2" />
                  Start Processing
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Usage Limit Reminder Bar */}
      {(isNearLimit || isAtLimit) && (
        <div className={`${isAtLimit ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border-b px-4 py-3`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className={`w-5 h-5 mr-2 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={`text-sm font-medium ${isAtLimit ? 'text-red-800' : 'text-yellow-800'}`}>
                {isAtLimit 
                  ? `You have reached your daily usage limit (${dailyUsage}/${currentLimit.daily})` 
                  : `You have used ${dailyUsage}/${currentLimit.daily} times today, approaching the limit`
                }
              </span>
            </div>
            <button
              onClick={() => setShowPricingModal(true)}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Crown className="w-4 h-4 mr-1" />
              Upgrade Plan
            </button>
          </div>
        </div>
      )}

      {/* Workbench Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center cursor-pointer hover:text-purple-600 transition-colors" 
                  onClick={() => setCurrentPage('landing')}>
                🏠 Real Estate Marketing Automation Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Daily Usage:</span>
                <span className={`text-sm font-medium ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
                  {dailyUsage}/{currentLimit.daily > 0 ? currentLimit.daily : '∞'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Plan:</span>
                <span className="text-sm font-medium text-blue-600 capitalize">{currentPlan}</span>
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  Upgrade
                </button>
              </div>
              <button
                onClick={() => setCurrentPage('settings')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics data */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} monthly growth</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workbench tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {workbenchTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs text-gray-400 font-normal">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal 
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={currentPlan}
      />
    </div>
  )
}

export default Dashboard