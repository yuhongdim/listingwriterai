import { NextResponse } from 'next/server'

// 模拟数据存储（实际项目中应该使用数据库）
const campaignData = new Map()
const emailEvents = new Map()

// GET方法 - 获取活动跟踪数据
export async function GET(request) {
  try {
    const { searchParams, pathname } = new URL(request.url)
    const pathSegments = pathname.split('/')
    const campaignId = pathSegments[pathSegments.length - 1]

    // 处理不同类型的跟踪请求
    if (pathname.includes('/open')) {
      return handleOpenTracking(searchParams, campaignId)
    }
    
    if (pathname.includes('/click')) {
      return handleClickTracking(searchParams, campaignId)
    }

    // 获取活动统计数据
    if (campaignId && campaignId !== 'track-email') {
      return getCampaignStats(campaignId)
    }

    // 获取所有活动列表
    return getAllCampaigns()

  } catch (error) {
    console.error('邮件跟踪错误:', error)
    return NextResponse.json(
      { error: '获取跟踪数据失败' },
      { status: 500 }
    )
  }
}

// POST方法 - 创建跟踪记录
export async function POST(request) {
  try {
    const { 
      campaignId,
      eventType, // sent, delivered, opened, clicked, bounced, unsubscribed
      email,
      timestamp = new Date().toISOString(),
      metadata = {}
    } = await request.json()

    if (!campaignId || !eventType || !email) {
      return NextResponse.json(
        { error: '缺少必要的跟踪参数' },
        { status: 400 }
      )
    }

    // 记录事件
    await recordEmailEvent(campaignId, {
      eventType,
      email,
      timestamp,
      metadata
    })

    return NextResponse.json({
      success: true,
      message: '跟踪事件记录成功'
    })

  } catch (error) {
    console.error('记录跟踪事件错误:', error)
    return NextResponse.json(
      { error: '记录跟踪事件失败' },
      { status: 500 }
    )
  }
}

// 处理邮件打开跟踪
async function handleOpenTracking(searchParams, campaignId) {
  const email = searchParams.get('email')
  
  if (!email || !campaignId) {
    return new NextResponse('Invalid parameters', { status: 400 })
  }

  // 记录打开事件
  await recordEmailEvent(campaignId, {
    eventType: 'opened',
    email,
    timestamp: new Date().toISOString(),
    metadata: {
      userAgent: 'Email Client',
      ip: 'unknown'
    }
  })

  // 返回1x1透明像素图片
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  )

  return new NextResponse(pixel, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': pixel.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  })
}

// 处理邮件点击跟踪
async function handleClickTracking(searchParams, campaignId) {
  const email = searchParams.get('email')
  const url = searchParams.get('url')
  
  if (!email || !campaignId || !url) {
    return NextResponse.redirect('/')
  }

  // 记录点击事件
  await recordEmailEvent(campaignId, {
    eventType: 'clicked',
    email,
    timestamp: new Date().toISOString(),
    metadata: {
      clickedUrl: url,
      userAgent: 'Browser'
    }
  })

  // 重定向到原始URL
  return NextResponse.redirect(url)
}

// 获取活动统计数据
async function getCampaignStats(campaignId) {
  const campaign = campaignData.get(campaignId)
  const events = emailEvents.get(campaignId) || []

  if (!campaign) {
    return NextResponse.json(
      { error: '活动不存在' },
      { status: 404 }
    )
  }

  // 计算统计数据
  const stats = calculateCampaignStats(events, campaign)

  return NextResponse.json({
    success: true,
    campaignId,
    campaign,
    stats,
    events: events.slice(-100) // 返回最近100个事件
  })
}

// 获取所有活动列表
async function getAllCampaigns() {
  const campaigns = Array.from(campaignData.entries()).map(([id, data]) => {
    const events = emailEvents.get(id) || []
    const stats = calculateCampaignStats(events, data)
    
    return {
      campaignId: id,
      campaignName: data.campaignName,
      createdAt: data.createdAt,
      status: data.status,
      totalRecipients: data.totalRecipients,
      stats: {
        sent: stats.sent,
        delivered: stats.delivered,
        opened: stats.opened,
        clicked: stats.clicked,
        openRate: stats.openRate,
        clickRate: stats.clickRate
      }
    }
  })

  return NextResponse.json({
    success: true,
    campaigns,
    totalCampaigns: campaigns.length
  })
}

// 记录邮件事件
async function recordEmailEvent(campaignId, event) {
  if (!emailEvents.has(campaignId)) {
    emailEvents.set(campaignId, [])
  }
  
  const events = emailEvents.get(campaignId)
  events.push({
    ...event,
    id: generateEventId(),
    recordedAt: new Date().toISOString()
  })

  // 保持事件数量在合理范围内
  if (events.length > 10000) {
    events.splice(0, events.length - 10000)
  }

  emailEvents.set(campaignId, events)
}

// 计算活动统计数据
function calculateCampaignStats(events, campaign) {
  const eventCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1
    return acc
  }, {})

  const sent = eventCounts.sent || 0
  const delivered = eventCounts.delivered || sent // 如果没有delivered事件，假设等于sent
  const opened = eventCounts.opened || 0
  const clicked = eventCounts.clicked || 0
  const bounced = eventCounts.bounced || 0
  const unsubscribed = eventCounts.unsubscribed || 0

  // 计算唯一事件（去重）
  const uniqueOpens = new Set(
    events.filter(e => e.eventType === 'opened').map(e => e.email)
  ).size

  const uniqueClicks = new Set(
    events.filter(e => e.eventType === 'clicked').map(e => e.email)
  ).size

  // 计算率
  const deliveryRate = sent > 0 ? ((delivered / sent) * 100).toFixed(2) : '0.00'
  const openRate = delivered > 0 ? ((uniqueOpens / delivered) * 100).toFixed(2) : '0.00'
  const clickRate = delivered > 0 ? ((uniqueClicks / delivered) * 100).toFixed(2) : '0.00'
  const bounceRate = sent > 0 ? ((bounced / sent) * 100).toFixed(2) : '0.00'
  const unsubscribeRate = delivered > 0 ? ((unsubscribed / delivered) * 100).toFixed(2) : '0.00'

  // 时间线数据（按小时分组）
  const timeline = generateTimeline(events)

  // 热门链接
  const topLinks = getTopClickedLinks(events)

  // 设备和客户端统计
  const deviceStats = getDeviceStats(events)

  return {
    // 基础数据
    sent,
    delivered,
    opened,
    clicked,
    bounced,
    unsubscribed,
    
    // 唯一数据
    uniqueOpens,
    uniqueClicks,
    
    // 比率
    deliveryRate: parseFloat(deliveryRate),
    openRate: parseFloat(openRate),
    clickRate: parseFloat(clickRate),
    bounceRate: parseFloat(bounceRate),
    unsubscribeRate: parseFloat(unsubscribeRate),
    
    // 详细分析
    timeline,
    topLinks,
    deviceStats,
    
    // 活动信息
    totalRecipients: campaign?.totalRecipients || 0,
    campaignDuration: calculateCampaignDuration(events),
    lastActivity: events.length > 0 ? events[events.length - 1].timestamp : null
  }
}

// 生成时间线数据
function generateTimeline(events) {
  const timeline = {}
  
  events.forEach(event => {
    const hour = new Date(event.timestamp).toISOString().slice(0, 13) + ':00:00.000Z'
    
    if (!timeline[hour]) {
      timeline[hour] = { sent: 0, opened: 0, clicked: 0 }
    }
    
    if (event.eventType === 'sent') timeline[hour].sent++
    if (event.eventType === 'opened') timeline[hour].opened++
    if (event.eventType === 'clicked') timeline[hour].clicked++
  })
  
  return Object.entries(timeline)
    .map(([time, data]) => ({ time, ...data }))
    .sort((a, b) => new Date(a.time) - new Date(b.time))
}

// 获取热门点击链接
function getTopClickedLinks(events) {
  const linkCounts = {}
  
  events
    .filter(e => e.eventType === 'clicked' && e.metadata?.clickedUrl)
    .forEach(event => {
      const url = event.metadata.clickedUrl
      linkCounts[url] = (linkCounts[url] || 0) + 1
    })
  
  return Object.entries(linkCounts)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

// 获取设备统计
function getDeviceStats(events) {
  const devices = {}
  
  events
    .filter(e => e.metadata?.userAgent)
    .forEach(event => {
      const userAgent = event.metadata.userAgent
      // 简化的设备检测
      let device = 'Unknown'
      if (userAgent.includes('Mobile')) device = 'Mobile'
      else if (userAgent.includes('Tablet')) device = 'Tablet'
      else if (userAgent.includes('Desktop')) device = 'Desktop'
      else if (userAgent.includes('Email Client')) device = 'Email Client'
      
      devices[device] = (devices[device] || 0) + 1
    })
  
  return Object.entries(devices)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count)
}

// 计算活动持续时间
function calculateCampaignDuration(events) {
  if (events.length === 0) return 0
  
  const timestamps = events.map(e => new Date(e.timestamp).getTime())
  const start = Math.min(...timestamps)
  const end = Math.max(...timestamps)
  
  return end - start // 毫秒
}

// 工具函数
function generateEventId() {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 初始化一些示例数据（用于演示）
function initializeSampleData() {
  const sampleCampaignId = 'campaign_sample_123'
  
  campaignData.set(sampleCampaignId, {
    campaignName: '示例房产推广活动',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    totalRecipients: 100
  })
  
  // 生成一些示例事件
  const sampleEvents = []
  for (let i = 0; i < 100; i++) {
    sampleEvents.push({
      id: `event_${i}`,
      eventType: 'sent',
      email: `user${i}@example.com`,
      timestamp: new Date(Date.now() - (100 - i) * 60 * 1000).toISOString(),
      recordedAt: new Date().toISOString()
    })
    
    // 模拟一些打开和点击
    if (i % 3 === 0) {
      sampleEvents.push({
        id: `event_open_${i}`,
        eventType: 'opened',
        email: `user${i}@example.com`,
        timestamp: new Date(Date.now() - (100 - i) * 60 * 1000 + 30000).toISOString(),
        recordedAt: new Date().toISOString(),
        metadata: { userAgent: 'Email Client' }
      })
    }
    
    if (i % 10 === 0) {
      sampleEvents.push({
        id: `event_click_${i}`,
        eventType: 'clicked',
        email: `user${i}@example.com`,
        timestamp: new Date(Date.now() - (100 - i) * 60 * 1000 + 60000).toISOString(),
        recordedAt: new Date().toISOString(),
        metadata: { 
          clickedUrl: 'https://example.com/property/123',
          userAgent: 'Desktop Browser'
        }
      })
    }
  }
  
  emailEvents.set(sampleCampaignId, sampleEvents)
}

// 初始化示例数据
initializeSampleData()

// PUT方法 - 更新活动信息
export async function PUT(request) {
  try {
    const { campaignId, updates } = await request.json()
    
    if (!campaignId) {
      return NextResponse.json(
        { error: '活动ID是必需的' },
        { status: 400 }
      )
    }
    
    const campaign = campaignData.get(campaignId)
    if (!campaign) {
      return NextResponse.json(
        { error: '活动不存在' },
        { status: 404 }
      )
    }
    
    // 更新活动信息
    campaignData.set(campaignId, { ...campaign, ...updates })
    
    return NextResponse.json({
      success: true,
      message: '活动信息更新成功'
    })
    
  } catch (error) {
    console.error('更新活动信息错误:', error)
    return NextResponse.json(
      { error: '更新活动信息失败' },
      { status: 500 }
    )
  }
}