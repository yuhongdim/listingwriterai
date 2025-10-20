import { NextResponse } from 'next/server'

// 模拟数据存储 - 在实际项目中应该使用数据库
let articles = []

// 初始化一些示例文章（与主API保持一致）
if (articles.length === 0) {
  articles = [
    {
      id: '1',
      title: '西安产业地产人工智能平台第一期——房地产，房地产市场现状。',
      excerpt: '深入分析2024年西安产业地产市场趋势，为投资者提供专业的市场洞察和投资建议。',
      content: `
        <h2>市场概况</h2>
        <p>2024年西安产业地产市场呈现出稳中有进的发展态势。随着国家政策的持续支持和地方经济的快速发展，西安产业地产市场迎来了新的发展机遇。</p>
        
        <h2>主要趋势</h2>
        <p>1. <strong>政策驱动</strong>：政府出台了一系列支持产业地产发展的政策，为市场注入了新的活力。</p>
        <p>2. <strong>需求增长</strong>：随着产业升级和企业扩张，对高品质产业地产的需求持续增长。</p>
        <p>3. <strong>区域分化</strong>：不同区域的产业地产市场表现出明显的分化特征。</p>
        
        <h2>投资建议</h2>
        <p>对于投资者而言，建议关注以下几个方面：</p>
        <ul>
          <li>选择具有良好产业基础的区域</li>
          <li>关注政策导向和规划布局</li>
          <li>重视项目的长期发展潜力</li>
        </ul>
        
        <h2>未来展望</h2>
        <p>展望未来，西安产业地产市场有望继续保持稳定增长，为投资者提供良好的投资机会。</p>
      `,
      category: 'Market Analysis',
      tags: ['市场分析', '投资建议', '西安地产'],
      status: 'published',
      publishDate: '2024-10-20',
      createdAt: '2024-10-20T10:00:00Z',
      views: 1250,
      likes: 89,
      metaTitle: '2024年西安产业地产市场分析报告',
      metaDescription: '深入分析2024年西安产业地产市场趋势，为投资者提供专业的市场洞察和投资建议。',
      keywords: '西安地产,产业地产,市场分析,投资建议'
    },
    {
      id: '2',
      title: '2024年西安产业地产投资分析',
      excerpt: '全面解析2024年西安产业地产投资机会，为投资者提供专业的投资策略建议。',
      content: `
        <h2>投资环境分析</h2>
        <p>2024年西安产业地产投资环境持续优化，政策支持力度加大，市场前景广阔。</p>
        
        <h2>重点投资区域</h2>
        <p>1. <strong>高新区</strong>：科技产业集聚，发展潜力巨大</p>
        <p>2. <strong>经开区</strong>：制造业基础雄厚，配套设施完善</p>
        <p>3. <strong>浐灞生态区</strong>：生态环境优美，新兴产业发展迅速</p>
        
        <h2>投资策略</h2>
        <p>建议投资者采用多元化投资策略，分散风险，提高收益。</p>
      `,
      category: 'Investment Strategy',
      tags: ['投资策略', '西安地产', '产业分析'],
      status: 'published',
      publishDate: '2024-11-15',
      createdAt: '2024-11-15T14:30:00Z',
      views: 2100,
      likes: 156,
      metaTitle: '2024年西安产业地产投资策略分析',
      metaDescription: '全面解析2024年西安产业地产投资机会，为投资者提供专业的投资策略建议。',
      keywords: '西安投资,产业地产投资,投资策略,地产分析'
    },
    {
      id: '3',
      title: '房地产市场新政策解读',
      excerpt: '详细解读最新房地产政策，分析对市场的影响和投资机会。',
      content: `
        <h2>政策背景</h2>
        <p>近期出台的房地产新政策旨在促进市场健康发展，保障民生需求。</p>
        
        <h2>主要内容</h2>
        <p>1. <strong>调控措施</strong>：完善房地产调控机制</p>
        <p>2. <strong>金融支持</strong>：优化房地产金融服务</p>
        <p>3. <strong>供应保障</strong>：增加住房供应</p>
        
        <h2>市场影响</h2>
        <p>新政策的实施将对房地产市场产生积极影响，促进市场稳定发展。</p>
      `,
      category: 'Policy Interpretation',
      tags: ['政策解读', '房地产政策', '市场影响'],
      status: 'published',
      publishDate: '2024-11-10',
      createdAt: '2024-11-10T09:15:00Z',
      views: 1850,
      likes: 123,
      metaTitle: '最新房地产政策解读与市场影响分析',
      metaDescription: '详细解读最新房地产政策，分析对市场的影响和投资机会。',
      keywords: '房地产政策,政策解读,市场影响,投资机会'
    }
  ]
}

export async function POST(request, { params }) {
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

    // 增加浏览量
    articles[articleIndex].views = (articles[articleIndex].views || 0) + 1

    return NextResponse.json({
      success: true,
      views: articles[articleIndex].views
    })

  } catch (error) {
    console.error('Error updating article views:', error)
    return NextResponse.json({ success: false, error: 'Failed to update views' }, { status: 500 })
  }
}