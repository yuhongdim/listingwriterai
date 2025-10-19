'use client'

import { useState } from 'react'
import { Check, X, Star, Crown, Zap, Building } from 'lucide-react'

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: '免费版',
      icon: Star,
      price: { monthly: 0, yearly: 0 },
      description: '适合个人用户试用',
      features: [
        '每日3次AI生成',
        '基础房源描述',
        '标准邮件模板',
        '基础视频脚本',
        '社交媒体内容（限制）',
        '基础导出功能'
      ],
      limitations: [
        '无客户管理',
        '无高级模板',
        '无批量操作',
        '无优先支持'
      ],
      buttonText: '免费开始',
      popular: false,
      color: 'gray'
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      price: { monthly: 29, yearly: 290 },
      description: '适合个人经纪人',
      features: [
        '每日50次AI生成',
        '高级房源描述模板',
        '个性化邮件营销',
        '专业视频脚本',
        '完整社交媒体套件',
        'PDF/Word导出',
        '基础客户管理',
        '邮件自动化'
      ],
      limitations: [
        '无团队协作',
        '无白标功能',
        '无API访问'
      ],
      buttonText: '选择Starter',
      popular: true,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: { monthly: 79, yearly: 790 },
      description: 'Perfect for professional teams',
      features: [
        '200 daily AI generations',
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
      limitations: [
        'Team members limited to 5',
        '10GB storage space'
      ],
      buttonText: '选择Pro',
      popular: false,
      color: 'purple'
    },
    {
      id: 'agency',
      name: 'Agency',
      icon: Building,
      price: { monthly: 199, yearly: 1990 },
      description: '适合大型机构',
      features: [
        '无限AI生成',
        '白标解决方案',
        '无限团队成员',
        '无限存储空间',
        '专属客户经理',
        '24/7优先支持',
        '自定义集成',
        '高级分析报告',
        '多品牌管理',
        '企业级安全',
        '培训和入职支持'
      ],
      limitations: [],
      buttonText: '联系销售',
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
            选择适合您的方案
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            从个人用户到大型机构，我们为每个规模的业务提供完美解决方案
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              月付
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
              年付
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                节省17%
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
                      最受欢迎
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
                        ¥{plan.price[billingCycle]}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-gray-500 ml-1">
                          /{billingCycle === 'monthly' ? '月' : '年'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        相当于 ¥{Math.round(plan.price.yearly / 12)}/月
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">包含功能：</h4>
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
                      <h4 className="font-semibold text-gray-900 mb-3">限制：</h4>
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
            常见问题
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">可以随时升级或降级吗？</h3>
              <p className="text-gray-600 text-sm">
                是的，您可以随时升级或降级您的方案。升级立即生效，降级将在下个计费周期生效。
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