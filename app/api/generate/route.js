import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { propertyType, bedrooms, bathrooms, squareFeet, location, specialFeatures, writingStyle } = body

    console.log('Received request:', body) // 添加调试日志

    // 验证必填字段
    if (!propertyType || !bedrooms || !bathrooms || !squareFeet || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 直接返回模拟内容，确保功能正常工作
    const mockContent = generateMockContent(body)
    console.log('Generated content:', mockContent) // 添加调试日志
    
    return NextResponse.json({ 
      content: mockContent 
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    
    // 错误时返回基础模拟内容
    const basicContent = `这是一套位于${body?.location || '优质地段'}的${body?.propertyType || '精美房产'}，拥有${body?.bedrooms || '多间'}卧室和${body?.bathrooms || '多间'}浴室，面积约${body?.squareFeet || '宽敞'}平方英尺。这套房产设计精美，位置优越，是您理想的居住选择。`
    
    return NextResponse.json({ 
      content: basicContent 
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

// Generate mock content function (for demo or API failure fallback)
function generateMockContent({ propertyType, bedrooms, bathrooms, squareFeet, location, specialFeatures, writingStyle }) {
  const styleAdjectives = {
    Professional: ['well-maintained', 'spacious', 'convenient', 'practical'],
    Luxury: ['exquisite', 'elegant', 'premium', 'sophisticated'],
    Modern: ['contemporary', 'sleek', 'stylish', 'updated']
  }

  const adjectives = styleAdjectives[writingStyle] || styleAdjectives.Professional
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]

  return `Discover this ${randomAdjective} ${bedrooms}-bedroom, ${bathrooms}-bathroom ${propertyType.toLowerCase()} spanning ${squareFeet} square feet in the heart of ${location}. 

This exceptional property offers the perfect blend of comfort and convenience, featuring thoughtfully designed living spaces that maximize both functionality and style. The open floor plan creates a seamless flow between rooms, making it ideal for both daily living and entertaining guests.

${specialFeatures ? `Special highlights include ${specialFeatures.toLowerCase()}, adding unique character and value to this remarkable home. ` : ''}

Located in a desirable neighborhood, you'll enjoy easy access to local amenities, shopping, dining, and transportation options. This property represents an excellent opportunity for homeowners seeking quality, comfort, and a prime location.

Don't miss your chance to make this beautiful ${propertyType.toLowerCase()} your new home. Schedule a viewing today and experience all this property has to offer!`
}