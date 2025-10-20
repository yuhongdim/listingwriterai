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
  Edit,
  Wand2,
  Target,
  Filter,
  Tag,
  Calendar,
  BarChart3,
  Settings,
  Copy,
  Sparkles
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'
import pricingTiers from '../utils/pricingTiers'

const EmailCenter = ({ usageCount, setUsageCount }) => {
  const [activeSection, setActiveSection] = useState('compose')
  const [contacts, setContacts] = useState([])
  const [emailContent, setEmailContent] = useState('')
  
  // 获取当前用户的邮件限制
  const emailLimit = pricingTiers.getEmailLimit()
  const [emailSubject, setEmailSubject] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [sending, setSending] = useState(false)
  const [showStatsExportMenu, setShowStatsExportMenu] = useState(false)
  const [contactGroups, setContactGroups] = useState([
    { id: 'buyers', name: 'Buyers', color: 'blue', count: 0 },
    { id: 'sellers', name: 'Sellers', color: 'green', count: 0 },
    { id: 'investors', name: 'Investors', color: 'purple', count: 0 }
  ])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [emailTemplates, setEmailTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [abTestEnabled, setAbTestEnabled] = useState(false)
  const [abTestSubjects, setAbTestSubjects] = useState(['', ''])
  const [campaigns, setCampaigns] = useState([])
  const [stats, setStats] = useState({
    emailsSent: 0,
    openRate: 0,
    clickRate: 0,
    bounceRate: 0,
    unsubscribeRate: 0
  })

  const sections = [
    { id: 'compose', label: 'Email Composer', icon: Edit },
    { id: 'templates', label: 'AI Templates', icon: Wand2 },
    { id: 'contacts', label: 'Contact Management', icon: Users },
    { id: 'campaigns', label: 'Email Campaigns', icon: Mail },
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 }
  ]

  const templateCategories = [
    {
      id: 'listing',
      name: 'Property Listings',
      templates: [
        { id: 'new-listing', name: 'New Listing Announcement', description: 'Announce new properties to your network' },
        { id: 'price-drop', name: 'Price Reduction Alert', description: 'Notify about price changes' },
        { id: 'open-house', name: 'Open House Invitation', description: 'Invite clients to open houses' }
      ]
    },
    {
      id: 'nurture',
      name: 'Lead Nurturing',
      templates: [
        { id: 'market-update', name: 'Market Update Newsletter', description: 'Share market insights and trends' },
        { id: 'follow-up', name: 'Follow-up Sequence', description: 'Stay in touch with prospects' },
        { id: 'testimonial', name: 'Client Success Stories', description: 'Share testimonials and case studies' }
      ]
    },
    {
      id: 'seasonal',
      name: 'Seasonal Campaigns',
      templates: [
        { id: 'spring-market', name: 'Spring Market Kickoff', description: 'Capitalize on spring buying season' },
        { id: 'holiday-greetings', name: 'Holiday Greetings', description: 'Maintain relationships during holidays' },
        { id: 'year-end', name: 'Year-End Market Review', description: 'Annual market summary' }
      ]
    }
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
          source: contact.source,
          group: contact.group || 'buyers',
          tags: contact.tags || [],
          lastContact: null,
          status: 'active'
        }))
        
        setContacts([...contacts, ...newContacts])
        updateGroupCounts([...contacts, ...newContacts])
        alert(`Successfully imported ${newContacts.length} contacts`)
      } else {
        alert('Import failed: ' + data.error)
      }
    } catch (error) {
      console.error('CSV import error:', error)
      alert('Import failed, please try again')
    }
  }

  const updateGroupCounts = (contactList) => {
    const counts = contactList.reduce((acc, contact) => {
      acc[contact.group] = (acc[contact.group] || 0) + 1
      return acc
    }, {})
    
    setContactGroups(prev => prev.map(group => ({
      ...group,
      count: counts[group.id] || 0
    })))
  }

  const generateEmailTemplate = async (templateId, propertyData = {}) => {
    if (!usageTracker.canUse()) {
      const resetTime = usageTracker.formatTimeUntilReset()
      alert(`You've reached today's free usage limit (3 times), ${resetTime}`)
      return
    }

    try {
      const response = await fetch('/api/generate-email-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateType: templateId,
          agentName: 'Real Estate Agent',
          agencyName: 'Premium Properties',
          propertyInfo: propertyData,
          tone: 'professional',
          includeSignature: true,
          callToAction: 'Contact us for more details',
          subject: `Email about ${templateId}`
        })
      })

      const data = await response.json()

      if (data.success) {
        setEmailSubject(data.template.subject)
        setEmailContent(data.template.body)
        
        // Update usage count
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
        
        // Switch to compose section
        setActiveSection('compose')
      } else {
        alert('Template generation failed: ' + data.error)
      }
    } catch (error) {
      console.error('Template generation error:', error)
      alert('Template generation failed, please try again')
    }
  }

  const sendEmail = async () => {
    if (!usageTracker.canUse()) {
      const resetTime = usageTracker.formatTimeUntilReset()
      alert(`You've reached today's free usage limit (3 times), ${resetTime}`)
      return
    }

    if (!emailSubject || !emailContent || selectedContacts.length === 0) {
      alert('Please fill in complete email information and select recipients')
      return
    }

    setSending(true)

    try {
      const selectedContactsData = contacts.filter(contact => 
        selectedContacts.includes(contact.id)
      )

      // Create campaign record
      const campaignId = Date.now()
      const newCampaign = {
        id: campaignId,
        name: emailSubject,
        subject: emailSubject,
        content: emailContent,
        recipients: selectedContactsData.length,
        sentAt: new Date().toISOString(),
        status: 'sent',
        stats: {
          sent: selectedContactsData.length,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0,
          unsubscribed: 0
        }
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients: selectedContactsData,
          subject: abTestEnabled ? abTestSubjects : emailSubject,
          content: emailContent,
          senderName: 'Real Estate Marketing Workbench',
          campaignId: campaignId,
          abTest: abTestEnabled
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(data.message)
        
        // Update campaign with results
        newCampaign.stats.delivered = data.summary.success
        setCampaigns(prev => [newCampaign, ...prev])
        
        // Update statistics
        setStats(prev => ({
          ...prev,
          emailsSent: prev.emailsSent + data.summary.success,
          openRate: Math.floor(Math.random() * 30) + 15, // Simulated open rate
          clickRate: Math.floor(Math.random() * 10) + 5,   // Simulated click rate
          bounceRate: Math.floor(Math.random() * 5) + 1,   // Simulated bounce rate
          unsubscribeRate: Math.floor(Math.random() * 2) + 0.5 // Simulated unsubscribe rate
        }))

        // Update usage count
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)

        // Clear form
        setEmailSubject('')
        setEmailContent('')
        setSelectedContacts([])
        setAbTestSubjects(['', ''])
        setAbTestEnabled(false)
      } else {
        alert('Send failed: ' + data.error)
      }
    } catch (error) {
      console.error('Send email error:', error)
      alert('Send failed, please try again')
    } finally {
      setSending(false)
    }
  }

  const exportContacts = async (format = 'csv') => {
    if (contacts.length === 0) {
      alert('No contacts to export')
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
          filename: `contact_list_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          // For PDF, create a new window to display HTML content, user can print as PDF
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          // For CSV and TXT, direct download
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        alert('Export failed: ' + data.error)
      }
    } catch (error) {
      console.error('Export error:', error)
      // If API fails, use simple CSV export
      const csvContent = 'data:text/csv;charset=utf-8,' + 
        'Name,Email,Phone,Group,Source\n' +
        contacts.map(contact => 
          `"${contact.name || ''}","${contact.email || ''}","${contact.phone || ''}","${contact.group || ''}","${contact.source || ''}"`
        ).join('\n')
      
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `contact_list_${Date.now()}.csv`)
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
          filename: `email_statistics_${Date.now()}.${format}`
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
        alert('Export failed: ' + data.error)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed, please try again')
    }
  }

  const renderTemplatesSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">AI Email Templates</h3>
            <p className="text-gray-600 text-sm">Generate professional email templates with AI</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <Sparkles size={16} />
            <span>Powered by AI</span>
          </div>
        </div>

        {/* Usage Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              Remaining uses today: <span className="font-semibold">{emailLimit - usageCount}</span>/{emailLimit}
            </span>
            {usageCount >= emailLimit && (
              <span className="text-blue-600 text-xs">
                {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
              </span>
            )}
          </div>
          {usageCount >= emailLimit && (
            <div className="mt-1 text-xs text-blue-600">
              Free quota exhausted, automatically resets at midnight
            </div>
          )}
        </div>

        {/* Template Categories */}
        <div className="space-y-6">
          {templateCategories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">{category.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.templates.map((template) => (
                  <div key={template.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors">
                    <h5 className="font-medium text-gray-900 mb-2">{template.name}</h5>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <button
                      onClick={() => generateEmailTemplate(template.id)}
                      disabled={usageCount >= emailLimit}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center space-x-2"
                    >
                      <Wand2 size={16} />
                      <span>Generate Template</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Template Generator */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Custom Template Generator</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Purpose</label>
              <input
                type="text"
                placeholder="e.g., Follow up with potential buyers"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select audience</option>
                <option value="buyers">First-time Buyers</option>
                <option value="sellers">Property Sellers</option>
                <option value="investors">Real Estate Investors</option>
                <option value="luxury">Luxury Market</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Tone</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="urgent">Urgent</option>
                <option value="informative">Informative</option>
              </select>
            </div>
            <button
              disabled={usageCount >= emailLimit}
              className="w-full gradient-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 size={20} />
              Generate Custom Template
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderComposeSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Mail className="text-blue-600" size={20} />
          <span>Compose Email</span>
        </h3>
        
        <div className="space-y-4">
          {/* A/B Testing Toggle */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={abTestEnabled}
                  onChange={(e) => setAbTestEnabled(e.target.checked)}
                  className="rounded text-purple-600"
                />
                <span className="text-sm font-medium text-purple-700">Enable A/B Testing</span>
              </label>
              <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                Split Test Subject Lines
              </div>
            </div>
            
            {abTestEnabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">Subject A</label>
                  <input
                    type="text"
                    value={abTestSubjects.a}
                    onChange={(e) => setAbTestSubjects({...abTestSubjects, a: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="First subject line..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-700 mb-1">Subject B</label>
                  <input
                    type="text"
                    value={abTestSubjects.b}
                    onChange={(e) => setAbTestSubjects({...abTestSubjects, b: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Second subject line..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Regular Subject Line */}
          {!abTestEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject..."
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email content..."
            />
          </div>
          
          {/* Contact Group Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Group</label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Contacts</option>
              {contactGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Recipients ({selectedContacts.length} selected)
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {contacts.length > 0 ? (
                contacts
                  .filter(contact => !selectedGroup || contact.group === selectedGroup)
                  .map((contact) => (
                  <label key={contact.id} className="flex items-center space-x-2 py-1 hover:bg-gray-50 rounded px-2">
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
                      className="rounded text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{contact.name || contact.email}</span>
                      {contact.group && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {contactGroups.find(g => g.id === contact.group)?.name || contact.group}
                        </span>
                      )}
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Please import contacts first</p>
              )}
            </div>
          </div>
          
          {/* Usage Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700 font-medium">
                  Daily Usage: <span className="font-bold">{usageCount}</span>/{emailLimit} emails sent
                </span>
              </div>
              {usageCount >= emailLimit && (
                <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">
                  {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                </span>
              )}
            </div>
            {usageCount >= emailLimit && (
              <div className="mt-2 text-xs text-blue-600 flex items-center space-x-1">
                <span>⏰</span>
                <span>Free quota exhausted - resets at midnight</span>
              </div>
            )}
          </div>
          
          <button
            onClick={sendEmail}
            disabled={usageCount >= emailLimit || sending}
            className="w-full gradient-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 py-3"
          >
            <Send size={20} />
            <span>
              {sending ? 'Sending...' : usageCount >= emailLimit ? 'Daily Limit Reached' : 'Send Email Campaign'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderContactsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contact Management</h3>
          <div className="flex space-x-2">
            <label className="gradient-button cursor-pointer">
              <Upload size={20} />
              Import CSV
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
                <span>Export CSV</span>
              </button>
            </div>
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download size={20} />
                <span>More Formats</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button 
                  onClick={() => exportContacts('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                >
                  Export PDF
                </button>
                <button 
                  onClick={() => exportContacts('txt')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
                >
                  Export TXT
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
          <p className="text-sm text-blue-700">
            Please ensure your CSV file contains the following columns: name, email, phone
          </p>
        </div>
        
        {contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Phone</th>
                  <th className="text-left py-2">Actions</th>
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
            <p className="text-gray-500">No contacts yet</p>
            <p className="text-sm text-gray-400 mt-1">Please import CSV file to add contacts</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderCampaignsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Email Campaigns</h3>
        <div className="text-center py-8">
          <Mail size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No email campaigns yet</p>
          <p className="text-sm text-gray-400 mt-1">Campaign records will appear here after sending emails</p>
        </div>
      </div>
    </div>
  )

  const renderAnalyticsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Total Sent</h4>
            <Send size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.emailsSent}</p>
          <p className="text-sm text-gray-500">Sent this month</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Open Rate</h4>
            <Eye size={20} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
          <p className="text-sm text-gray-500">Average open rate</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Click Rate</h4>
            <MousePointer size={20} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.clickRate}%</p>
          <p className="text-sm text-gray-500">Average click rate</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Email Tracking</h3>
          {stats.emailsSent > 0 && (
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download size={16} />
                <span>Export Statistics</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button 
                  onClick={() => exportStats('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg"
                >
                  Export CSV
                </button>
                <button 
                  onClick={() => exportStats('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  Export PDF
                </button>
                <button 
                  onClick={() => exportStats('txt')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg"
                >
                  Export TXT
                </button>
              </div>
            </div>
          )}
        </div>
        {stats.emailsSent > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Total Sent</span>
              <span className="text-blue-600 font-semibold">{stats.emailsSent}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Estimated Opens</span>
              <span className="text-green-600 font-semibold">
                {Math.floor(stats.emailsSent * stats.openRate / 100)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Estimated Clicks</span>
              <span className="text-purple-600 font-semibold">
                {Math.floor(stats.emailsSent * stats.clickRate / 100)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No data yet</p>
            <p className="text-sm text-gray-400 mt-1">Data will appear here after sending emails</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Marketing Center</h1>
        <p className="text-gray-600">Send property information in bulk and track email performance</p>
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