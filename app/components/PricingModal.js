'use client'

import { useState } from 'react'
import { X, Check, Star, Crown, Zap, Building } from 'lucide-react'

const PricingModal = ({ isOpen, onClose, currentPlan = 'free' }) => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for individual users to try',
      features: [
        '3 AI generations per day',
        'Basic property descriptions',
        'Standard email templates',
        'Basic video scripts',
        'Social media content (limited)'
      ],
      buttonText: 'Current Plan',
      color: 'gray'
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      price: { monthly: 9.9, yearly: 99 },
      description: 'Perfect for individual agents',
      features: [
        '100 AI generations per day',
        '500 emails per month',
        'Advanced property description templates',
        'Personalized email marketing',
        'Professional video scripts',
        'Complete social media suite',
        'PDF/Word export',
        'Basic customer management',
        'Email automation'
      ],
      buttonText: 'Upgrade to Starter',
      popular: true,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: { monthly: 59, yearly: 590 },
      description: 'Perfect for professional teams',
      features: [
        '500 AI generations per day',
        '5000 emails per month',
        'All advanced templates',
        'Bulk content generation',
        'Advanced customer management',
        'Team collaboration features',
        'Custom branding',
        'Priority customer support',
        'Analytics reports',
        'CRM system integration',
        'API access'
      ],
      buttonText: 'Upgrade to Pro',
      color: 'purple'
    },
    {
      id: 'agency',
      name: 'Agency',
      icon: Building,
      price: { monthly: 199, yearly: 1990 },
      description: 'Perfect for large agencies',
      features: [
        'Unlimited AI generations',
        'Unlimited email sending',
        'White-label solution',
        'Unlimited team members',
        'Unlimited storage space',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom integrations',
        'Advanced analytics reports',
        'Multi-brand management',
        'Enterprise-grade security',
        'Training and onboarding support'
      ],
      buttonText: 'Contact Sales',
      color: 'gold'
    }
  ]

  const getColorClasses = (color, type = 'button') => {
    const colors = {
      gray: {
        button: 'bg-gray-600 hover:bg-gray-700 text-white',
        border: 'border-gray-200',
        text: 'text-gray-600',
        bg: 'bg-gray-50'
      },
      blue: {
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        border: 'border-blue-200',
        text: 'text-blue-600',
        bg: 'bg-blue-50'
      },
      purple: {
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        border: 'border-purple-200',
        text: 'text-purple-600',
        bg: 'bg-purple-50'
      },
      gold: {
        button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        border: 'border-yellow-200',
        text: 'text-yellow-600',
        bg: 'bg-yellow-50'
      }
    }
    return colors[color]?.[type] || colors.gray[type]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
            <p className="text-gray-600 mt-1">Unlock more powerful features and boost your marketing efficiency</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
               Monthly
             </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
               Yearly
             </span>
             {billingCycle === 'yearly' && (
               <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                 Save 17%
               </span>
             )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const IconComponent = plan.icon
              const isCurrent = plan.id === currentPlan
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-xl border-2 transition-all duration-300 ${
                    plan.popular && !isCurrent ? 'border-blue-500 shadow-lg' : 
                    isCurrent ? 'border-green-500 shadow-lg' : 
                    getColorClasses(plan.color, 'border')
                  }`}
                >
                  {plan.popular && !isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Recommended
                      </span>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Header */}
                    <div className="text-center mb-4">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${getColorClasses(plan.color, 'bg')}`}>
                        <IconComponent className={`w-5 h-5 ${getColorClasses(plan.color, 'text')}`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl font-bold text-gray-900">
                          ¥{plan.price[billingCycle] * 7}
                        </span>
                        {plan.price[billingCycle] > 0 && (
                          <span className="text-gray-500 ml-1 text-sm">
                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Equivalent to ¥{Math.round(plan.price.yearly * 7 / 12)}/month
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <ul className="space-y-2">
                        {plan.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-gray-500 text-sm ml-6">
                            +{plan.features.length - 5} more features...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors text-sm ${
                        isCurrent 
                          ? 'bg-green-100 text-green-700 cursor-default' 
                          : getColorClasses(plan.color, 'button')
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Current Plan' : plan.buttonText}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Benefits */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Upgrade Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">More Generations</h4>
                <p className="text-sm text-gray-600">Meet your high-frequency usage needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Advanced Features</h4>
                <p className="text-sm text-gray-600">Unlock all professional tools</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Priority Support</h4>
                <p className="text-sm text-gray-600">Professional team at your service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingModal