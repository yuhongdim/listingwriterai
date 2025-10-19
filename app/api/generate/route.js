import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { propertyType, bedrooms, bathrooms, squareFeet, location, specialFeatures, writingStyle } = body

    // 验证必填字段
    if (!propertyType || !bedrooms || !bathrooms || !squareFeet || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 构建提示词
    const stylePrompts = {
      Professional: '专业、客观、突出实用性和投资价值',
      Luxury: '奢华、精致、强调高端品质和独特性',
      Modern: '现代、简洁、突出时尚设计和便利性'
    }

    const prompt = `请为以下房产生成一个吸引人的房源描述：

房产信息：
- 类型：${propertyType}
- 卧室：${bedrooms}间
- 浴室：${bathrooms}间
- 面积：${squareFeet}平方英尺
- 位置：${location}
${specialFeatures ? `- 特色：${specialFeatures}` : ''}

要求：
- 风格：${stylePrompts[writingStyle] || stylePrompts.Professional}
- 字数：150-200词
- 符合Fair Housing Act规定，不涉及歧视性语言
- 突出房产优势和卖点
- 语言生动有吸引力
- 适合在房产网站和社交媒体使用

请直接返回房源描述内容，不需要其他说明。`

    // 调用 Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })

    if (!anthropicResponse.ok) {
      console.error('Anthropic API error:', anthropicResponse.status, anthropicResponse.statusText)
      
      // 如果 API 调用失败，返回模拟内容
      const mockContent = generateMockContent(body)
      return NextResponse.json({ content: mockContent })
    }

    const anthropicData = await anthropicResponse.json()
    const generatedContent = anthropicData.content[0].text

    return NextResponse.json({ content: generatedContent })

  } catch (error) {
    console.error('API Error:', error)
    
    // 错误时返回模拟内容
    const mockContent = generateMockContent(body)
    return NextResponse.json({ content: mockContent })
  }
}

// 生成模拟内容的函数（用于演示或 API 失败时）
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