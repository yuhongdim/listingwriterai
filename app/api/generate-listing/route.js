import { NextResponse } from 'next/server'
import aiClient from '../../utils/aiClient'

export async function POST(request) {
  try {
    const { 
      propertyType, 
      location, 
      bedrooms, 
      bathrooms, 
      squareFeet, 
      specialFeatures,
      style = 'professional',
      targetAudience = 'general',
      keyFeatures = [],
      priceRange = '',
      neighborhood = ''
    } = await request.json()

    // 验证必填字段
    if (!propertyType || !location) {
      return NextResponse.json(
        { error: '房产类型和位置为必填项' },
        { status: 400 }
      )
    }

    try {
      // 使用AI客户端生成房源描述
      const result = await aiClient.generateListing({
        propertyType, 
        location, 
        bedrooms, 
        bathrooms, 
        squareFeet, 
        specialFeatures,
        style,
        targetAudience,
        keyFeatures,
        priceRange,
        neighborhood
      })

      return NextResponse.json({
        success: true,
        description: result.content,
        usage: result.usage,
        model: result.model,
        metadata: {
          propertyType,
          location,
          style,
          targetAudience
        }
      })

    } catch (apiError) {
      console.error('AI API调用失败:', apiError)
      // API失败时返回模拟描述
      return generateMockListing({
        propertyType, location, bedrooms, bathrooms, squareFeet, 
        specialFeatures, style, targetAudience, keyFeatures, priceRange, neighborhood
      })
    }

  } catch (error) {
    console.error('房源描述生成错误:', error)
    return NextResponse.json(
      { error: '描述生成失败，请重试' },
      { status: 500 }
    )
  }
}

// 生成模拟房源描述的函数
function generateMockListing({
  propertyType, location, bedrooms, bathrooms, squareFeet, 
  specialFeatures, style, targetAudience, keyFeatures, priceRange, neighborhood
}) {
  const mockDescriptions = {
    apartment: `精美${bedrooms}室${bathrooms}卫公寓，位于${location}黄金地段。面积${squareFeet}平方米，${specialFeatures}。现代化装修，生活便利，交通便捷。`,
    house: `独栋别墅，${bedrooms}室${bathrooms}卫，坐落于${location}优质社区。建筑面积${squareFeet}平方米，${specialFeatures}。私人花园，停车位充足。`,
    condo: `豪华公寓，${bedrooms}室${bathrooms}卫，${location}核心位置。面积${squareFeet}平方米，${specialFeatures}。物业管理完善，配套设施齐全。`,
    townhouse: `联排别墅，${bedrooms}室${bathrooms}卫，位于${location}宁静社区。面积${squareFeet}平方米，${specialFeatures}。独立入户，私密性佳。`
  }

  const description = mockDescriptions[propertyType] || `优质房产，${bedrooms}室${bathrooms}卫，位于${location}。面积${squareFeet}平方米，${specialFeatures}。`

  return NextResponse.json({
    success: true,
    description: description,
    metadata: {
      propertyType,
      location,
      style,
      targetAudience,
      generated: 'mock'
    }
  })
}

// 模拟AI内容生成函数
async function generateListingContent(prompt, propertyData) {
  // 这里应该调用实际的AI API（如OpenAI、Claude等）
  // 现在返回模拟内容
  
  const { propertyType, location, bedrooms, bathrooms, squareFeet, specialFeatures, writingStyle, priceRange, listingType } = propertyData
  
  const templates = {
    'Professional': {
      title: `精品${propertyType} | ${location}核心地段 | ${bedrooms}室${bathrooms}卫`,
      content: `
🏡 **房产亮点**
这套位于${location}的${propertyType}，建筑面积${squareFeet || '宽敞'}平方英尺，${bedrooms}室${bathrooms}卫的合理布局，为您提供舒适的居住体验。

🌟 **核心特色**
${specialFeatures ? `• ${specialFeatures.split(',').join('\n• ')}` : '• 精装修，拎包入住\n• 采光充足，通风良好\n• 交通便利，配套完善'}

📍 **位置优势**
${location}地段优越，周边配套设施完善，交通便利，是理想的${listingType === 'sale' ? '投资置业' : '租住'}选择。

💰 **投资价值**
${priceRange ? `价格：${priceRange}` : '价格面议'}，性价比极高，升值潜力巨大。

📞 **联系我们**
欢迎预约看房，更多详情请联系我们的专业顾问团队。
      `
    },
    'Luxury': {
      title: `奢华${propertyType} | ${location}顶级社区 | 尊贵生活典范`,
      content: `
✨ **奢华典范**
坐落于${location}的这套顶级${propertyType}，${bedrooms}室${bathrooms}卫的宽敞格局，${squareFeet ? `${squareFeet}平方英尺` : '超大'}的奢华空间，诠释着品质生活的真谛。

🏆 **尊贵特色**
${specialFeatures ? `• ${specialFeatures.split(',').join('\n• ')}` : '• 顶级装修材料，工艺精湛\n• 智能家居系统，科技便捷\n• 私人花园/阳台，景观优美'}

🌆 **黄金地段**
${location}作为城市核心区域，汇聚了最优质的教育、医疗、购物资源，彰显居住者的尊贵身份。

💎 **稀缺价值**
${priceRange ? `售价：${priceRange}` : '价格私洽'}，限量珍藏，机不可失。

🤝 **专属服务**
提供VIP看房服务，专业置业顾问全程陪同，为您量身定制置业方案。
      `
    }
  }

  const template = templates[writingStyle] || templates['Professional']
  
  return `${template.title}\n\n${template.content.trim()}`
}

// GET方法用于获取API信息
export async function GET() {
  return NextResponse.json({
    name: '房源文案生成API',
    version: '1.0.0',
    description: '根据房产信息生成专业的营销文案',
    endpoints: {
      POST: {
        description: '生成房源文案',
        parameters: {
          required: ['propertyType', 'location'],
          optional: ['bedrooms', 'bathrooms', 'squareFeet', 'specialFeatures', 'writingStyle', 'contentLength', 'targetKeywords', 'priceRange', 'yearBuilt', 'listingType']
        }
      }
    }
  })
}