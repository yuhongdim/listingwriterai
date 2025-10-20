'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Tag, Eye, Share2, Clock } from 'lucide-react'

export default function BlogArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id)
    }
  }, [params.id])

  const fetchArticle = async (id) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/blog/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setArticle(data.article)
        // 增加浏览量
        await fetch(`/api/blog/${id}/view`, { method: 'POST' })
      } else {
        setError(data.error || 'Article not found')
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
      alert('链接已复制到剪贴板')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(article.publishDate || article.createdAt).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {article.views || 0} 次浏览
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                约 {Math.ceil(article.content.length / 500)} 分钟阅读
              </div>
            </div>
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Share Button */}
            <div className="mt-6">
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Share2 className="h-4 w-4 mr-2" />
                分享文章
              </button>
            </div>
          </div>
          
          {/* Article Body */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
            />
          </div>
          
          {/* SEO Meta (if available) */}
          {(article.metaTitle || article.metaDescription || article.keywords) && (
            <div className="p-8 bg-gray-50 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO 信息</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {article.metaTitle && (
                  <div>
                    <span className="font-medium">Meta 标题:</span> {article.metaTitle}
                  </div>
                )}
                {article.metaDescription && (
                  <div>
                    <span className="font-medium">Meta 描述:</span> {article.metaDescription}
                  </div>
                )}
                {article.keywords && (
                  <div>
                    <span className="font-medium">关键词:</span> {article.keywords}
                  </div>
                )}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}