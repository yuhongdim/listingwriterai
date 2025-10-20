import { NextResponse } from 'next/server'

// Mock data storage (should use database in actual project)
const campaignData = new Map()
const emailEvents = new Map()

// GET method - Get campaign tracking data
export async function GET(request) {
  try {
    const { searchParams, pathname } = new URL(request.url)
    const pathSegments = pathname.split('/')
    const campaignId = pathSegments[pathSegments.length - 1]

    // Handle different types of tracking requests
    if (pathname.includes('/open')) {
      return handleOpenTracking(searchParams, campaignId)
    }
    
    if (pathname.includes('/click')) {
      return handleClickTracking(searchParams, campaignId)
    }

    // Get campaign statistics data
    if (campaignId && campaignId !== 'track-email') {
      return getCampaignStats(campaignId)
    }

    // Get all campaigns list
    return getAllCampaigns()

  } catch (error) {
    console.error('Email tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to get tracking data' },
      { status: 500 }
    )
  }
}

// POST method - Create tracking record
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
        { error: 'Missing required tracking parameters' },
        { status: 400 }
      )
    }

    // Record event
    await recordEmailEvent(campaignId, {
      eventType,
      email,
      timestamp,
      metadata
    })

    return NextResponse.json({
      success: true,
      message: 'Tracking event recorded successfully'
    })

  } catch (error) {
    console.error('Record tracking event error:', error)
    return NextResponse.json(
      { error: 'Failed to record tracking event' },
      { status: 500 }
    )
  }
}

// Handle email open tracking
async function handleOpenTracking(searchParams, campaignId) {
  const email = searchParams.get('email')
  
  if (!email || !campaignId) {
    return new NextResponse('Invalid parameters', { status: 400 })
  }

  // Record open event
  await recordEmailEvent(campaignId, {
    eventType: 'opened',
    email,
    timestamp: new Date().toISOString(),
    metadata: {
      userAgent: 'Email Client',
      ip: 'unknown'
    }
  })

  // Return 1x1 transparent pixel image
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

// Handle email click tracking
async function handleClickTracking(searchParams, campaignId) {
  const email = searchParams.get('email')
  const url = searchParams.get('url')
  
  if (!email || !campaignId || !url) {
    return NextResponse.redirect('/')
  }

  // Record click event
  await recordEmailEvent(campaignId, {
    eventType: 'clicked',
    email,
    timestamp: new Date().toISOString(),
    metadata: {
      clickedUrl: url,
      userAgent: 'Browser'
    }
  })

  // Redirect to original URL
  return NextResponse.redirect(url)
}

// Get campaign statistics data
async function getCampaignStats(campaignId) {
  const campaign = campaignData.get(campaignId)
  const events = emailEvents.get(campaignId) || []

  if (!campaign) {
    return NextResponse.json(
      { error: 'Campaign does not exist' },
      { status: 404 }
    )
  }

  // Calculate statistics data
  const stats = calculateCampaignStats(events, campaign)

  return NextResponse.json({
    success: true,
    campaignId,
    campaign,
    stats,
    events: events.slice(-100) // Return latest 100 events
  })
}

// Get all campaigns list
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

// Record email event
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

  // Keep event count within reasonable range
  if (events.length > 10000) {
    events.splice(0, events.length - 10000)
  }

  emailEvents.set(campaignId, events)
}

// Calculate campaign statistics data
function calculateCampaignStats(events, campaign) {
  const eventCounts = events.reduce((acc, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1
    return acc
  }, {})

  const sent = eventCounts.sent || 0
  const delivered = eventCounts.delivered || sent // If no delivered events, assume equal to sent
  const opened = eventCounts.opened || 0
  const clicked = eventCounts.clicked || 0
  const bounced = eventCounts.bounced || 0
  const unsubscribed = eventCounts.unsubscribed || 0

  // Calculate unique events (deduplicated)
  const uniqueOpens = new Set(
    events.filter(e => e.eventType === 'opened').map(e => e.email)
  ).size

  const uniqueClicks = new Set(
    events.filter(e => e.eventType === 'clicked').map(e => e.email)
  ).size

  // Calculate rates
  const deliveryRate = sent > 0 ? ((delivered / sent) * 100).toFixed(2) : '0.00'
  const openRate = delivered > 0 ? ((uniqueOpens / delivered) * 100).toFixed(2) : '0.00'
  const clickRate = delivered > 0 ? ((uniqueClicks / delivered) * 100).toFixed(2) : '0.00'
  const bounceRate = sent > 0 ? ((bounced / sent) * 100).toFixed(2) : '0.00'
  const unsubscribeRate = delivered > 0 ? ((unsubscribed / delivered) * 100).toFixed(2) : '0.00'

  // Timeline data (grouped by hour)
  const timeline = generateTimeline(events)

  // Top links
  const topLinks = getTopClickedLinks(events)

  // Device and client statistics
  const deviceStats = getDeviceStats(events)

  return {
    // Basic data
    sent,
    delivered,
    opened,
    clicked,
    bounced,
    unsubscribed,
    
    // Unique data
    uniqueOpens,
    uniqueClicks,
    
    // Ratios
    deliveryRate: parseFloat(deliveryRate),
    openRate: parseFloat(openRate),
    clickRate: parseFloat(clickRate),
    bounceRate: parseFloat(bounceRate),
    unsubscribeRate: parseFloat(unsubscribeRate),
    
    // Detailed analysis
    timeline,
    topLinks,
    deviceStats,
    
    // Campaign information
    totalRecipients: campaign?.totalRecipients || 0,
    campaignDuration: calculateCampaignDuration(events),
    lastActivity: events.length > 0 ? events[events.length - 1].timestamp : null
  }
}

// Generate timeline data
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

// Get top clicked links
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

// Get device statistics
function getDeviceStats(events) {
  const devices = {}
  
  events
    .filter(e => e.metadata?.userAgent)
    .forEach(event => {
      const userAgent = event.metadata.userAgent
      // Simplified device detection
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

// Calculate campaign duration
function calculateCampaignDuration(events) {
  if (events.length === 0) return 0
  
  const timestamps = events.map(e => new Date(e.timestamp).getTime())
  const start = Math.min(...timestamps)
  const end = Math.max(...timestamps)
  
  return end - start // milliseconds
}

// Utility functions
function generateEventId() {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Initialize some sample data (for demonstration)
function initializeSampleData() {
  const sampleCampaignId = 'campaign_sample_123'
  
  campaignData.set(sampleCampaignId, {
    campaignName: 'Sample Property Promotion Campaign',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    totalRecipients: 100
  })
  
  // Generate some sample events
  const sampleEvents = []
  for (let i = 0; i < 100; i++) {
    sampleEvents.push({
      id: `event_${i}`,
      eventType: 'sent',
      email: `user${i}@example.com`,
      timestamp: new Date(Date.now() - (100 - i) * 60 * 1000).toISOString(),
      recordedAt: new Date().toISOString()
    })
    
    // Simulate some opens and clicks
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

// Initialize sample data
initializeSampleData()

// PUT method - Update campaign information
export async function PUT(request) {
  try {
    const { campaignId, updates } = await request.json()
    
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }
    
    const campaign = campaignData.get(campaignId)
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }
    
    // Update campaign information
    campaignData.set(campaignId, { ...campaign, ...updates })
    
    return NextResponse.json({
      success: true,
      message: 'Campaign information updated successfully'
    })
    
  } catch (error) {
    console.error('Update campaign information error:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign information' },
      { status: 500 }
    )
  }
}