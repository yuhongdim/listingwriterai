'use client';

import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import ToastWrapper from './ToastWrapper';

const LandingPage = ({ onGetStarted, onLogin, setCurrentPage }) => {
  const [showAuthModal, setShowAuthModal] = useState(false)

  // 监听openAuthModal事件
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setShowAuthModal(true)
    }

    window.addEventListener('openAuthModal', handleOpenAuthModal)
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage && setCurrentPage('dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
              Real Estate Marketing Automation Platform
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">Help</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLogin}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  AI Content Generator<br />
                  for Real Estate Professionals
                </h1>
              </div>

              <div className="space-y-4">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Your personal AI agent will generate property descriptions, listing headlines, emails, social posts, and more—in seconds.
                </p>
              </div>

              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-start items-start mb-8">
                  <button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={onGetStarted}
                  >
                    🚀 Start Free Trial
                  </button>
                  <button 
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    📖 Learn More
                  </button>
                </div>
                <div className="flex items-center justify-start gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Free Registration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Get Started Instantly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Dashboard Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-500">listingwriter.ai</div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">1,247</div>
                      <div className="text-sm text-gray-600">Listings Generated</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">89%</div>
                      <div className="text-sm text-gray-600">Time Saved</div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Recent Generations</h3>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Property Description</span>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">New</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Email Campaign</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Complete</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full w-full"></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Social Media Post</span>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Processing</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-purple-600 text-white p-3 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Generate Listing
                    </button>
                    <button className="bg-gray-100 text-gray-700 p-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      View Analytics
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-200 rounded-full opacity-40 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Features to Boost Your Real Estate Business
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From property descriptions to marketing emails, from social media to video scripts, our AI assistant provides comprehensive content creation support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Property Listings */}
            <div 
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => {
                setCurrentPage('dashboard');
                // 通过事件通知Dashboard激活房源文案生成器标签
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('activateTab', { detail: 'listing' }));
                }, 100);
              }}
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Smart Property Descriptions</h3>
              <p className="text-gray-600 mb-4">
                Enter basic property information and AI automatically generates professional, engaging property descriptions that highlight key features and boost client interest
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-4">
                <li>• Multiple style template options</li>
                <li>• Automatic keyword optimization</li>
                <li>• Support for multiple languages</li>
              </ul>
              <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                <span>Try Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 2 - Email Marketing */}
            <div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentPage('email')}
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Email Marketing Center</h3>
              <p className="text-gray-600 mb-4">
                Create personalized email templates, send bulk marketing emails, track email performance, and improve client conversion rates
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-4">
                <li>• Personalized email templates</li>
                <li>• Bulk sending functionality</li>
                <li>• Email performance tracking</li>
              </ul>
              <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                <span>Try Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 3 - Social Media */}
            <div 
              className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentPage('social')}
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 9v6m6-6v6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Social Media Content</h3>
              <p className="text-gray-600 mb-4">
                Generate platform-specific content for different social media platforms including Facebook, Instagram, WeChat Moments, and more
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-4">
                <li>• Multi-platform optimization</li>
                <li>• Rich media content</li>
                <li>• Hashtag optimization</li>
              </ul>
              <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                <span>Try Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 4 - Video Scripts */}
            <div 
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentPage('video')}
            >
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">Video Script Generation</h3>
              <p className="text-gray-600 mb-4">
                Generate professional scripts for property showcase videos, client introduction videos, and more to enhance video marketing effectiveness
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-4">
                <li>• Multiple video types</li>
                <li>• Professional script structure</li>
                <li>• Duration control suggestions</li>
              </ul>
              <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                <span>Try Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 5 - Analytics */}
            <div 
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentPage('analytics')}
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">Data Analytics</h3>
              <p className="text-gray-600 mb-4">
                Detailed usage statistics and performance analysis to help you understand content performance and optimize marketing strategies
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-4">
                <li>• Usage statistics</li>
                <li>• Performance analysis reports</li>
                <li>• Trend predictions</li>
              </ul>
              <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                <span>Try Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Feature 6 - Team Collaboration */}
            <div 
              className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setCurrentPage('settings')}
            >
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-pink-600 transition-colors duration-300">Team Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Support team member collaboration, share templates and content, maintain brand consistency, and improve team efficiency
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-4">
                <li>• Team member management</li>
                <li>• Content sharing</li>
                <li>• Brand consistency</li>
              </ul>
              <div className="flex items-center text-pink-600 font-medium group-hover:text-pink-700">
                <span>Try Now</span>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your AI Marketing Journey in Three Steps
            </h2>
            <p className="text-xl text-gray-600">
              Simple to use, quick to get started, let AI become your marketing assistant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center group cursor-pointer" onClick={onGetStarted}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-700 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="absolute top-10 left-1/2 transform translate-x-8 hidden md:block">
                  <svg className="w-16 h-8 text-purple-300 group-hover:text-purple-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">Create Account</h3>
              <p className="text-gray-600 mb-4">
                Register for free, no credit card required, start using basic features immediately
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-300">
                  Register Now →
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center group cursor-pointer" onClick={onGetStarted}>
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-700 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="absolute top-10 left-1/2 transform translate-x-8 hidden md:block">
                  <svg className="w-16 h-8 text-blue-300 group-hover:text-blue-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">Enter Information</h3>
              <p className="text-gray-600 mb-4">
                Enter property information or marketing requirements, AI will generate professional content based on your input
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300">
                  Start Creating →
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center group cursor-pointer" onClick={() => {
              if (typeof window !== 'undefined') {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-700 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Get Results</h3>
              <p className="text-gray-600 mb-4">
                Get high-quality content in seconds, ready to use or further edit and optimize
              </p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-300">
                  View Features →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm">Trusted by real estate professionals worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">10,000+</div>
              <div className="text-sm text-gray-500">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">500K+</div>
              <div className="text-sm text-gray-500">Listings Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">95%</div>
              <div className="text-sm text-gray-500">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">24/7</div>
              <div className="text-sm text-gray-500">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Need Help?</h3>
            <p className="text-lg text-gray-600">
              If you encounter any issues while using our platform, feel free to contact us anytime
            </p>
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <a 
                href="mailto:yuhongdim@gmail.com" 
                className="text-lg font-semibold hover:text-purple-700 transition-colors"
              >
                yuhongdim@gmail.com
              </a>
            </div>
            <p className="text-sm text-gray-500">
              We will reply to your email within 24 hours
            </p>
          </div>
        </div>
      </div>

      <ToastWrapper>
        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            defaultMode="register"
          />
        )}
      </ToastWrapper>
    </div>
  );
};

export default LandingPage;