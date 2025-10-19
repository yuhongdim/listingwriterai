import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { 
      propertyType, 
      bedrooms, 
      bathrooms, 
      squareFeet, 
      location, 
      specialFeatures, 
      writingStyle, 
      contentLength, 
      targetKeywords, 
      priceRange, 
      yearBuilt,
      listingType = 'sale' // sale, rent, commercial
    } = await request.json()

    // 验证必填字段
    if (!propertyType || !location) {
      return NextResponse.json(
        { error: '房产类型和位置是必填字段' },
        { status: 400 }
      )
    }

    // 根据写作风格调整语调
    const stylePrompts = {
      'Professional': '使用专业、正式的房地产术语，突出投资价值和市场优势',
      'Friendly': '使用温馨、亲切的语调，强调家的温暖感和生活便利性',
      'Luxury': '使用高端、奢华的描述，突出独特性和尊贵感',
      'Modern': '使用现代、时尚的表达，强调科技感和设计美学',
      'Family-Oriented': '使用家庭友好的语调，突出安全性和教育资源'
    }

    // 根据内容长度调整字数
    const lengthGuides = {
      'Short': '150-200字的简洁描述',
      'Medium': '300-400字的详细介绍', 
      'Long': '500-600字的全面展示'
    }

    // 构建AI提示词
    const prompt = `
作为专业的房地产文案撰写专家，请为以下房产生成${lengthGuides[contentLength] || '300-400字的详细介绍'}的营销文案。

房产信息：
- 房产类型：${propertyType}
- 卧室数量：${bedrooms || '未指定'}
- 浴室数量：${bathrooms || '未指定'}
- 建筑面积：${squareFeet ? `${squareFeet}平方英尺` : '未指定'}
- 位置：${location}
- 建造年份：${yearBuilt || '未指定'}
- 价格范围：${priceRange || '面议'}
- 特色功能：${specialFeatures || '无特殊说明'}
- 目标关键词：${targetKeywords || '无'}
- 房源类型：${listingType === 'sale' ? '出售' : listingType === 'rent' ? '出租' : '商业'}

写作要求：
${stylePrompts[writingStyle] || stylePrompts['Professional']}

请生成包含以下结构的文案：
1. 吸引人的标题
2. 房产亮点概述
3. 详细特色描述
4. 位置优势
5. 投资/居住价值
6. 行动号召

请确保文案具有说服力，能够吸引潜在买家/租客的注意。
`

    // 模拟AI生成（实际项目中应该调用真实的AI API）
    const generatedContent = await generateListingContent(prompt, {
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      location,
      specialFeatures,
      writingStyle,
      contentLength,
      priceRange,
      yearBuilt,
      listingType
    })

    return NextResponse.json({
      success: true,
      content: generatedContent,
      metadata: {
        propertyType,
        location,
        writingStyle,
        contentLength,
        generatedAt: new Date().toISOString(),
        wordCount: generatedContent.split(' ').length
      }
    })

  } catch (error) {
    console.error('房源文案生成错误:', error)
    return NextResponse.json(
      { error: '生成房源文案时发生错误，请稍后重试' },
      { status: 500 }
    )
  }
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