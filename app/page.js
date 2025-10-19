'use client'

import { useState } from 'react'
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

export default function ListingWriterAI() {
  const [step, setStep] = useState('home')
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
      setStep('result')
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
    setStep('generator')
  }

  // 首页
  if (step === 'home') {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold gradient-text">ListingWriterAI</span>
          </div>
          <button className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            Sign In
          </button>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-8">
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800 font-medium">Trusted by 10,000+ Real Estate Agents</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Generate Perfect Listings{' '}
            <span className="gradient-text">in 60 Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered property descriptions that sell faster. Create professional, 
            compelling listings that attract buyers and close deals.
          </p>
          
          <button 
            onClick={() => setStep('generator')}
            className="gradient-button text-lg px-8 py-4 mb-4"
          >
            Try Free Now
          </button>
          
          <p className="text-sm text-gray-500">
            No credit card required • 3 free listings
          </p>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-lg card-hover">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">60s</div>
              <div className="text-gray-600">Average Generation Time</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-lg card-hover">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Active Agents</div>
            </div>
            <div className="text-center p-8 bg-white rounded-3xl shadow-lg card-hover">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">35%</div>
              <div className="text-gray-600">Faster Sales</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'AI trained on $2.1B+ in sold properties',
              'Multiple writing styles',
              'Fair Housing Act compliant',
              'Social media post generation',
              'Multi-language support',
              'Export to MLS, Zillow, Realtor.com',
              'SEO-optimized descriptions',
              'Mobile-friendly interface'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Free Trial</h3>
              <div className="text-4xl font-bold mb-4">$0</div>
              <div className="text-gray-600 mb-6">3 listings</div>
              <button className="w-full py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                Get Started
              </button>
            </div>
            <div className="p-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-3xl shadow-xl transform scale-105">
              <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                Recommended
              </div>
              <h3 className="text-2xl font-bold mb-4">Unlimited</h3>
              <div className="text-4xl font-bold mb-4">$29<span className="text-lg">/mo</span></div>
              <div className="text-blue-100 mb-6">Unlimited listings</div>
              <button className="w-full py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                Start Free Trial
              </button>
            </div>
            <div className="p-8 bg-white rounded-3xl shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold mb-4">Pay-As-You-Go</h3>
              <div className="text-4xl font-bold mb-4">$1<span className="text-lg">/each</span></div>
              <div className="text-gray-600 mb-6">Per listing</div>
              <button className="w-full py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white px-6 py-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Home className="h-6 w-6" />
              <span className="text-xl font-bold">ListingWriterAI</span>
            </div>
            <p className="text-gray-400">© 2024 ListingWriterAI. All rights reserved.</p>
          </div>
        </footer>
      </div>
    )
  }

  // 生成器页面
  if (step === 'generator') {
    return (
      <div className="min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Create Your Listing</h1>
            <p className="text-xl text-gray-600">
              Fill in the details below and let AI write the perfect description
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
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
                  <option value="">Select property type</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Multi-Family">Multi-Family</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              {/* Bedrooms, Bathrooms, Square Feet */}
              <div className="grid md:grid-cols-3 gap-4">
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
                    placeholder="2.5"
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
                    placeholder="2000"
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
                  placeholder="e.g., Austin, TX - Downtown"
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
                  placeholder="renovated kitchen, pool, hardwood floors, granite countertops..."
                />
              </div>

              {/* Writing Style */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Writing Style
                </label>
                <div className="flex space-x-4">
                  {['Professional', 'Luxury', 'Modern'].map((style) => (
                    <button
                      key={style}
                      onClick={() => handleInputChange('writingStyle', style)}
                      className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                        formData.writingStyle === style
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isLoading || !validateForm()}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  isLoading || !validateForm()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'gradient-button'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Listing Description</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <button
              onClick={() => setStep('home')}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 结果页面
  if (step === 'result') {
    return (
      <div className="min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">Generated Successfully</span>
            </div>
            <h1 className="text-4xl font-bold">Your Listing is Ready!</h1>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Generated Description</h2>
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
                  <span>{copySuccess ? 'Copied!' : 'Copy to Clipboard'}</span>
                </div>
              </button>
            </div>
            <div className="p-6">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {generatedContent}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-8">
            <button
              onClick={resetForm}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Generate Another
            </button>
            <button
              onClick={() => setStep('home')}
              className="flex-1 gradient-button"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }
}