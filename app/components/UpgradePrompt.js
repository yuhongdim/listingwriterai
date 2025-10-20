'use client'

import { useState } from 'react'
import { 
  Zap, 
  Crown, 
  Star, 
  Check, 
  X, 
  ArrowRight,
  Gift,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './AuthModal'

export default function UpgradePrompt({ onClose, onUpgrade }) {
  const { endTrialMode } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleUpgrade = async (plan) => {
    setIsLoading(true)
    try {
      // 显示认证模态框进行升级
      setShowAuthModal(true)
    } catch (error) {
      console.error('Upgrade error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    onClose()
    if (onUpgrade) {
      onUpgrade('pro')
    }
  }

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$9',
      period: '/month',
      description: 'Perfect for individuals',
      features: [
        '100 generations per month',
        'Basic template library',
        'Email support',
        'Export functionality'
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Professional Plan',
      price: '$19',
      period: '/month',
      description: 'Perfect for professionals',
      features: [
        '500 generations per month',
        'Advanced template library',
        'Priority support',
        'Batch export',
        'API access',
        'Custom templates'
      ],
      popular: true,
      color: 'purple'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: '$59',
      period: '/month',
      description: 'Perfect for team collaboration',
      features: [
        'Unlimited generations',
        'All templates',
        'Dedicated support',
        'Team collaboration',
        'Advanced API',
        'White-label customization',
        'Data analytics'
      ],
      popular: false,
      color: 'gold'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Crown className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            🎉 Free Trial Expired
          </h2>
          <p className="text-purple-100">
            Upgrade to a paid plan to unlock more powerful features
          </p>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                  plan.popular
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Upgrade Now
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">After upgrading, you will get:</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm">More generations</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Star className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm">Advanced template library</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Gift className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm">Priority customer support</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Crown className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm">Exclusive features</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>💳 Supports PayPal, Credit Cards | 🔒 Secure Encryption | 📞 24/7 Customer Support</p>
          </div>
        </div>
      </div>
      
      {/* Auth Modal for Upgrade */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false)
          handleAuthSuccess()
        }}
        upgradeMode={true}
      />
    </div>
  )
}