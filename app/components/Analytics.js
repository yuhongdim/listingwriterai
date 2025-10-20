'use client'

import { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Mail, 
  Eye, 
  MousePointer,
  DollarSign,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Activity,
  PieChart,
  LineChart,
  Target,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  Star,
  ArrowUp,
  ArrowDown,
  Zap,
  FileText,
  Video,
  Share2,
  Camera,
  Settings,
  Home,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingFlat
} from 'lucide-react'

const Analytics = ({ setCurrentPage }) => {
  const [timeRange, setTimeRange] = useState('30d')
  const [activeMetric, setActiveMetric] = useState('overview')

  // 时间范围选项
  const timeRanges = [
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' },
    { id: '90d', label: 'Last 90 Days' },
    { id: '1y', label: 'Last Year' }
  ]

  // 核心指标数据
  const coreMetrics = [
    {
      title: 'Total Revenue',
      value: '$45,280',
      change: '+23.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Total revenue from marketing campaigns this month'
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+18.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Active users using dashboard features'
    },
    {
      title: 'Emails Sent',
      value: '15,680',
      change: '+12.8%',
      trend: 'up',
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Total emails sent through the system'
    },
    {
      title: 'Conversion Rate',
      value: '8.4%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Average conversion rate for email marketing'
    }
  ]

  // 功能使用统计
  const featureUsage = [
    {
      name: 'Smart Property Listing Generator',
      usage: 1247,
      percentage: 85,
      icon: FileText,
      color: 'bg-blue-500',
      growth: '+15%'
    },
    {
      name: 'Bulk Email Marketing System',
      usage: 892,
      percentage: 68,
      icon: Mail,
      color: 'bg-green-500',
      growth: '+22%'
    },
    {
      name: 'Social Media Content Generator',
      usage: 634,
      percentage: 52,
      icon: Share2,
      color: 'bg-purple-500',
      growth: '+8%'
    },
    {
      name: 'AI Image Enhancement Suite',
      usage: 456,
      percentage: 38,
      icon: Camera,
      color: 'bg-orange-500',
      growth: '+31%'
    }
  ]

  // 邮件营销热力图数据
  const emailHeatmapData = [
    {
      title: 'Email Open Rate',
      value: '24.8%',
      benchmark: 'Industry Average: 21.3%',
      status: 'good',
      icon: Eye,
      heatmap: [85, 92, 78, 88, 95, 82, 90] // 一周的数据
    },
    {
      title: 'Click Rate',
      value: '8.2%',
      benchmark: 'Industry Average: 6.5%',
      status: 'good',
      icon: MousePointer,
      heatmap: [65, 72, 58, 68, 75, 62, 70]
    },
    {
      title: 'Unsubscribe Rate',
      value: '1.2%',
      benchmark: 'Industry Average: 2.1%',
      status: 'good',
      icon: TrendingDown,
      heatmap: [15, 12, 18, 14, 10, 16, 13]
    },
    {
      title: 'Conversion Rate',
      value: '5.6%',
      benchmark: 'Industry Average: 4.2%',
      status: 'excellent',
      icon: Target,
      heatmap: [45, 52, 38, 48, 55, 42, 50]
    }
  ]

  // 地理分布数据
  const geoData = [
    { city: 'Beijing', users: 847, percentage: 29.8, revenue: 12680 },
    { city: 'Shanghai', users: 623, percentage: 21.9, revenue: 9840 },
    { city: 'Shenzhen', users: 456, percentage: 16.0, revenue: 7320 },
    { city: 'Guangzhou', users: 334, percentage: 11.7, revenue: 5560 },
    { city: 'Hangzhou', users: 287, percentage: 10.1, revenue: 4890 },
    { city: 'Others', users: 300, percentage: 10.5, revenue: 4990 }
  ]

  // 设备分布数据
  const deviceData = [
    { type: 'Desktop', count: 1680, percentage: 59.0, icon: Monitor, engagement: '12.5 min' },
    { type: 'Mobile', count: 1167, percentage: 41.0, icon: Smartphone, engagement: '8.3 min' }
  ]

  // ROI分析数据
  const roiData = [
    {
      campaign: 'Spring Property Promotion',
      investment: 8500,
      revenue: 28600,
      roi: 236.5,
      status: 'excellent',
      leads: 145,
      conversion: '12.8%'
    },
    {
      campaign: 'Luxury Villa Marketing',
      investment: 12000,
      revenue: 35400,
      roi: 195.0,
      status: 'good',
      leads: 89,
      conversion: '15.2%'
    },
    {
      campaign: 'School District Properties',
      investment: 6800,
      revenue: 18200,
      roi: 167.6,
      status: 'good',
      leads: 234,
      conversion: '9.6%'
    },
    {
      campaign: 'Investment Property Showcase',
      investment: 9200,
      revenue: 15800,
      roi: 71.7,
      status: 'average',
      leads: 167,
      conversion: '6.8%'
    }
  ]

  // 实时数据
  const realTimeData = {
    onlineUsers: 127,
    activeListings: 45,
    emailsSentToday: 1247,
    socialPostsGenerated: 89,
    avgSessionTime: '8:42',
    userSatisfaction: 4.8,
    totalFeedback: 234
  }

  // 获取ROI状态颜色
  const getRoiStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'average': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // 获取ROI状态文本
  const getRoiStatusText = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent'
      case 'good': return 'Good'
      case 'average': return 'Average'
      default: return 'Needs Improvement'
    }
  }

  // 获取热力图颜色强度
  const getHeatmapIntensity = (value) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-green-400'
    if (value >= 40) return 'bg-yellow-400'
    if (value >= 20) return 'bg-orange-400'
    return 'bg-red-400'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowUp className="h-5 w-5 rotate-[-90deg]" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                📊 Analytics Center
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRanges.map((range) => (
                  <option key={range.id} value={range.id}>{range.label}</option>
                ))}
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                 <RefreshCw className="h-4 w-4 mr-2" />
                 Refresh Data
               </button>
               <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                 <Download className="h-4 w-4 mr-2" />
                 Export Report
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 核心指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {coreMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 功能使用统计 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Core Feature Usage Statistics
            </h3>
            <div className="space-y-6">
              {featureUsage.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <feature.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{feature.name}</h4>
                      <p className="text-sm text-gray-500">{feature.usage} uses ({feature.growth})</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${feature.color}`}
                        style={{ width: `${feature.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{feature.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 邮件营销热力图 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-600" />
              Email Marketing Heatmap
            </h3>
            <div className="space-y-6">
              {emailHeatmapData.map((metric, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{metric.title}</h4>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      metric.status === 'excellent' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {metric.status === 'excellent' ? 'Excellent' : 'Above Average'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-xs text-gray-500">{metric.benchmark}</p>
                  </div>
                  <div className="flex space-x-1">
                    {metric.heatmap.map((value, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 rounded ${getHeatmapIntensity(value)}`}
                        title={`Day ${i+1}: ${value}%`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 地理分布和设备分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 地理分布 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              User Geographic Distribution
            </h3>
            <div className="space-y-4">
              {geoData.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium text-gray-900">{location.city}</span>
                      <p className="text-sm text-gray-500">{location.users} users • ${location.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${location.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">{location.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 设备分析 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-purple-600" />
              Device Usage Analysis
            </h3>
            <div className="space-y-6">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <device.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{device.type}</h4>
                      <p className="text-sm text-gray-500">{device.count} users • Avg. {device.engagement}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{device.percentage}%</p>
                    <div className="w-16 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="h-2 bg-purple-500 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI分析 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Marketing Campaign ROI Analysis
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Investment</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Leads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Conversion</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ROI</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {roiData.map((campaign, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{campaign.campaign}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">${campaign.investment.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-600">${campaign.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-600">{campaign.leads}</td>
                    <td className="py-4 px-4 text-gray-600">{campaign.conversion}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900">{campaign.roi}%</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoiStatusColor(campaign.status)}`}>
                        {getRoiStatusText(campaign.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 实时活动监控 */}
         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
           <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
             <Activity className="h-5 w-5 mr-2 text-orange-600" />
             Real-time Activity Monitor
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="text-center p-6 border border-gray-200 rounded-lg">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                 <Zap className="h-6 w-6 text-green-600" />
               </div>
               <h4 className="font-medium text-gray-900 mb-2">Current Online Users</h4>
               <p className="text-3xl font-bold text-gray-900 mb-1">{realTimeData.onlineUsers}</p>
               <p className="text-sm text-gray-500">+15% vs yesterday same time</p>
             </div>
             <div className="text-center p-6 border border-gray-200 rounded-lg">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                 <Home className="h-6 w-6 text-blue-600" />
               </div>
               <h4 className="font-medium text-gray-900 mb-2">Active Listings</h4>
               <p className="text-3xl font-bold text-gray-900 mb-1">{realTimeData.activeListings}</p>
               <p className="text-sm text-gray-500">8 new today</p>
             </div>
             <div className="text-center p-6 border border-gray-200 rounded-lg">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                 <Mail className="h-6 w-6 text-purple-600" />
               </div>
               <h4 className="font-medium text-gray-900 mb-2">Emails Sent Today</h4>
               <p className="text-3xl font-bold text-gray-900 mb-1">{realTimeData.emailsSentToday.toLocaleString()}</p>
               <p className="text-sm text-gray-500">24.8% open rate</p>
             </div>
             <div className="text-center p-6 border border-gray-200 rounded-lg">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                 <Star className="h-6 w-6 text-orange-600" />
               </div>
               <h4 className="font-medium text-gray-900 mb-2">User Satisfaction</h4>
               <p className="text-3xl font-bold text-gray-900 mb-1">{realTimeData.userSatisfaction}</p>
               <p className="text-sm text-gray-500">Based on {realTimeData.totalFeedback} feedback</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  )
}

export default Analytics