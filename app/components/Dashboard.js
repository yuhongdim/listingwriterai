'use client'

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
  Settings
} from 'lucide-react'

const Dashboard = ({ usageCount, setCurrentPage }) => {
  // 统计数据
  const stats = [
    {
      title: 'Listings Generated',
      value: '127',
      change: '+12%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Emails Sent',
      value: '2,340',
      change: '+8%',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Video Scripts',
      value: '45',
      change: '+23%',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Conversion Rate',
      value: '24.5%',
      change: '+5%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  // 核心功能模块
  const features = [
    {
      title: 'Smart Listing Generator',
      description: 'AI-powered property descriptions with 3 styles and SEO optimization',
      icon: FileText,
      action: 'create',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      badge: 'Most Popular'
    },
    {
      title: 'Email Marketing Hub',
      description: 'Bulk email campaigns with contact management and templates',
      icon: Mail,
      action: 'email',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      badge: 'High Demand'
    },
    {
      title: 'Video Script Studio',
      description: 'Professional video scripts for property showcases and tours',
      icon: Video,
      action: 'video',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      badge: 'Creative'
    },
    {
      title: 'Social Media Content',
      description: 'Multi-platform posts for Instagram, Facebook, and LinkedIn',
      icon: Globe,
      action: 'social',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      badge: 'New'
    }
  ]

  // 快速操作
  const quickActions = [
    { title: 'New Listing', icon: FileText, action: 'create' },
    { title: 'Send Email', icon: Mail, action: 'email' },
    { title: 'Create Video', icon: Video, action: 'video' },
    { title: 'Analytics', icon: BarChart3, action: 'analytics' }
  ]

  const benefits = [
    'Save 90% of copywriting time with AI automation',
    'Increase property inquiries by 300% with optimized content',
    'Professional marketing materials that enhance brand image',
    'Batch processing capabilities for maximum efficiency',
    'SEO-optimized content for better online visibility',
    'Multi-language support for diverse markets'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white border-b border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Real Estate Marketing Automation Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Let AI Create Real Estate Marketing Magic - Generate content 10x faster and automate distribution across multiple channels
            </p>
            
            {/* Usage Counter */}
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">
                Free uses {usageCount}/3 · No registration required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(action.action)}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <action.icon className="h-8 w-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Four Core Features to Meet All Your Marketing Needs
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From content creation to email marketing, from video scripts to social media management, a comprehensive solution for all your real estate marketing requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {feature.badge && (
                  <div className="absolute -top-3 left-6">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-semibold rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-8 w-8 ${feature.textColor}`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    
                    <button
                      onClick={() => setCurrentPage(feature.action)}
                      className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${feature.color} text-white font-medium rounded-lg hover:shadow-lg transition-all group-hover:scale-105`}
                    >
                      Try Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h3>
            <p className="text-gray-600">Join thousands of real estate professionals who trust our AI-powered marketing tools</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <Zap className="h-12 w-12 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">Ready to Elevate Your Real Estate Marketing?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of real estate agents using AI technology to make your property marketing more efficient and professional
          </p>
          <button
            onClick={() => setCurrentPage('create')}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-lg"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard