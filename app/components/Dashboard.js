'use client'

import { useState } from 'react'
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

const Dashboard = ({ usageCount = 0, setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('listing-generator')
  const [listingStyle, setListingStyle] = useState('professional')
  const [listingLength, setListingLength] = useState('medium')
  const [listingLanguage, setListingLanguage] = useState('chinese')
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free') // 模拟当前套餐
  
  // 模拟使用限制
  const planLimits = {
    free: { daily: 3, monthly: 90 },
    starter: { daily: 50, monthly: 1500 },
    pro: { daily: 200, monthly: 6000 },
    agency: { daily: -1, monthly: -1 } // -1 表示无限制
  }
  
  const currentLimit = planLimits[currentPlan]
  const dailyUsage = 2 // 模拟今日使用次数
  const monthlyUsage = 45 // 模拟本月使用次数
  
  const isNearLimit = currentLimit.daily > 0 && dailyUsage >= currentLimit.daily * 0.8
  const isAtLimit = currentLimit.daily > 0 && dailyUsage >= currentLimit.daily

  // 工作台标签配置
  const workbenchTabs = [
    { 
      id: 'listing-generator', 
      label: '智能房源文案生成器', 
      icon: FileText,
      description: '3种风格 × 3种长度，SEO优化，多语言支持'
    },
    { 
      id: 'email-marketing', 
      label: '批量邮件营销系统', 
      icon: Mail,
      description: '联系人管理，CSV导入，A/B测试优化'
    },
    { 
      id: 'social-media', 
      label: '社交媒体内容生成', 
      icon: Share2,
      description: '多平台一键生成，视频脚本创作'
    },
    { 
      id: 'ai-image', 
      label: 'AI图片增强套件', 
      icon: Camera,
      description: '虚拟家具布置，照片增强，全景图生成'
    }
  ]

  // 统计数据
  const stats = [
    {
      title: '房源文案生成',
      value: '1,247',
      change: '+23%',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: '邮件发送量',
      value: '15,680',
      change: '+18%',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: '社媒内容',
      value: '892',
      change: '+35%',
      icon: Share2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: '图片处理',
      value: '456',
      change: '+42%',
      icon: Camera,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  // 房源文案生成器配置
  const listingStyles = [
    { id: 'professional', name: '专业风格', description: '正式、权威、突出专业性' },
    { id: 'luxury', name: '奢华风格', description: '高端、精致、强调品质' },
    { id: 'storytelling', name: '讲故事风格', description: '温馨、生动、情感化表达' }
  ]

  const listingLengths = [
    { id: 'short', name: '短文案', description: '100字以内，简洁明了' },
    { id: 'medium', name: '中等文案', description: '200字左右，详细介绍' },
    { id: 'long', name: '长文案', description: '300字以上，全面描述' }
  ]

  const languages = [
    { id: 'chinese', name: '中文', flag: '🇨🇳' },
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'spanish', name: 'Español', flag: '🇪🇸' }
  ]

  // 渲染标签内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'listing-generator':
        return (
          <div className="space-y-8">
            {/* 房源信息输入 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Home className="h-5 w-5 mr-2 text-blue-600" />
                房源基本信息
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">房源标题</label>
                  <input
                    type="text"
                    placeholder="例：CBD核心区精装三居室"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">房源位置</label>
                  <input
                    type="text"
                    placeholder="例：朝阳区国贸CBD"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">房源面积</label>
                  <input
                    type="text"
                    placeholder="例：120平米"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">房源户型</label>
                  <input
                    type="text"
                    placeholder="例：3室2厅2卫"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">房源特色</label>
                  <textarea
                    rows="3"
                    placeholder="例：南北通透，精装修，地铁直达，学区房"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* 生成设置 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 文案风格 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Palette className="h-4 w-4 mr-2 text-purple-600" />
                  文案风格
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

              {/* 文案长度 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-green-600" />
                  文案长度
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

              {/* 语言选择 */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Languages className="h-4 w-4 mr-2 text-orange-600" />
                  输出语言
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

            {/* 生成按钮 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-semibold text-gray-900">智能生成房源文案</h4>
                  <p className="text-sm text-gray-500 mt-1">AI将根据您的设置生成专业的房源描述</p>
                </div>
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                  <Sparkles className="h-5 w-5 mr-2" />
                  生成文案
                </button>
              </div>
            </div>

            {/* SEO优化选项 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-4 w-4 mr-2 text-red-600" />
                SEO优化设置
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">自动添加本地关键词</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">情感分析优化</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">FHA合规检查</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">包含市场热词</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 'email-marketing':
        return (
          <div className="space-y-8">
            {/* 联系人管理 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Database className="h-5 w-5 mr-2 text-green-600" />
                联系人管理
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">CSV批量导入</h4>
                  <p className="text-sm text-gray-500">支持Excel、CSV格式文件</p>
                </div>
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                  <UserPlus className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">手动添加联系人</h4>
                  <p className="text-sm text-gray-500">逐个添加客户信息</p>
                </div>
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <Filter className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">智能分组</h4>
                  <p className="text-sm text-gray-500">买家/卖家/投资者标签</p>
                </div>
              </div>
            </div>

            {/* 邮件模板生成 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                邮件模板生成
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮件类型</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>开发信</option>
                    <option>跟进邮件</option>
                    <option>房源推荐</option>
                    <option>市场报告</option>
                    <option>节日问候</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目标客户</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>潜在买家</option>
                    <option>潜在卖家</option>
                    <option>投资客户</option>
                    <option>老客户</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">个性化信息</label>
                  <textarea
                    rows="3"
                    placeholder="输入您想要包含的个性化内容..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all">
                  <Wand2 className="h-5 w-5 mr-2" />
                  生成邮件模板
                </button>
              </div>
            </div>

            {/* A/B测试 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <TestTube className="h-5 w-5 mr-2 text-purple-600" />
                A/B测试优化
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">版本A - 直接型</h4>
                  <p className="text-sm text-gray-600 mb-3">主题：您的理想家园等着您</p>
                  <div className="text-xs text-gray-500">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">开启率: 24%</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">点击率: 8%</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">版本B - 情感型</h4>
                  <p className="text-sm text-gray-600 mb-3">主题：找到属于您的温馨港湾</p>
                  <div className="text-xs text-gray-500">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">开启率: 31%</span>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">点击率: 12%</span>
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
                多平台内容生成
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: '微信朋友圈', icon: '💬', color: 'bg-green-100 text-green-800' },
                  { name: '抖音', icon: '🎵', color: 'bg-black text-white' },
                  { name: '小红书', icon: '📖', color: 'bg-red-100 text-red-800' },
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
                内容类型选择
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">房源推广文案</h4>
                  <p className="text-sm text-gray-500">专业的房源介绍和卖点描述</p>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <Video className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">视频脚本</h4>
                  <p className="text-sm text-gray-500">短视频拍摄脚本和解说词</p>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <MessageSquare className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">互动内容</h4>
                  <p className="text-sm text-gray-500">问答、投票、话题讨论</p>
                </div>
              </div>
            </div>

            {/* 视频脚本生成器 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Video className="h-5 w-5 mr-2 text-red-600" />
                视频脚本生成器
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">视频时长</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>15秒 (抖音快手)</option>
                    <option>30秒 (朋友圈)</option>
                    <option>60秒 (小红书)</option>
                    <option>3分钟 (详细介绍)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">视频风格</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                    <option>专业介绍</option>
                    <option>生活化展示</option>
                    <option>故事叙述</option>
                    <option>对比分析</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all">
                  <Video className="h-5 w-5 mr-2" />
                  生成视频脚本
                </button>
              </div>
            </div>
          </div>
        )

      case 'ai-image':
        return (
          <div className="space-y-8">
            {/* 图片上传 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-blue-600" />
                图片上传与管理
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">上传房源照片</h4>
                  <p className="text-sm text-gray-500">支持JPG、PNG格式，最大10MB</p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                  <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">批量处理</h4>
                  <p className="text-sm text-gray-500">一次上传多张图片进行批量处理</p>
                </div>
              </div>
            </div>

            {/* AI增强功能 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-purple-600" />
                AI图片增强功能
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border border-gray-200 rounded-lg hover:border-purple-400 transition-colors cursor-pointer">
                  <Home className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">虚拟家具布置</h4>
                  <p className="text-sm text-gray-500 mb-3">为空房间添加虚拟家具</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">现代风格</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">传统风格</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">豪华风格</span>
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
                  <Sparkles className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">照片智能增强</h4>
                  <p className="text-sm text-gray-500 mb-3">自动调节亮度、对比度</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">去除杂物</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">蓝天替换</span>
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg hover:border-orange-400 transition-colors cursor-pointer">
                  <Maximize className="h-8 w-8 text-orange-600 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-2">全景图生成</h4>
                  <p className="text-sm text-gray-500 mb-3">拼接多张照片成360°全景</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">自动拼接</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">VR展示</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 处理设置 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-600" />
                处理设置
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">输出质量</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>高质量 (适合打印)</option>
                    <option>标准质量 (适合网络)</option>
                    <option>压缩质量 (快速分享)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">输出格式</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>JPG (通用格式)</option>
                    <option>PNG (透明背景)</option>
                    <option>WebP (网络优化)</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all">
                  <Camera className="h-5 w-5 mr-2" />
                  开始处理
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
      {/* 使用限制提醒条 */}
      {(isNearLimit || isAtLimit) && (
        <div className={`${isAtLimit ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'} border-b px-4 py-3`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className={`w-5 h-5 mr-2 ${isAtLimit ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={`text-sm font-medium ${isAtLimit ? 'text-red-800' : 'text-yellow-800'}`}>
                {isAtLimit 
                  ? `您今日的使用次数已达上限 (${dailyUsage}/${currentLimit.daily})` 
                  : `您今日已使用 ${dailyUsage}/${currentLimit.daily} 次，即将达到限制`
                }
              </span>
            </div>
            <button
              onClick={() => setShowPricingModal(true)}
              className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Crown className="w-4 h-4 mr-1" />
              升级套餐
            </button>
          </div>
        </div>
      )}

      {/* 工作台头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                🏠 房产营销自动化工作台
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">今日使用:</span>
                <span className={`text-sm font-medium ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-green-600'}`}>
                  {dailyUsage}/{currentLimit.daily > 0 ? currentLimit.daily : '∞'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">套餐:</span>
                <span className="text-sm font-medium text-blue-600 capitalize">{currentPlan}</span>
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 underline"
                >
                  升级
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

      {/* 统计数据 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} 本月增长</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 工作台标签 */}
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

          {/* 标签内容 */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* 定价模态框 */}
      <PricingModal 
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        currentPlan={currentPlan}
      />
    </div>
  )
}

export default Dashboard