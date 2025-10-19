'use client'

import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Mail, 
  Eye, 
  MousePointer, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Activity,
  PieChart,
  LineChart,
  Target,
  Globe,
  MessageSquare,
  Star,
  Clock,
  Zap,
  CheckCircle
} from 'lucide-react'

const Analytics = ({ setCurrentPage }) => {
  // 主要指标数据
  const mainMetrics = [
    {
      title: 'Total Content Generated',
      value: '2,847',
      change: '+23.5%',
      changeType: 'increase',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Listings, emails, and social posts'
    },
    {
      title: 'Total Engagement',
      value: '45.2K',
      change: '+18.2%',
      changeType: 'increase',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Views, clicks, and interactions'
    },
    {
      title: 'Conversion Rate',
      value: '12.8%',
      change: '+4.3%',
      changeType: 'increase',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Leads generated from content'
    },
    {
      title: 'ROI',
      value: '425%',
      change: '+67%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Return on marketing investment'
    }
  ]

  // 内容类型表现数据
  const contentPerformance = [
    { type: 'Listing Copy', generated: 1247, views: 18500, engagement: '24.5%', conversion: '8.2%' },
    { type: 'Email Templates', generated: 856, views: 12300, engagement: '31.2%', conversion: '15.6%' },
    { type: 'Video Scripts', generated: 423, views: 8900, engagement: '42.1%', conversion: '18.9%' },
    { type: 'Social Media', generated: 321, views: 5600, engagement: '28.7%', conversion: '12.3%' }
  ]

  // 时间趋势数据
  const timeData = [
    { period: 'Jan', content: 180, engagement: 2400, leads: 45 },
    { period: 'Feb', content: 220, engagement: 3100, leads: 62 },
    { period: 'Mar', content: 280, engagement: 3800, leads: 78 },
    { period: 'Apr', content: 340, engagement: 4200, leads: 89 },
    { period: 'May', content: 420, engagement: 5100, leads: 112 },
    { period: 'Jun', content: 380, engagement: 4800, leads: 98 }
  ]

  // 渠道表现数据
  const channelData = [
    { channel: 'Email Marketing', reach: 15600, opens: 4680, clicks: 936, conversion: '6.0%' },
    { channel: 'Social Media', reach: 12400, opens: 3720, clicks: 1116, conversion: '9.0%' },
    { channel: 'Website', reach: 8900, opens: 2670, clicks: 801, conversion: '9.0%' },
    { channel: 'Direct Mail', reach: 3200, opens: 960, clicks: 192, conversion: '6.0%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Deep insights into your real estate marketing performance and ROI
            </p>
            
            {/* Control Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last 30 Days
                </button>
                <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
                <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
              <button className="flex items-center px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center ${
                      metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.changeType === 'increase' ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      <span className="text-sm font-medium">{metric.change}</span>
                    </div>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Generation Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Content Generation Trend</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Content</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Engagement</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {timeData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${(data.content / 500) * 200}px` }}
                    ></div>
                    <div 
                      className="w-full bg-green-500 rounded-t"
                      style={{ height: `${(data.engagement / 6000) * 200}px` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2">{data.period}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance by Content Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance by Content Type</h3>
            <div className="space-y-4">
              {contentPerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.type}</h4>
                      <p className="text-sm text-gray-500">{item.generated} generated</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.engagement}</p>
                    <p className="text-xs text-gray-500">engagement</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Performance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Content Performance Details</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Content Type</th>
                      <th className="pb-3">Generated</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {contentPerformance.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-3 font-medium text-gray-900">{item.type}</td>
                        <td className="py-3 text-gray-600">{item.generated}</td>
                        <td className="py-3 text-gray-600">{item.views.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            {item.conversion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Channel Performance Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Channel Performance</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Channel</th>
                      <th className="pb-3">Reach</th>
                      <th className="pb-3">Clicks</th>
                      <th className="pb-3">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {channelData.map((item, index) => (
                      <tr key={index} className="border-t border-gray-100">
                        <td className="py-3 font-medium text-gray-900">{item.channel}</td>
                        <td className="py-3 text-gray-600">{item.reach.toLocaleString()}</td>
                        <td className="py-3 text-gray-600">{item.clicks}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {item.conversion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Insights and Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI-Powered Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Top Performer</h4>
              </div>
              <p className="text-sm text-blue-800">
                Video scripts show 42.1% engagement rate - 68% higher than average. Consider creating more video content.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Growth Opportunity</h4>
              </div>
              <p className="text-sm text-green-800">
                Email templates have the highest conversion rate at 15.6%. Scale up email marketing campaigns.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="h-5 w-5 text-orange-600" />
                <h4 className="font-medium text-orange-900">Optimization</h4>
              </div>
              <p className="text-sm text-orange-800">
                Social media content has room for improvement. Try different posting times and formats.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Take Action Based on Your Data</h3>
            <p className="text-gray-600">Use these insights to optimize your real estate marketing strategy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Create Video Script', action: 'video', icon: Video, color: 'bg-purple-600' },
              { title: 'Send Email Campaign', action: 'email', icon: Mail, color: 'bg-green-600' },
              { title: 'Generate Listing', action: 'create', icon: FileText, color: 'bg-blue-600' },
              { title: 'Social Media Post', action: 'social', icon: Globe, color: 'bg-pink-600' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(action.action)}
                className={`flex flex-col items-center p-6 ${action.color} text-white rounded-xl hover:opacity-90 transition-opacity`}
              >
                <action.icon className="h-8 w-8 mb-3" />
                <span className="font-medium">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">All systems performing well</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">98.5%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">1.2s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">Content Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics