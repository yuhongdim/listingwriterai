'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Globe, 
  Target,
  FileText,
  Save,
  X,
  Upload,
  Image,
  Link,
  Hash,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Share2
} from 'lucide-react'

const BlogManager = ({ usageCount, setUsageCount }) => {
  const [activeTab, setActiveTab] = useState('articles')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [showEditor, setShowEditor] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    category: '',
    status: 'draft',
    publishDate: new Date().toISOString().split('T')[0],
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    featuredImage: ''
  })

  const categories = ['Market Analysis', 'Buying Guide', 'Investment Strategy', 'Policy Interpretation', 'Industry News']
  const statuses = ['draft', 'published', 'archived']

  useEffect(() => {
    fetchArticles()
  }, [currentPage, selectedCategory, selectedStatus, searchTerm])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      })
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.articles)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }



  // Mock article data
  useEffect(() => {
    const mockArticles = [
      {
        id: 1,
        title: '2024 Real Estate Market Trend Analysis',
        excerpt: 'In-depth analysis of 2024 real estate market development trends, providing professional guidance for investors and homebuyers...',
        content: 'Complete article content...',
        tags: ['Market Analysis', 'Investment Guidance', '2024 Trends'],
        category: 'Market Analysis',
        status: 'published',
        publishDate: '2024-01-15',
        views: 1250,
        likes: 89,
        shares: 23,
        metaTitle: '2024 Real Estate Market Trend Analysis - Professional Investment Guidance',
        metaDescription: 'Professional analysis of 2024 real estate market trends, providing investment advice and homebuying guidance',
        keywords: 'real estate market,investment analysis,2024 trends,property prices'
      },
      {
        id: 2,
        title: 'Complete Guide for First-Time Homebuyers',
        excerpt: 'Providing complete guidance for first-time homebuyers from house hunting to transaction, avoiding common pitfalls...',
        content: 'Complete article content...',
        tags: ['Buying Guide', 'First-Time Buyers', 'Practical Tips'],
        category: 'Buying Guide',
        status: 'published',
        publishDate: '2024-01-10',
        views: 2100,
        likes: 156,
        shares: 45,
        metaTitle: 'Complete Guide for First-Time Homebuyers - Avoiding Property Pitfalls',
        metaDescription: 'Professional first-time homebuying guidance, complete process and considerations from viewing to transaction',
        keywords: 'first-time buying,buying guide,home purchase process,buying considerations'
      },
      {
        id: 3,
        title: 'Real Estate Investment Return Calculation Methods',
        excerpt: 'Detailed introduction to calculation methods and evaluation standards for real estate investment returns...',
        content: 'Complete article content...',
        tags: ['Investment Returns', 'Calculation Methods', 'Investment Evaluation'],
        category: 'Investment Analysis',
        status: 'draft',
        publishDate: '2024-01-20',
        views: 0,
        likes: 0,
        shares: 0,
        metaTitle: 'Real Estate Investment Return Calculation - Professional Investment Evaluation',
        metaDescription: 'Learn real estate investment return calculation methods to make informed investment decisions',
        keywords: 'investment returns,real estate investment,investment calculation,yield evaluation'
      }
    ]
    setArticles(mockArticles)
  }, [])

  const handleSaveArticle = async () => {
    try {
      setIsLoading(true)
      
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      let response
      if (editingArticle) {
        // Update existing article
      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...articleData, id: editingArticle.id })
      })
    } else {
      // Create new article
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articleData)
      })
    }

    const data = await response.json()

    if (data.success) {
      await fetchArticles() // Refresh article list
      resetForm()
      setEditingArticle(null)
      setShowForm(false)
      // Success notification can be added here
    } else {
      console.error('Save failed:', data.error)
      // Error notification can be added here
    }
  } catch (error) {
    console.error('Error saving article:', error)
    // Error notification can be added here
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    
    try {
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchArticles() // Refresh article list
        // Success notification can be added here
      } else {
        console.error('Delete failed:', data.error)
        // Error notification can be added here
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      // Error notification can be added here
    }
  }

  const handleEditArticle = (article) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags,
      category: article.category,
      status: article.status,
      publishDate: article.publishDate,
      metaTitle: article.metaTitle || article.title,
      metaDescription: article.metaDescription || article.excerpt,
      keywords: article.keywords || '',
      featuredImage: article.featuredImage || ''
    })
    setShowEditor(true)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedStatus === 'all' || article.status === selectedStatus
    return matchesSearch && matchesFilter
  })

  const tabs = [
    { id: 'articles', label: 'Article Management', icon: FileText },
    { id: 'seo', label: 'SEO Optimization', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ]

  if (showEditor) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingArticle ? 'Edit Article' : 'Publish New Article'}
          </h1>
          <button
            onClick={() => {
              setShowEditor(false)
              setEditingArticle(null)
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main editing area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter an engaging article title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Abstract
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Briefly describe article content, used in search results and social sharing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={15}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Here input your article content..."
                  />
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-green-600" />
                SEO Optimization Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optimized page title (recommended 50-60 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current length: {formData.metaTitle.length}/60
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Page description for search results display (recommended 150-160 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current length: {formData.metaDescription.length}/160
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Separate keywords with commas, e.g.: real estate,investment,market analysis"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            {/* Publishing Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Publishing Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publishing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => handleInputChange('publishDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    <option value="Market Analysis">Market Analysis</option>
                    <option value="Buying Guide">Buying Guide</option>
                    <option value="Investment Analysis">Investment Analysis</option>
                    <option value="Policy Interpretation">Policy Interpretation</option>
                    <option value="Industry News">Industry News</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Separate tags with commas"
                  />

                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="space-y-3">
                <button
                  onClick={handleSaveArticle}
                  disabled={isLoading || !formData.title || !formData.content}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingArticle ? 'Update Article' : 'Publish Article'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleInputChange('status', 'draft')}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management Center</h1>
        <p className="text-gray-600">Manage your article content, optimize SEO, and improve website ranking</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowEditor(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Publish New Article
              </button>
            </div>
          </div>

          {/* Article List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Article
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category/Tags
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publish Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {article.excerpt.substring(0, 100)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{article.category}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Array.isArray(article.tags) ? article.tags.slice(0, 2).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          )) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {article.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {article.status === 'draft' && <Clock className="h-3 w-3 mr-1" />}
                          {article.status === 'scheduled' && <Calendar className="h-3 w-3 mr-1" />}
                          {article.status === 'published' ? 'Published' : 
                           article.status === 'draft' ? 'Draft' : 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {article.views}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {article.likes}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.publishDate}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">SEO Optimization Suggestions</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Well Optimized</span>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• All articles have meta descriptions</li>
                    <li>• Title length is appropriate</li>
                    <li>• Relevant keywords are used</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Needs Improvement</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Some articles lack alt tags</li>
                    <li>• Internal linking needs improvement</li>
                    <li>• Keyword density can be optimized</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">3,350</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">↗ +12% This Month</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Article Count</p>
                  <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">↗ +3 This Month</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Shares</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Share2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">↗ +8% This Month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogManager