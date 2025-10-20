'use client'

import { useState } from 'react'
import { X, Mail, Sparkles, ArrowRight, Home, BarChart3, Zap, Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from './Toast'
import LoadingSpinner from './LoadingSpinner'

export default function AuthModal({ isOpen, onClose, upgradeMode = false }) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { login, endTrialMode } = useAuth()
  const { success, error } = useToast()

  const features = [
    { icon: Home, text: 'AI Real Estate Content Generation' },
    { icon: BarChart3, text: 'Data Analytics Reports' },
    { icon: Zap, text: 'Quick Content Creation' },
    { icon: Users, text: 'Team Collaboration Features' }
  ]

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrors({ email: 'Please enter your email address' })
      return
    }
    
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' })
      return
    }
    
    setErrors({})
    setIsLoading(true)
    
    try {
      // 模拟检查用户是否存在的过程
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟自动登录/注册
      const mockUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        isNewUser: Math.random() > 0.5 // 随机决定是新用户还是老用户
      }
      
      login(mockUser)
      
      // 如果是升级模式，结束试用模式
      if (upgradeMode) {
        endTrialMode()
        success('Upgrade Successful!', 'Welcome to the paid version')
      } else if (mockUser.isNewUser) {
        success('Welcome to ListingWriter AI!', 'Account created automatically')
      } else {
        success('Welcome back!', 'Login successful')
      }
      
      onClose()
    } catch (err) {
      error('Login failed', 'Please check your email format or try again later')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {upgradeMode ? 'Upgrade to Paid Plan' : 'Welcome to ListingWriter AI'}
            </h2>
            <p className="text-gray-600">
              {upgradeMode 
                ? 'Enter your email to complete upgrade and unlock all features' 
                : 'Sign in to start creating amazing real estate content'
              }
            </p>
          </div>
        </div>

        {/* Email Login Form */}
        <div className="p-6">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Please enter your email address"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <LoadingSpinner type="dots" size="sm" />
              ) : (
                <>
                  <span className="flex-1">Continue</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              We will automatically create an account or log you into your existing account
            </p>
          </div>
        </div>

        {/* Features */}
         <div className="px-6 pb-6">
           <div className="bg-gray-50 rounded-lg p-4">
             <h4 className="font-medium text-gray-900 mb-3 text-center">You will get:</h4>
             <div className="space-y-2">
               {features.map((feature, index) => (
                 <div key={index} className="flex items-center space-x-3">
                   <div className="bg-blue-100 p-1.5 rounded-lg">
                     <feature.icon className="h-4 w-4 text-blue-600" />
                   </div>
                   <span className="text-sm text-gray-700">{feature.text}</span>
                 </div>
               ))}
             </div>
           </div>
         </div>

         {/* Footer */}
         <div className="px-6 pb-6 text-center">
           <p className="text-xs text-gray-500">
             By continuing, you agree to our{' '}
             <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
             {' '}and{' '}
             <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
           </p>
         </div>
       </div>
     </div>
   )
}