import React, { useState, useEffect } from 'react'
import { Search, Calendar, Eye, Heart, Share2, Tag, ArrowRight, Clock } from 'lucide-react'

const BlogPublic = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [selectedArticle, setSelectedArticle] = useState(null)

  const categories = ['all', 'Market Analysis', 'Buying Guide', 'Investment Strategy', 'Policy Interpretation', 'Industry News']

  useEffect(() => {
    fetchArticles()
  }, [currentPage, selectedCategory, searchTerm])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage,
        limit: 6,
        status: 'published'
      })
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
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

  const fetchArticleBySlug = async (slug) => {
    try {
      const response = await fetch(`/api/blog?slug=${slug}`)
      const data = await response.json()
      
      if (data.success) {
        setSelectedArticle(data.article)
      }
    } catch (error) {
      console.error('Error fetching article:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchArticles()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content) => {
    // 简单的Markdown渲染
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium mb-2 text-gray-700">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* SEO Meta Tags */}
        <head>
          <title>{selectedArticle.metaTitle}</title>
          <meta name="description" content={selectedArticle.metaDescription} />
          <meta name="keywords" content={selectedArticle.keywords} />
          <meta property="og:title" content={selectedArticle.metaTitle} />
          <meta property="og:description" content={selectedArticle.metaDescription} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={selectedArticle.metaTitle} />
          <meta name="twitter:description" content={selectedArticle.metaDescription} />
        </head>

        {/* 文章详情页 */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Article List
          </button>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {selectedArticle.featuredImage && (
              <img
                src={selectedArticle.featuredImage}
                alt={selectedArticle.title}
                className="w-full h-64 object-cover"
              />
            )}
            
            <div className="p-8">
              <div className="mb-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedArticle.publishDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedArticle.views} Views
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {selectedArticle.likes} Likes
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedArticle.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(selectedArticle.content) }}
              />

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <Heart className="w-4 h-4" />
                      Like ({selectedArticle.likes})
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share ({selectedArticle.shares})
                    </button>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    Category: {selectedArticle.category}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <head>
        <title>Real Estate News Blog - Professional Property Investment Guidance</title>
        <meta name="description" content="Providing the latest real estate market analysis, investment guidance and home buying advice to help you make informed property decisions" />
        <meta name="keywords" content="real estate,property investment,market analysis,buying guide,property trends" />
      </head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Real Estate News Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the latest real estate market trends, professional investment advice and practical home buying guides
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
            
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Article List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map(article => (
              <article
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => fetchArticleBySlug(article.slug)}
              >
                {article.featuredImage && (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(article.publishDate)}
                    <span className="mx-2">•</span>
                    <Eye className="w-4 h-4" />
                    {article.views}
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {article.category}
                    </span>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {article.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="w-4 h-4" />
                        {article.shares}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 分页 */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            
            <span className="px-4 py-2 text-gray-600">
              第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={!pagination.hasNext}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPublic