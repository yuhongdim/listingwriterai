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
      description: '适合个人用户试用',
      features: [
        '每日3次AI生成',
        '基础房源描述',
        '标准邮件模板',
        '基础视频脚本',
        '社交媒体内容（有限）'
      ],
      buttonText: '当前套餐',
      color: 'gray'
    },
    {
      id: 'starter',
      name: 'Starter',
      icon: Zap,
      price: { monthly: 9.9, yearly: 99 },
      description: '适合个人经纪人',
      features: [
        '每日100次AI生成',
        '每月500封邮件',
        '高级房源描述模板',
        '个性化邮件营销',
        '专业视频脚本',
        '完整社交媒体套件',
        'PDF/Word导出',
        '基础客户管理',
        '邮件自动化'
      ],
      buttonText: '升级到Starter',
      popular: true,
      color: 'blue'
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Crown,
      price: { monthly: 59, yearly: 590 },
      description: '适合专业团队',
      features: [
        '每日500次AI生成',
        '每月5000封邮件',
        '所有高级模板',
        '批量内容生成',
        '高级客户管理',
        '团队协作功能',
        '自定义品牌',
        '优先客户支持',
        '分析报告',
        'CRM系统集成',
        'API访问'
      ],
      buttonText: '升级到Pro',
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
        '无限邮件发送',
        '白标解决方案',
        '无限团队成员',
        '无限存储空间',
        '专属客户经理',
        '24/7优先支持',
        '自定义集成',
        '高级分析报告',
        '多品牌管理',
        '企业级安全',
        '培训和入门支持'
      ],
      buttonText: '联系销售',
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
            <h2 className="text-2xl font-bold text-gray-900">升级您的套餐</h2>
            <p className="text-gray-600 mt-1">解锁更多强大功能，提升您的营销效率</p>
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
                        推荐
                      </span>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        当前套餐
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
                            /{billingCycle === 'monthly' ? '月' : '年'}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'yearly' && plan.price.monthly > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          相当于 ¥{Math.round(plan.price.yearly * 7 / 12)}/月
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
                            +{plan.features.length - 5} 更多功能...
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
                      {isCurrent ? '当前套餐' : plan.buttonText}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Benefits */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              升级后您将获得
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">更多生成次数</h4>
                <p className="text-sm text-gray-600">满足您的高频使用需求</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">高级功能</h4>
                <p className="text-sm text-gray-600">解锁所有专业工具</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">优先支持</h4>
                <p className="text-sm text-gray-600">专业团队为您服务</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingModal