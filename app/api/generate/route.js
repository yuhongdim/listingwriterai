import { NextResponse } from 'next/server'
import aiClient from '../../utils/aiClient'

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      contentType, // 新增：内容类型 'listing', 'social', 'video'
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
      // 社交媒体特定参数
      platform,
      targetAudience,
      emotion,
      // 视频脚本特定参数
      videoType,
      duration,
      callToAction
    } = body

    console.log('Received request:', body) // 添加调试日志

    // 根据内容类型进行不同的验证和处理
    switch (contentType) {
      case 'social':
        return handleSocialMediaGeneration(body)
      case 'video':
        return handleVideoScriptGeneration(body)
      case 'listing':
      default:
        return handleListingGeneration(body)
    }

  } catch (error) {
    console.error('API Error:', error)
    
    // 错误时返回基础模拟内容
    const basicContent = `This is a beautiful ${body?.propertyType || 'property'} located in ${body?.location || 'a prime location'}, featuring ${body?.bedrooms || 'multiple'} bedrooms and ${body?.bathrooms || 'multiple'} bathrooms, with approximately ${body?.squareFeet || 'spacious'} square feet. This property offers excellent design and a convenient location, making it an ideal choice for your new home.`
    
    return NextResponse.json({ 
      content: basicContent 
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

// 处理房源文案生成
async function handleListingGeneration(body) {
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
    yearBuilt 
  } = body

  // 验证必填字段
  if (!propertyType || !bedrooms || !bathrooms || !squareFeet || !location) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    // 使用AI客户端生成内容
    const result = await aiClient.generateListing(body)
    console.log('Generated content:', result.content)
    
    return NextResponse.json({ 
      content: result.content,
      usage: result.usage,
      model: result.model
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('AI generation failed, using fallback:', error)
    // AI失败时使用模拟内容
    const mockContent = generateMockContent(body)
    return NextResponse.json({ 
      content: mockContent,
      fallback: true
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

// 处理社交媒体内容生成
async function handleSocialMediaGeneration(body) {
  const { 
    propertyType, 
    location, 
    platform, 
    targetAudience, 
    emotion, 
    specialFeatures,
    priceRange 
  } = body

  // 验证必填字段
  if (!propertyType || !location || !platform) {
    return NextResponse.json(
      { error: 'Property type, location, and platform are required for social media content' },
      { status: 400 }
    )
  }

  const socialContent = generateSocialMediaContent(body)
  
  return NextResponse.json({ 
    content: socialContent.text,
    hashtags: socialContent.hashtags,
    platform,
    metadata: {
      characterCount: socialContent.text.length,
      hashtagCount: socialContent.hashtags.length,
      targetAudience,
      emotion
    }
  }, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

// 处理视频脚本生成
async function handleVideoScriptGeneration(body) {
  const { 
    propertyType, 
    location, 
    videoType, 
    duration, 
    specialFeatures,
    targetAudience,
    callToAction 
  } = body

  // 验证必填字段
  if (!propertyType || !location || !videoType) {
    return NextResponse.json(
      { error: 'Property type, location, and video type are required for video script' },
      { status: 400 }
    )
  }

  const videoScript = generateVideoScript(body)
  
  return NextResponse.json({ 
    script: videoScript.script,
    scenes: videoScript.scenes,
    duration: videoScript.estimatedDuration,
    metadata: {
      videoType,
      targetAudience,
      sceneCount: videoScript.scenes.length,
      callToAction
    }
  }, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
}

// Generate mock content function with enhanced styles, lengths, and SEO
function generateMockContent({ 
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
  yearBuilt 
}) {
  // Style-specific content templates
  const styleTemplates = {
    Professional: {
      adjectives: ['well-maintained', 'spacious', 'convenient', 'practical', 'efficient', 'functional'],
      tone: 'factual and business-focused',
      openings: [
        `This ${bedrooms}-bedroom, ${bathrooms}-bathroom ${propertyType.toLowerCase()} offers ${squareFeet} square feet of well-designed living space in ${location}.`,
        `Discover a practical ${propertyType.toLowerCase()} featuring ${bedrooms} bedrooms and ${bathrooms} bathrooms across ${squareFeet} square feet in ${location}.`
      ]
    },
    Luxury: {
      adjectives: ['exquisite', 'elegant', 'premium', 'sophisticated', 'opulent', 'refined', 'prestigious'],
      tone: 'sophisticated and premium',
      openings: [
        `Experience unparalleled luxury in this magnificent ${bedrooms}-bedroom, ${bathrooms}-bathroom ${propertyType.toLowerCase()} spanning ${squareFeet} square feet in the prestigious ${location}.`,
        `Indulge in sophisticated living with this exquisite ${propertyType.toLowerCase()} offering ${bedrooms} bedrooms and ${bathrooms} bathrooms across ${squareFeet} square feet of refined elegance in ${location}.`
      ]
    },
    Storytelling: {
      adjectives: ['charming', 'inviting', 'welcoming', 'cozy', 'enchanting', 'captivating'],
      tone: 'emotional and narrative-driven',
      openings: [
        `Imagine coming home to this enchanting ${bedrooms}-bedroom, ${bathrooms}-bathroom ${propertyType.toLowerCase()} where ${squareFeet} square feet of thoughtfully crafted space awaits you in ${location}.`,
        `Step into a story of comfort and joy in this captivating ${propertyType.toLowerCase()} featuring ${bedrooms} bedrooms and ${bathrooms} bathrooms across ${squareFeet} square feet in the heart of ${location}.`
      ]
    }
  }

  // Content length configurations
  const lengthConfigs = {
    Short: { targetWords: 100, sections: 2 },
    Medium: { targetWords: 200, sections: 3 },
    Long: { targetWords: 300, sections: 4 }
  }

  // SEO keyword integration
  const localKeywords = extractLocalKeywords(location)
  const allKeywords = [...localKeywords, ...(targetKeywords ? targetKeywords.split(',').map(k => k.trim()) : [])]

  const style = styleTemplates[writingStyle] || styleTemplates.Professional
  const config = lengthConfigs[contentLength] || lengthConfigs.Medium
  
  // Generate content sections
  let content = []
  
  // Opening section
  const opening = style.openings[Math.floor(Math.random() * style.openings.length)]
  content.push(opening)

  // Property details section
  if (config.sections >= 2) {
    let detailsSection = `This exceptional property showcases ${style.adjectives[0]} design throughout`
    if (yearBuilt) {
      detailsSection += `, built in ${yearBuilt}`
    }
    if (priceRange) {
      detailsSection += ` and priced at ${priceRange}`
    }
    detailsSection += '. The thoughtfully planned layout maximizes both comfort and functionality.'
    content.push(detailsSection)
  }

  // Features section
  if (config.sections >= 3 && specialFeatures) {
    const featuresIntro = writingStyle === 'Luxury' ? 'Luxurious amenities include' : 
                         writingStyle === 'Storytelling' ? 'You\'ll fall in love with features like' : 
                         'Key features include'
    content.push(`${featuresIntro} ${specialFeatures.toLowerCase()}, enhancing the overall living experience.`)
  }

  // Location and SEO section
  if (config.sections >= 4) {
    let locationSection = `Perfectly positioned in ${location}`
    if (allKeywords.length > 0) {
      const keywordPhrase = allKeywords.slice(0, 3).join(', ')
      locationSection += `, this area is renowned for its ${keywordPhrase}`
    }
    locationSection += '. Residents enjoy convenient access to local amenities, dining, and transportation.'
    content.push(locationSection)
  }

  // Call to action
  const cta = writingStyle === 'Luxury' ? 'Schedule your private showing today and experience luxury living at its finest.' :
              writingStyle === 'Storytelling' ? 'Your new chapter begins here - schedule a visit and let this home tell you its story.' :
              'Contact us today to schedule a viewing and discover all this property has to offer.'
  
  content.push(cta)

  // Join sections and ensure proper length
  let finalContent = content.join('\n\n')
  
  // Adjust content length if needed
  if (contentLength === 'Short' && finalContent.length > 600) {
    finalContent = content.slice(0, 2).join('\n\n') + '\n\n' + cta
  } else if (contentLength === 'Long' && finalContent.length < 1200) {
    // Add more descriptive content for long format
    const additionalContent = generateAdditionalContent(writingStyle, propertyType, location)
    finalContent = content.slice(0, -1).join('\n\n') + '\n\n' + additionalContent + '\n\n' + cta
  }

  return finalContent
}

// Extract local market keywords based on location
function extractLocalKeywords(location) {
  const locationKeywords = {
    'Austin': ['tech hub', 'outdoor lifestyle', 'music scene', 'food culture'],
    'Los Angeles': ['entertainment district', 'beach proximity', 'cultural diversity', 'year-round sunshine'],
    'New York': ['urban convenience', 'cultural attractions', 'public transportation', 'dining scene'],
    'Miami': ['waterfront living', 'international flair', 'nightlife', 'tropical climate'],
    'Seattle': ['tech corridor', 'coffee culture', 'outdoor recreation', 'innovation hub'],
    'Denver': ['mountain views', 'outdoor activities', 'craft beer scene', 'healthy lifestyle'],
    'San Francisco': ['tech innovation', 'cultural diversity', 'architectural charm', 'bay views']
  }

  for (const [city, keywords] of Object.entries(locationKeywords)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return keywords
    }
  }
  
  return ['prime location', 'desirable neighborhood', 'convenient access']
}

// Generate additional content for long format
function generateAdditionalContent(writingStyle, propertyType, location) {
  const additionalSections = {
    Professional: `The property's strategic location provides excellent investment potential and long-term value appreciation. Modern infrastructure and well-maintained community amenities make this an ideal choice for discerning buyers.`,
    Luxury: `This distinguished residence epitomizes refined living, where every detail has been carefully curated to exceed the most sophisticated expectations. The exclusive neighborhood setting ensures privacy and prestige.`,
    Storytelling: `Every corner of this home whispers tales of comfort and joy, from morning coffee in the sun-drenched spaces to evening gatherings that create lasting memories. This isn't just a house - it's where your life's best moments will unfold.`
  }

  return additionalSections[writingStyle] || additionalSections.Professional
}

// 生成社交媒体内容
function generateSocialMediaContent({ propertyType, location, platform, targetAudience, emotion, specialFeatures, priceRange }) {
  const platformConfigs = {
    instagram: { maxLength: 2200, hashtagLimit: 30 },
    facebook: { maxLength: 63206, hashtagLimit: 10 },
    twitter: { maxLength: 280, hashtagLimit: 5 },
    linkedin: { maxLength: 3000, hashtagLimit: 10 },
    tiktok: { maxLength: 150, hashtagLimit: 20 }
  }

  const config = platformConfigs[platform] || platformConfigs.instagram

  const emotionTones = {
    excitement: ['🏡✨', '令人兴奋的', '绝佳机会', '不容错过'],
    trust: ['🤝', '值得信赖', '专业服务', '安心选择'],
    urgency: ['⏰', '限时优惠', '抢先预订', '机不可失'],
    luxury: ['💎', '奢华体验', '尊贵享受', '品质生活'],
    comfort: ['🏠', '温馨舒适', '家的感觉', '安居乐业']
  }

  const tone = emotionTones[emotion] || emotionTones.comfort
  const [emoji, ...keywords] = tone

  let content = ''
  let hashtags = []

  // 根据平台生成不同风格的内容
  switch (platform) {
    case 'instagram':
      content = `${emoji} ${keywords[0]}的${propertyType}现已上市！\n\n📍 位置：${location}\n${specialFeatures ? `✨ 特色：${specialFeatures}\n` : ''}${priceRange ? `💰 价格：${priceRange}\n` : ''}\n这里不仅仅是一个住所，更是您梦想生活的开始！\n\n#房地产 #${location.replace(/\s+/g, '')} #${propertyType} #新房上市`
      hashtags = [`房地产`, `${location.replace(/\s+/g, '')}`, `${propertyType}`, `新房上市`, `投资机会`, `理想家园`]
      break

    case 'facebook':
      content = `🏡 ${keywords[0]}的${propertyType}等您来发现！\n\n坐落在${location}的这处房产，为您提供了${keywords[1]}的居住体验。${specialFeatures ? `房产特色包括${specialFeatures}，` : ''}让每一天都充满舒适与便利。\n\n${priceRange ? `价格：${priceRange}\n` : ''}想了解更多详情？立即联系我们安排看房！\n\n#${location}房地产 #${propertyType}出售`
      hashtags = [`${location}房地产`, `${propertyType}出售`, `投资置业`]
      break

    case 'twitter':
      content = `${emoji} ${location}${propertyType}现房！${specialFeatures ? `特色：${specialFeatures.substring(0, 30)}...` : ''}${priceRange ? ` ${priceRange}` : ''} 联系看房！`
      hashtags = [`${location}`, `${propertyType}`, `房产`]
      break

    case 'linkedin':
      content = `🏢 投资机会：${location}优质${propertyType}\n\n作为房地产专业人士，我很高兴为您推荐这处位于${location}的${propertyType}。${specialFeatures ? `该房产的独特之处在于${specialFeatures}，` : ''}为投资者和自住买家都提供了极佳的价值。\n\n${priceRange ? `投资金额：${priceRange}\n` : ''}市场分析显示，该区域具有良好的增值潜力。欢迎专业投资者和有购房需求的朋友联系详谈。`
      hashtags = [`房地产投资`, `${location}`, `${propertyType}`, `投资机会`]
      break

    case 'tiktok':
      content = `${emoji} ${location}超棒${propertyType}！${specialFeatures ? `${specialFeatures.split(',')[0]}` : '完美设计'}等你来看！${priceRange ? ` ${priceRange}` : ''}`
      hashtags = [`房产`, `${location}`, `${propertyType}`, `看房`, `新房`]
      break
  }

  // 限制内容长度
  if (content.length > config.maxLength) {
    content = content.substring(0, config.maxLength - 3) + '...'
  }

  // 限制标签数量
  hashtags = hashtags.slice(0, config.hashtagLimit)

  return { text: content, hashtags }
}

// 生成视频脚本
function generateVideoScript({ propertyType, location, videoType, duration, specialFeatures, targetAudience, callToAction }) {
  const durationMinutes = parseInt(duration) || 1
  const sceneDuration = Math.max(10, Math.floor((durationMinutes * 60) / 6)) // 平均每个场景时长

  const scriptTemplates = {
    tour: {
      scenes: [
        { type: 'opening', duration: sceneDuration, description: '外观展示' },
        { type: 'entrance', duration: sceneDuration, description: '入口和门厅' },
        { type: 'living', duration: sceneDuration, description: '客厅区域' },
        { type: 'kitchen', duration: sceneDuration, description: '厨房展示' },
        { type: 'bedrooms', duration: sceneDuration, description: '卧室巡览' },
        { type: 'closing', duration: sceneDuration, description: '总结和联系信息' }
      ]
    },
    promotional: {
      scenes: [
        { type: 'hook', duration: sceneDuration, description: '吸引注意力的开场' },
        { type: 'problem', duration: sceneDuration, description: '解决问题' },
        { type: 'solution', duration: sceneDuration, description: '房产作为解决方案' },
        { type: 'benefits', duration: sceneDuration, description: '核心优势展示' },
        { type: 'social_proof', duration: sceneDuration, description: '客户见证' },
        { type: 'cta', duration: sceneDuration, description: '行动号召' }
      ]
    },
    testimonial: {
      scenes: [
        { type: 'introduction', duration: sceneDuration, description: '客户介绍' },
        { type: 'before', duration: sceneDuration, description: '购房前的需求' },
        { type: 'process', duration: sceneDuration, description: '购房过程' },
        { type: 'after', duration: sceneDuration, description: '入住后的感受' },
        { type: 'recommendation', duration: sceneDuration, description: '推荐给他人' },
        { type: 'contact', duration: sceneDuration, description: '联系方式' }
      ]
    }
  }

  const template = scriptTemplates[videoType] || scriptTemplates.tour
  const scenes = template.scenes.slice(0, Math.ceil(durationMinutes * 60 / sceneDuration))

  let script = `# ${propertyType} - ${location} 视频脚本\n\n**视频类型**: ${videoType}\n**目标时长**: ${durationMinutes}分钟\n**目标受众**: ${targetAudience || '潜在买家'}\n\n---\n\n`

  scenes.forEach((scene, index) => {
    script += `## 场景 ${index + 1}: ${scene.description} (${scene.duration}秒)\n\n`
    
    switch (scene.type) {
      case 'opening':
        script += `**画面**: 房产外观全景，展示建筑风格和周边环境\n**旁白**: "欢迎来到位于${location}的这处精美${propertyType}。让我们一起探索这个可能成为您新家的地方。"\n**音乐**: 轻松愉悦的背景音乐\n\n`
        break
      case 'entrance':
        script += `**画面**: 从入口门厅开始，展示空间布局\n**旁白**: "一进门，您就能感受到这里的温馨氛围和精心设计的空间布局。"\n**特效**: 平滑的镜头移动\n\n`
        break
      case 'living':
        script += `**画面**: 客厅全景，重点展示采光和家具摆放\n**旁白**: "宽敞明亮的客厅是家庭聚会和休闲放松的完美场所。${specialFeatures ? `特别值得注意的是${specialFeatures.split(',')[0]}。` : ''}"\n**镜头**: 多角度展示\n\n`
        break
      case 'kitchen':
        script += `**画面**: 厨房设备和操作台面\n**旁白**: "现代化的厨房配备了一流的设施，让烹饪成为一种享受。"\n**细节**: 展示厨房电器和储物空间\n\n`
        break
      case 'bedrooms':
        script += `**画面**: 主卧和其他卧室\n**旁白**: "舒适的卧室为您提供宁静的休息环境，每一个细节都经过精心考虑。"\n**重点**: 展示储物空间和采光\n\n`
        break
      case 'closing':
        script += `**画面**: 房产亮点回顾蒙太奇\n**旁白**: "这就是您在${location}的理想家园。${callToAction || '联系我们安排看房，开启您的新生活篇章。'}"\n**文字**: 联系方式和网站信息\n\n`
        break
      case 'hook':
        script += `**画面**: 房产最吸引人的特色\n**旁白**: "您是否还在寻找${location}的完美住所？这里可能就是您一直在寻找的答案。"\n**效果**: 快节奏剪辑\n\n`
        break
      case 'problem':
        script += `**画面**: 对比其他房产的不足\n**旁白**: "在房产市场上，找到既符合预算又满足所有需求的房子并不容易。"\n**情绪**: 引起共鸣\n\n`
        break
      case 'solution':
        script += `**画面**: 展示房产解决问题的\n**旁白**: "但是这处${propertyType}完美解决了这些问题。位置优越，价格合理，品质卓越。"\n**重点**: 核心卖点\n\n`
        break
      case 'benefits':
        script += `**画面**: 房产核心优势展示\n**旁白**: "${specialFeatures ? `${specialFeatures}让这里与众不同。` : ''}无论是投资还是自住，这里都是绝佳选择。"\n**数据**: 展示相关数据和优势\n\n`
        break
      case 'social_proof':
        script += `**画面**: 客户评价或社区环境\n**旁白**: "已经有许多满意的业主选择了这里，他们的生活质量得到了显著提升。"\n**证明**: 展示客户反馈\n\n`
        break
      case 'cta':
        script += `**画面**: 联系方式和紧迫感元素\n**旁白**: "${callToAction || '不要错过这个机会，立即联系我们安排看房！'}"\n**文字**: 清晰的联系方式和行动指引\n\n`
        break
      default:
        script += `**画面**: 相关场景展示\n**旁白**: 根据场景类型定制内容\n**备注**: 具体内容需要根据实际情况调整\n\n`
    }
  })

  script += `---\n\n**制作备注**:\n- 确保所有镜头稳定清晰\n- 音频质量要求高，避免杂音\n- 保持一致的色调和风格\n- 添加适当的转场效果\n- 在关键时刻添加文字说明\n\n**预估总时长**: ${Math.ceil(scenes.reduce((total, scene) => total + scene.duration, 0) / 60)}分钟`

  return {
    script,
    scenes: scenes.map(scene => ({
      ...scene,
      estimatedDuration: scene.duration
    })),
    estimatedDuration: Math.ceil(scenes.reduce((total, scene) => total + scene.duration, 0) / 60)
  }
}