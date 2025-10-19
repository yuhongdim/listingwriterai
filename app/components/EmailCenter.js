'use client'

import { useState } from 'react'
import { 
  Upload, 
  Mail, 
  Send, 
  Users, 
  Eye, 
  MousePointer,
  Download,
  Plus,
  Trash2,
  Edit
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'

const EmailCenter = ({ usageCount, setUsageCount }) => {
  const [activeSection, setActiveSection] = useState('compose')
  const [contacts, setContacts] = useState([])
  const [emailContent, setEmailContent] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [sending, setSending] = useState(false)
  const [showStatsExportMenu, setShowStatsExportMenu] = useState(false)
  const [stats, setStats] = useState({
    emailsSent: 0,
    openRate: 0,
    clickRate: 0
  })

  const sections = [
    { id: 'compose', label: '撰写邮件', icon: Edit },
    { id: 'contacts', label: '联系人管理', icon: Users },
    { id: 'campaigns', label: '邮件活动', icon: Mail },
    { id: 'analytics', label: '数据分析', icon: Eye }
  ]

  const handleCSVUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/parse-csv', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        const newContacts = data.contacts.map((contact, index) => ({
          id: Date.now() + index,
          name: contact.name,
          email: contact.email,
          phone: contact.phone || '',
          source: contact.source
        }))
        
        setContacts([...contacts, ...newContacts])
        alert(`成功导入 ${newContacts.length} 个联系人`)
      } else {
        alert('导入失败：' + data.error)
      }
    } catch (error) {
      console.error('CSV导入错误:', error)
      alert('导入失败，请重试')
    }
  }

  const sendEmail = async () => {
    if (!usageTracker.canUse()) {
      const resetTime = usageTracker.formatTimeUntilReset()
      alert(`您已达到今日免费使用限制（3次），${resetTime}`)
      return
    }

    if (!emailSubject || !emailContent || selectedContacts.length === 0) {
      alert('请填写完整的邮件信息并选择收件人')
      return
    }

    setSending(true)

    try {
      const selectedContactsData = contacts.filter(contact => 
        selectedContacts.includes(contact.id)
      )

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: selectedContactsData,
          subject: emailSubject,
          content: emailContent,
          senderName: 'ListingWriterAI'
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        
        // 更新统计数据
        setStats(prev => ({
          ...prev,
          emailsSent: prev.emailsSent + data.summary.success,
          openRate: Math.floor(Math.random() * 30) + 15, // 模拟打开率
          clickRate: Math.floor(Math.random() * 10) + 5   // 模拟点击率
        }))

        // 更新使用计数
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)

        // 清空表单
        setEmailSubject('')
        setEmailContent('')
        setSelectedContacts([])
      } else {
        alert('发送失败：' + data.error)
      }
    } catch (error) {
      console.error('发送邮件错误:', error)
      alert('发送失败，请重试')
    } finally {
      setSending(false)
    }
  }

  const exportContacts = async (format = 'csv') => {
    if (contacts.length === 0) {
      alert('没有联系人可导出')
      return
    }

    try {
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: contacts,
          format: format,
          type: 'contacts',
          filename: `联系人列表_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          // 对于PDF，创建一个新窗口显示HTML内容，用户可以打印为PDF
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          // 对于CSV和TXT，直接下载
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        alert('导出失败：' + data.error)
      }
    } catch (error) {
      console.error('导出错误:', error)
      // 如果API失败，使用简单的CSV导出
      const csvContent = 'data:text/csv;charset=utf-8,' + 
        '姓名,邮箱,电话,来源\n' +
        contacts.map(contact => 
          `"${contact.name || ''}","${contact.email || ''}","${contact.phone || ''}","${contact.source || ''}"`
        ).join('\n')
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `联系人列表_${Date.now()}.csv`)
      link.click()
    }
  }

  const exportStats = async (format = 'csv') => {
    try {
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: stats,
          format: format,
          type: 'email-stats',
          filename: `邮件统计_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        alert('导出失败：' + data.error)
      }
    } catch (error) {
      console.error('导出错误:', error)
      alert('导出失败，请重试')
    }
  }

  const renderComposeSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">撰写邮件</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮件主题</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入邮件主题..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮件内容</label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入邮件内容..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择收件人 ({selectedContacts.length} 已选择)
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <label key={contact.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([...selectedContacts, contact.id])
                        } else {
                          setSelectedContacts(selectedContacts.filter(id => id !== contact.id))
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{contact.name || contact.email}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">请先导入联系人</p>
              )}
            </div>
          </div>
          
          {/* Usage Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                今日剩余次数: <span className="font-semibold">{3 - usageCount}</span>/3
              </span>
              {usageCount >= 3 && (
                <span className="text-blue-600 text-xs">
                  {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                </span>
              )}
            </div>
            {usageCount >= 3 && (
              <div className="mt-1 text-xs text-blue-600">
                免费额度已用完，明日0点自动重置
              </div>
            )}
          </div>
          
          <button
            onClick={sendEmail}
            disabled={usageCount >= 3 || sending}
            className="gradient-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
            {sending ? '发送中...' : usageCount >= 3 ? '已达到今日免费使用限制' : '发送邮件'}
          </button>
        </div>
      </div>
    </div>
  )

  const renderContactsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">联系人管理</h3>
          <div className="flex space-x-2">
            <label className="gradient-button cursor-pointer">
              <Upload size={20} />
              导入CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            <div className="relative">
              <button 
                onClick={() => exportContacts('csv')}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download size={20} />
                <span>导出CSV</span>
              </button>
            </div>
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download size={20} />
                <span>更多格式</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button 
                  onClick={() => exportContacts('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                >
                  导出PDF
                </button>
                <button 
                  onClick={() => exportContacts('txt')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
                >
                  导出TXT
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">CSV格式要求</h4>
          <p className="text-sm text-blue-700">
            请确保CSV文件包含以下列：name（姓名）, email（邮箱）, phone（电话）
          </p>
        </div>
        
        {contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">姓名</th>
                  <th className="text-left py-2">邮箱</th>
                  <th className="text-left py-2">电话</th>
                  <th className="text-left py-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-100">
                    <td className="py-2">{contact.name || '-'}</td>
                    <td className="py-2">{contact.email || '-'}</td>
                    <td className="py-2">{contact.phone || '-'}</td>
                    <td className="py-2">
                      <button
                        onClick={() => setContacts(contacts.filter(c => c.id !== contact.id))}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无联系人</p>
            <p className="text-sm text-gray-400 mt-1">请导入CSV文件添加联系人</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderCampaignsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">邮件活动</h3>
        <div className="text-center py-8">
          <Mail size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无邮件活动</p>
          <p className="text-sm text-gray-400 mt-1">发送邮件后，活动记录将显示在这里</p>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">发送总数</h4>
            <Send size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
          <p className="text-sm text-gray-500">本月发送</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">打开率</h4>
            <Eye size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
          <p className="text-sm text-gray-500">平均打开率</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">点击率</h4>
            <MousePointer size={20} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.clickRate}%</p>
          <p className="text-sm text-gray-500">平均点击率</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">邮件追踪</h3>
          {stats.emailsSent > 0 && (
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download size={16} />
                <span>导出统计</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button 
                  onClick={() => exportStats('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                >
                  导出CSV
                </button>
                <button 
                  onClick={() => exportStats('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  导出PDF
                </button>
                <button 
                  onClick={() => exportStats('txt')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
                >
                  导出TXT
                </button>
              </div>
            </div>
          )}
        </div>
        {stats.emailsSent > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">总发送量</span>
              <span className="text-blue-600 font-semibold">{stats.emailsSent}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">预估打开数</span>
              <span className="text-green-600 font-semibold">
                {Math.floor(stats.emailsSent * stats.openRate / 100)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">预估点击数</span>
              <span className="text-purple-600 font-semibold">
                {Math.floor(stats.emailsSent * stats.clickRate / 100)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无数据</p>
            <p className="text-sm text-gray-400 mt-1">发送邮件后，数据将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">邮件营销中心</h1>
        <p className="text-gray-600">批量发送房源信息，追踪邮件效果</p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSection === section.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeSection === 'compose' && renderComposeSection()}
      {activeSection === 'contacts' && renderContactsSection()}
      {activeSection === 'campaigns' && renderCampaignsSection()}
      {activeSection === 'analytics' && renderAnalyticsSection()}
    </div>
  )
}

export default EmailCenter