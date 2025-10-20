/**
 * Data Management Component
 * Provides data import/export, history, and template management features
 */

'use client'

import { useState, useRef } from 'react'
import { 
  Download, 
  Upload, 
  History, 
  BookOpen, 
  Trash2, 
  Copy, 
  Edit3, 
  Save,
  RefreshCw,
  Database,
  Cloud,
  HardDrive,
  Settings,
  X,
  Plus,
  Search,
  Calendar,
  FileText,
  Star
} from 'lucide-react'
import { 
  useContentHistory, 
  useTemplates, 
  useDataImportExport, 
  useDataSync,
  useStorageStats 
} from '../hooks/useStorage'
import { useToast } from './Toast'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from './LoadingSpinner'

const DataManager = ({ isOpen, onClose, onContentSelect }) => {
  const { user, isAuthenticated } = useAuth()
  const { success, error, warning } = useToast()
  const fileInputRef = useRef(null)
  
  const [activeTab, setActiveTab] = useState('history')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    content: '',
    category: 'listing'
  })

  // Hooks
  const { history, saveContent, loading: historyLoading } = useContentHistory()
  const { 
    templates, 
    saveTemplate, 
    deleteTemplate, 
    loading: templatesLoading 
  } = useTemplates()
  const { exportData, importData, exporting, importing } = useDataImportExport()
  const { syncing, lastSync, syncData } = useDataSync()
  const { stats, cleanup } = useStorageStats()

  if (!isOpen) return null

  const tabs = [
    { id: 'history', label: 'History', icon: History },
    { id: 'templates', label: 'Templates', icon: BookOpen },
    { id: 'sync', label: 'Data Sync', icon: Cloud },
    { id: 'storage', label: 'Storage', icon: Database }
  ]

  const handleExport = async () => {
    if (!isAuthenticated) {
      warning('Please login first to export data')
      return
    }

    const result = await exportData()
    if (result) {
      success('Data exported successfully')
    } else {
      error('Data export failed')
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!isAuthenticated) {
      warning('Please login first to import data')
      return
    }

    const result = await importData(file)
    if (result) {
      success('Data imported successfully')
    } else {
      error('Data import failed')
    }
    
    // Clear file input
    event.target.value = ''
  }

  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      warning('Please fill in template name and content')
      return
    }

    const result = await saveTemplate(newTemplate)
    if (result) {
      success('Template saved successfully')
      setNewTemplate({
        name: '',
        description: '',
        content: '',
        category: 'listing'
      })
    } else {
      error('Template save failed')
    }
  }

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    const result = await deleteTemplate(templateId)
    if (result) {
      success('Template deleted successfully')
    } else {
      error('Failed to delete template')
    }
  }

  const handleCopyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      success('Content copied to clipboard')
    } catch (err) {
      error('Failed to copy')
    }
  }

  const handleSync = async () => {
    await syncData()
    success('Data sync completed')
  }

  const handleCleanup = () => {
    cleanup()
    success('Expired data cleanup completed')
  }

  const filteredHistory = history.filter(item =>
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Management Center</h2>
            <p className="text-gray-500 mt-1">Manage your content history, templates and data sync</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Content History</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search history..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {historyLoading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner type="dots" message="Loading history..." />
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No history records</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHistory.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-900 line-clamp-3">
                              {item.content.substring(0, 200)}...
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleCopyContent(item.content)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Copy content"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onContentSelect && onContentSelect(item.content)}
                              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              Use
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="h-full flex">
              {/* Templates List */}
              <div className="w-1/2 border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Template Library</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {templatesLoading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner type="dots" message="Loading templates..." />
                    </div>
                  ) : filteredTemplates.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No templates available</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setEditingTemplate(template)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {template.name}
                              </h4>
                              <p className="text-sm text-gray-500 mb-2">
                                {template.description}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                  {template.category}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(template.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteTemplate(template.id)
                              }}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Template Editor */}
              <div className="w-1/2 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">
                    {editingTemplate ? 'Edit Template' : 'New Template'}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Name
                      </label>
                      <input
                        type="text"
                        value={editingTemplate ? editingTemplate.name : newTemplate.name}
                        onChange={(e) => {
                          if (editingTemplate) {
                            setEditingTemplate({...editingTemplate, name: e.target.value})
                          } else {
                            setNewTemplate({...newTemplate, name: e.target.value})
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter template name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Description
                      </label>
                      <input
                        type="text"
                        value={editingTemplate ? editingTemplate.description : newTemplate.description}
                        onChange={(e) => {
                          if (editingTemplate) {
                            setEditingTemplate({...editingTemplate, description: e.target.value})
                          } else {
                            setNewTemplate({...newTemplate, description: e.target.value})
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter template description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={editingTemplate ? editingTemplate.category : newTemplate.category}
                        onChange={(e) => {
                          if (editingTemplate) {
                            setEditingTemplate({...editingTemplate, category: e.target.value})
                          } else {
                            setNewTemplate({...newTemplate, category: e.target.value})
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="listing">Property Listing</option>
                        <option value="email">Email Template</option>
                        <option value="social">Social Media</option>
                        <option value="video">Video Script</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template Content
                      </label>
                      <textarea
                        value={editingTemplate ? editingTemplate.content : newTemplate.content}
                        onChange={(e) => {
                          if (editingTemplate) {
                            setEditingTemplate({...editingTemplate, content: e.target.value})
                          } else {
                            setNewTemplate({...newTemplate, content: e.target.value})
                          }
                        }}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter template content..."
                      />
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={editingTemplate ? () => {
                          // Update existing template logic
                          handleSaveTemplate()
                          setEditingTemplate(null)
                        } : handleSaveTemplate}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>{editingTemplate ? 'Update Template' : 'Save Template'}</span>
                      </button>
                      
                      {editingTemplate && (
                        <button
                          onClick={() => setEditingTemplate(null)}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sync Tab */}
          {activeTab === 'sync' && (
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Cloud className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Sync</h3>
                  <p className="text-gray-500">
                    Sync your data across multiple devices to ensure data security and consistency
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Sync Status */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">Sync Status</h4>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        navigator.onLine 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {navigator.onLine ? 'Online' : 'Offline'}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync Time</span>
                        <span className="text-gray-900">
                          {lastSync ? lastSync.toLocaleString() : 'Never synced'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Sync Items</span>
                        <span className="text-gray-900">{stats.syncQueueLength} items</span>
                      </div>
                    </div>
                  </div>

                  {/* Sync Actions */}
                  <div className="space-y-4">
                    <button
                      onClick={handleSync}
                      disabled={syncing || !navigator.onLine}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCw className={`h-5 w-5 ${syncing ? 'animate-spin' : ''}`} />
                      <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleExport}
                        disabled={exporting || !isAuthenticated}
                        className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Download className="h-5 w-5" />
                        <span>{exporting ? 'Exporting...' : 'Export Data'}</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing || !isAuthenticated}
                        className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Upload className="h-5 w-5" />
                        <span>{importing ? 'Importing...' : 'Import Data'}</span>
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Storage Tab */}
          {activeTab === 'storage' && (
            <div className="p-6">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <Database className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Storage Management</h3>
                  <p className="text-gray-500">
                    View and manage your local storage usage
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Storage Stats */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Storage Statistics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats.itemCount}
                        </div>
                        <div className="text-sm text-gray-500">Stored Items</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {stats.formattedSize}
                        </div>
                        <div className="text-sm text-gray-500">Space Used</div>
                      </div>
                    </div>
                  </div>

                  {/* Storage Actions */}
                  <div className="space-y-4">
                    <button
                      onClick={handleCleanup}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span>Clean Expired Data</span>
                    </button>

                    <div className="text-center text-sm text-gray-500">
                      <p>Cleanup will delete expired data older than 30 days</p>
                      <p>Please export important data for backup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataManager