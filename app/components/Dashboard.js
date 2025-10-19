'use client'

import { 
  FileText, 
  Mail, 
  Video,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react'

const Dashboard = ({ usageCount, setCurrentPage }) => {
  const features = [
    {
      title: 'AI房源文案生成',
      description: '智能生成专业房产描述，吸引更多潜在买家',
      icon: FileText,
      action: 'create',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: '批量邮件营销',
      description: '一键发送房源信息给客户列表，提高营销效率',
      icon: Mail,
      action: 'email',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: '视频脚本创作',
      description: '生成房产展示视频脚本，制作专业营销视频',
      icon: Video,
      action: 'video',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  const benefits = [
    '节省90%的文案创作时间',
    '提高房源曝光率和询盘量',
    '专业营销内容，提升品牌形象',
    '批量处理，提高工作效率'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles size={16} />
                <span>AI驱动的房产营销工具</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              让AI为您的
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                房产营销
              </span>
              <br />
              创造奇迹
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              专业的AI房产营销平台，帮助房产经纪人快速生成高质量文案、发送营销邮件、制作视频脚本。
              让您的房源脱颖而出，吸引更多客户。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => setCurrentPage('create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Zap size={20} />
                <span>立即开始创作</span>
                <ArrowRight size={20} />
              </button>
              
              <div className="text-sm text-gray-500">
                免费使用 {usageCount}/3 次 · 无需注册
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-600">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            三大核心功能，满足您的所有需求
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            从文案创作到邮件营销，从视频脚本到客户管理，一站式解决您的房产营销需求
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => setCurrentPage(feature.action)}
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 group-hover:transform group-hover:scale-105">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon size={32} className={feature.textColor} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text group-hover:translate-x-1 transition-transform duration-200">
                    <span>立即体验</span>
                    <ArrowRight size={16} className="ml-1 text-blue-600" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            准备好提升您的房产营销了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            加入数千名房产经纪人的行列，使用AI技术让您的房源营销更加高效和专业
          </p>
          <button
            onClick={() => setCurrentPage('create')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Sparkles size={20} />
            <span>免费开始使用</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard