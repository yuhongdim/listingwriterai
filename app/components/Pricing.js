'use client'

import { useState } from 'react'
import { Check, X, Star, Crown, Zap, Building } from 'lucide-react'
import pricingTiers from '../utils/pricingTiers'

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for individual users to try',
      features: [
        '3 daily AI generations',
        'Basic property descriptions',
        'Standard email templates',
        'Basic video scripts',
        'Social media content (limited)',
        'Basic export functionality'
      ],
      limitations: [
        'No client management',
        'No premium templates',
        'No bulk operations',
        'No priority support'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      color: 'gray'
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      price: { monthly: 9.9, yearly: 99 },
      description: 'Perfect for individual agents',
      features: [
        '100 daily AI generations',
        '500 emails per month',
        'Premium property description templates',
        'Personalized email marketing',
        'Professional video scripts',
        'Complete social media suite',
        'PDF/Word export',
        'Basic client management',
        'Email automation'
      ],
      limitations: [
        'No team collaboration',
        'No white-label features',
        'No API access'
      ],
      buttonText: 'Choose Starter',
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
        '500 daily AI generations',
        '5000 emails per month',
        'All premium templates',
        'Bulk content generation',
        'Advanced client management',
        'Team collaboration features',
        'Custom branding',
        'Priority customer support',
        'Analytics reports',
        'CRM system integration',
        'API access'
      ],
      limitations: [],
      buttonText: 'Choose Pro',
      popular: false,
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
        'Unlimited emails',
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
      limitations: [],
      buttonText: 'Contact Sales',
      popular: false,
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose the Perfect Plan for You
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            From individual users to large agencies, we provide perfect solutions for every business scale
          </p>
          
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
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-blue-500 scale-105' : getColorClasses(plan.color, 'border')
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${getColorClasses(plan.color, 'bg')}`}>
                      <IconComponent className={`w-6 h-6 ${getColorClasses(plan.color, 'text')}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price[billingCycle]}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-gray-500 ml-1">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Equivalent to ${Math.round(plan.price.yearly / 12)}/month
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Included Features:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start">
                            <X className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-500 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${getColorClasses(plan.color, 'button')}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades will take effect at the next billing cycle.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods are supported?</h3>
              <p className="text-gray-600 text-sm">
                We support various payment methods including credit cards, debit cards, PayPal, and other major payment processors.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                All paid plans include a 14-day free trial with no credit card required. You can choose to continue your subscription after the trial period.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">How do I get technical support?</h3>
              <p className="text-gray-600 text-sm">
                Pro and Agency users enjoy priority support through email, live chat, or phone assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing