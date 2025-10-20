import { NextResponse } from 'next/server'

// Mock database storage
let articles = [
  {
    id: 1,
    title: '2024 Real Estate Market Trend Analysis',
    slug: '2024-real-estate-market-trends',
    excerpt: 'In-depth analysis of 2024 real estate market development trends, providing professional guidance for investors and homebuyers...',
    content: `# 2024 Real Estate Market Trend Analysis

## Market Overview

The 2024 real estate market presents new development trends, with market patterns undergoing profound changes due to multiple influencing factors.

### Key Trends

1. **Accelerated Digital Transformation**
   - Widespread adoption of virtual property viewing technology
   - AI-assisted property valuation
   - Optimized online transaction processes

2. **Sustainable Development as Priority**
   - Enhanced green building standards
   - Strengthened energy efficiency and environmental requirements
   - Deep integration of ESG investment concepts

3. **Differentiated Regional Development**
   - Steady growth in first-tier cities
   - Clear differentiation in second and third-tier cities
   - Emerging areas showing potential

## Investment Recommendations

Based on current market analysis, we recommend investors:

- Pay attention to policy directions and seize investment opportunities
- Focus on regional selection and avoid blind following
- Emphasize product quality and choose premium projects
- Allocate assets reasonably and diversify investment risks

## Conclusion

The 2024 real estate market presents both opportunities and challenges. Rational investment and professional analysis will be key to success.`,
    tags: ['Market Analysis', 'Investment Guidance', '2024 Trends'],
    category: 'Market Analysis',
    status: 'published',
    publishDate: '2024-01-15',
    views: 1250,
    likes: 89,
    shares: 23,
    metaTitle: '2024 Real Estate Market Trend Analysis - Professional Investment Guidance',
    metaDescription: 'Professional analysis of 2024 real estate market trends, providing investment advice and homebuying guidance',
    keywords: 'real estate market,investment analysis,2024 trends,property prices',
    featuredImage: '',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Complete Guide for First-Time Homebuyers',
    slug: 'first-time-buyer-complete-guide',
    excerpt: 'Providing complete guidance for first-time homebuyers from house hunting to transaction, avoiding common pitfalls...',
    content: `# Complete Guide for First-Time Homebuyers

## Pre-Purchase Preparation

### Financial Preparation
- Assess home buying budget
- Prepare down payment funds
- Understand loan policies
- Reserve funds for renovation and other expenses

### Needs Analysis
- Determine home buying purpose
- Choose suitable area
- Clarify housing type requirements
- Consider future planning

## House Hunting Tips

### Key Points for Site Inspection
1. **Location and Environment**
   - Transportation convenience
   - Surrounding amenities
   - Future development plans

2. **Property Quality**
   - Building structure inspection
   - Renovation quality assessment
   - Facility and equipment condition

3. **Legal Documents**
   - Property ownership certificate
   - Planning permits
   - Mortgage status

## Transaction Process

### Contract Signing Considerations
- Carefully read contract terms
- Clarify delivery standards
- Agree on breach of contract responsibilities
- Retain evidence materials

### Loan Application
- Choose suitable bank
- Prepare application materials
- Understand interest rate policies
- Plan timely repayment schedule

## Common Pitfalls

1. **Price Traps**
   - False discounts
   - Hidden fees
   - Price fraud

2. **Quality Issues**
   - Substandard construction
   - Environmental standards not met
   - Incomplete amenities

## Professional Advice

As a first-time homebuyer, we recommend:
- Compare multiple options and make rational decisions
- Seek help from professionals
- Fully understand market conditions
- Maintain a cautious attitude

Home buying is a major life decision that requires careful consideration of all factors to make the choice that best suits you.`,
    tags: ['Buying Guide', 'First-Time Buyers', 'Practical Tips'],
    category: 'Buying Guide',
    status: 'published',
    publishDate: '2024-01-10',
    views: 2100,
    likes: 156,
    shares: 45,
    metaTitle: 'Complete Guide for First-Time Homebuyers - Avoiding Property Pitfalls',
    metaDescription: 'Professional first-time homebuying guidance, complete process and considerations from viewing to transaction',
    keywords: 'first-time buying,buying guide,home purchase process,buying considerations',
    featuredImage: '',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  }
]

// GET - Get article list or single article
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const slug = searchParams.get('slug')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10

    // Get single article
    if (id) {
      const article = articles.find(a => a.id === parseInt(id))
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      
      // Increase view count
      article.views += 1
      
      return NextResponse.json({ success: true, article })
    }

    if (slug) {
      const article = articles.find(a => a.slug === slug)
      if (!article) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
      }
      
      // Increase view count
      article.views += 1
      
      return NextResponse.json({ success: true, article })
    }

    // Filter articles
    let filteredArticles = [...articles]

    if (status && status !== 'all') {
      filteredArticles = filteredArticles.filter(a => a.status === status)
    }

    if (category) {
      filteredArticles = filteredArticles.filter(a => a.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredArticles = filteredArticles.filter(a => 
        a.title.toLowerCase().includes(searchLower) ||
        a.excerpt.toLowerCase().includes(searchLower) ||
        a.content.toLowerCase().includes(searchLower) ||
        a.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Sort (newest first)
    filteredArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex)

    const totalPages = Math.ceil(filteredArticles.length / limit)

    return NextResponse.json({
      success: true,
      articles: paginatedArticles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles: filteredArticles.length,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 })
  }
}

// POST - Create new article
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and content are required' 
      }, { status: 400 })
    }

    // Generate slug
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Create new article
    const newArticle = {
      id: Date.now(),
      title: data.title,
      slug: slug,
      excerpt: data.excerpt || '',
      content: data.content,
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(tag => tag.trim()) : []),
      category: data.category || '',
      status: data.status || 'draft',
      publishDate: data.publishDate || new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      shares: 0,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || '',
      keywords: data.keywords || '',
      featuredImage: data.featuredImage || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    articles.unshift(newArticle)

    return NextResponse.json({ 
      success: true, 
      article: newArticle,
      message: 'Article created successfully' 
    })

  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 })
  }
}

// PUT - Update article
export async function PUT(request) {
  try {
    const data = await request.json()
    const { id } = data

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 })
    }

    const articleIndex = articles.findIndex(a => a.id === parseInt(id))
    if (articleIndex === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    // Update article
    const updatedArticle = {
      ...articles[articleIndex],
      ...data,
      id: parseInt(id),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(tag => tag.trim()) : articles[articleIndex].tags),
      updatedAt: new Date().toISOString()
    }

    articles[articleIndex] = updatedArticle

    return NextResponse.json({ 
      success: true, 
      article: updatedArticle,
      message: 'Article updated successfully' 
    })

  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 })
  }
}

// DELETE - Delete article
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 })
    }

    const articleIndex = articles.findIndex(a => a.id === parseInt(id))
    if (articleIndex === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    articles.splice(articleIndex, 1)

    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 })
  }
}