'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, 
  User, 
  Tag, 
  Eye, 
  Share2, 
  Search,
  Filter,
  ArrowRight,
  Clock,
  TrendingUp
} from 'lucide-react'

const BlogPublic = () => {
  const [articles, setArticles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟文章数据
  const mockArticles = [
    {
      id: 1,
      title: "2024 Real Estate Market Trend Analysis",
      excerpt: "In-depth analysis of the 2024 real estate market trends, including price movements, supply and demand changes, and investment opportunities.",
      content: "The 2024 real estate market shows complex characteristics...",
      author: "Zhang Wei",
      publishDate: "2024-01-15",
      category: "Market Analysis",
      tags: ["Market Trends", "Investment", "Data Analysis"],
      views: 1250,
      shares: 89,
      readTime: 8
    },
    {
      id: 2,
      title: "Complete Guide for First-Time Home Buyers",
      excerpt: "A comprehensive guide covering everything first-time buyers need to know, from budget planning to closing procedures.",
      content: "Buying your first home is an important milestone in life...",
      author: "Li Ming",
      publishDate: "2024-01-12",
      category: "Buying Guide",
      tags: ["First-Time Buyer", "Home Purchase", "Financial Planning"],
      views: 2100,
      shares: 156,
      readTime: 12
    },
    {
      id: 3,
      title: "Commercial Real Estate Investment Strategies",
      excerpt: "Explore different commercial real estate investment strategies and how to choose the right investment approach for your portfolio.",
      content: "Commercial real estate investment is a complex field...",
      author: "Wang Fang",
      publishDate: "2024-01-10",
      category: "Investment Analysis",
      tags: ["Commercial Real Estate", "Investment Strategy", "Portfolio Management"],
      views: 890,
      shares: 67,
      readTime: 10
    },
    {
      id: 4,
      title: "Impact of New Housing Policies on the Market",
      excerpt: "Analysis of how recent housing policy changes will affect market dynamics and what buyers and sellers should know.",
      content: "Recent policy changes have significant implications...",
      author: "Chen Hao",
      publishDate: "2024-01-08",
      category: "Policy Analysis",
      tags: ["Housing Policy", "Market Impact", "Regulatory Changes"],
      views: 1580,
      shares: 123,
      readTime: 6
    },
    {
      id: 5,
      title: "Real Estate Technology Innovation Trends",
      excerpt: "Explore the latest technology innovations in real estate, from virtual tours to AI-powered property valuation.",
      content: "Technology is revolutionizing the real estate industry...",
      author: "Liu Jing",
      publishDate: "2024-01-05",
      category: "Industry News",
      tags: ["PropTech", "Innovation", "Digital Transformation"],
      views: 950,
      shares: 78,
      readTime: 7
    },
    {
      id: 6,
      title: "Regional Market Analysis: Tier-1 Cities vs Tier-2 Cities",
      excerpt: "Comparative analysis of real estate markets in tier-1 and tier-2 cities, including price trends and investment potential.",
      content: "The real estate markets in different city tiers show distinct characteristics...",
      author: "Zhao Lei",
      publishDate: "2024-01-03",
      category: "Market Analysis",
      tags: ["Regional Analysis", "City Comparison", "Market Segmentation"],
      views: 1320,
      shares: 94,
      readTime: 9
    }
  ]

  // 文章分类
  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'market', label: 'Market Analysis' },
    { id: 'guide', label: 'Buying Guide' },
    { id: 'investment', label: 'Investment Analysis' },
    { id: 'policy', label: 'Policy Analysis' },
    { id: 'news', label: 'Industry News' }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const articlesPerPage = 6
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Real Estate Intelligence Blog
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get the latest real estate market insights, investment advice, and industry trend analysis
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setCurrentPage(1)
                }}
                className={`px-6 py-3 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } border border-gray-200`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {currentArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentArticles.map(article => (
              <article key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Article Image */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Article Image</p>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {article.readTime} min read
                    </div>
                  </div>
                  
                  {/* Article Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {article.title}
                  </h2>
                  
                  {/* Article Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Article Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {article.publishDate}
                    </div>
                  </div>
                  
                  {/* Statistics */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="h-4 w-4 mr-1" />
                        {article.shares}
                      </div>
                    </div>
                    
                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                      Read More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search keywords or selecting a different category</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPublic