import { NextResponse } from 'next/server'

// Mock data storage - should use database in real project
let articles = []

// Initialize sample articles
if (articles.length === 0) {
  articles = [
    {
      id: '1',
      title: '2024 Real Estate Market Investment Strategy Analysis',
      excerpt: 'Comprehensive analysis of 2024 real estate market trends, providing professional investment insights and strategic recommendations for investors.',
      content: `
        <h2>Market Overview</h2>
        <p>The 2024 real estate market shows steady growth momentum. With continued policy support and rapid economic development, the real estate market is experiencing new opportunities.</p>
        
        <h2>Key Trends</h2>
        <p>1. <strong>Policy Support</strong>: Government has introduced a series of policies supporting real estate development, injecting new vitality into the market.</p>
        <p>2. <strong>Growing Demand</strong>: With industrial upgrades and business expansion, demand for high-quality real estate continues to grow.</p>
        <p>3. <strong>Regional Differentiation</strong>: Different regions show distinct characteristics in real estate market performance.</p>
        
        <h2>Investment Recommendations</h2>
        <p>For investors, we recommend focusing on the following aspects:</p>
        <ul>
          <li>Choose regions with solid industrial foundations</li>
          <li>Pay attention to policy directions and planning layouts</li>
          <li>Focus on long-term development potential of projects</li>
        </ul>
        
        <h2>Future Outlook</h2>
        <p>Looking ahead, the real estate market is expected to maintain stable growth, providing good investment opportunities for investors.</p>
      `,
      category: 'Investment Strategy',
      tags: ['Investment', 'Strategy', 'Real Estate'],
      status: 'published',
      publishDate: '2024-11-15',
      createdAt: '2024-11-15T10:00:00Z',
      views: 2100,
      likes: 156,
      metaTitle: '2024 Real Estate Market Investment Strategy Analysis',
      metaDescription: 'Comprehensive analysis of 2024 real estate market trends, providing professional investment insights and strategic recommendations.',
      keywords: 'real estate, investment, market analysis, strategy'
    },
    {
      id: '2',
      title: 'Real Estate Policy Interpretation Guide',
      excerpt: 'Detailed analysis of current real estate policies and their impact on market dynamics and investment decisions.',
      content: `
        <h2>Investment Environment Analysis</h2>
        <p>The 2024 real estate investment environment continues to optimize with increased policy support and broad market prospects.</p>
        
        <h2>Key Investment Areas</h2>
        <p>1. <strong>High-tech Zone</strong>: Technology industry cluster with enormous development potential</p>
        <p>2. <strong>Economic Development Zone</strong>: Strong manufacturing foundation with complete supporting facilities</p>
        <p>3. <strong>Ecological Zone</strong>: Beautiful ecological environment with rapid emerging industry development</p>
        
        <h2>Investment Strategy</h2>
        <p>We recommend investors adopt diversified investment strategies to spread risks and improve returns.</p>
      `,
      category: 'Policy Interpretation',
      tags: ['Policy', 'Real Estate', 'Analysis'],
      status: 'published',
      publishDate: '2024-11-10',
      createdAt: '2024-11-10T14:30:00Z',
      views: 1850,
      likes: 123,
      metaTitle: 'Real Estate Policy Interpretation Guide',
      metaDescription: 'Detailed analysis of current real estate policies and their impact on market dynamics and investment decisions.',
      keywords: 'real estate policy, policy interpretation, market impact, investment'
    },
    {
      id: '3',
      title: 'Market Trends and Future Outlook',
      excerpt: 'Comprehensive analysis of current market trends and future development prospects in the real estate sector.',
      content: `
        <h2>Current Market Trends</h2>
        <p>The current real estate market shows several key trends that investors should be aware of.</p>
        
        <h2>Key Developments</h2>
        <p>1. <strong>Digital Transformation</strong>: Technology integration in real estate operations</p>
        <p>2. <strong>Sustainable Development</strong>: Growing focus on green building practices</p>
        <p>3. <strong>Market Consolidation</strong>: Industry consolidation and professional management</p>
        
        <h2>Future Prospects</h2>
        <p>The market outlook remains positive with continued growth expected in key segments.</p>
      `,
      category: 'Market Analysis',
      tags: ['Market Trends', 'Future Outlook', 'Analysis'],
      status: 'published',
      publishDate: '2024-11-05',
      createdAt: '2024-11-05T09:15:00Z',
      views: 1650,
      likes: 98,
      metaTitle: 'Real Estate Market Trends and Future Outlook Analysis',
      metaDescription: 'Comprehensive analysis of current market trends and future development prospects in the real estate sector.',
      keywords: 'market trends, future outlook, real estate analysis, market prospects'
    }
  ]
}

export async function GET(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 })
    }

    // 查找文章
    const article = articles.find(a => a.id === id)
    
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      article
    })

  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch article' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 })
    }

    // 查找文章索引
    const articleIndex = articles.findIndex(a => a.id === id)
    
    if (articleIndex === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    // 更新文章
    articles[articleIndex] = {
      ...articles[articleIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      article: articles[articleIndex]
    })

  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 })
    }

    // 查找文章索引
    const articleIndex = articles.findIndex(a => a.id === id)
    
    if (articleIndex === -1) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    // 删除文章
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