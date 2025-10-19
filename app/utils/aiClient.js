// AI API客户端配置
class AIClient {
  constructor() {
    // 优先使用星狐云API配置
    this.apiKey = process.env.XINGHU_API_KEY || process.env.AI_API_KEY
    this.baseURL = process.env.XINGHU_API_URL || process.env.AI_API_BASE_URL || 'https://xinghuapi.com/v1'
    this.defaultModel = 'gpt-3.5-turbo'
  }

  async generateContent(prompt, options = {}) {
    const {
      model = this.defaultModel,
      maxTokens = 2000,
      temperature = 0.7,
      ...otherOptions
    } = options

    if (!this.apiKey) {
      throw new Error('AI API key not configured')
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature,
          ...otherOptions
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`)
      }

      const data = await response.json()
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid API response format')
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage,
        model: data.model
      }

    } catch (error) {
      console.error('AI API Error:', error)
      throw error
    }
  }

  // 生成房产描述
  async generateListing(propertyData) {
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
    } = propertyData

    const prompt = `请为以下房产生成专业的营销描述，风格为${writingStyle}，长度为${contentLength}：

房产信息：
- 类型：${propertyType}
- 卧室：${bedrooms}室
- 卫生间：${bathrooms}卫
- 面积：${squareFeet}平方英尺
- 位置：${location}
- 特色：${specialFeatures}
- 建造年份：${yearBuilt}
- 价格范围：${priceRange}
- 目标关键词：${targetKeywords}

请生成吸引人的房产描述，突出卖点和优势，符合房地产营销标准。`

    return await this.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: contentLength === 'Short' ? 500 : contentLength === 'Long' ? 1500 : 1000
    })
  }

  // 生成邮件模板
  async generateEmailTemplate(emailData) {
    const { 
      purpose, 
      propertyType, 
      location, 
      targetAudience, 
      tone, 
      includeProperty 
    } = emailData

    const prompt = `请生成一个${purpose}的房地产邮件模板，语调为${tone}，目标受众为${targetAudience}：

${includeProperty ? `
房产信息：
- 类型：${propertyType}
- 位置：${location}
` : ''}

请包含：
1. 吸引人的主题行
2. 个性化的开头
3. 核心内容
4. 明确的行动号召
5. 专业的结尾

格式要求：邮件内容应该专业、有说服力，符合房地产行业标准。`

    return await this.generateContent(prompt, {
      temperature: 0.7,
      maxTokens: 1200
    })
  }

  // 生成视频脚本
  async generateVideoScript(videoData) {
    const { 
      propertyType, 
      location, 
      bedrooms, 
      bathrooms, 
      squareFeet, 
      specialFeatures, 
      duration, 
      platform, 
      style, 
      keyFeatures, 
      callToAction 
    } = videoData

    const prompt = `请为以下房产生成一个${duration}秒的${platform}平台视频脚本，风格为${style}：

房产信息：
- 类型：${propertyType}
- 位置：${location}
- 卧室：${bedrooms}室
- 卫生间：${bathrooms}卫
- 面积：${squareFeet}平方英尺
- 特色：${specialFeatures}
- 重点特征：${keyFeatures?.join('、') || ''}

请按以下格式生成分段式脚本：
1. 开场（0-5秒）：吸引注意力的开场白
2. 房产介绍（5-20秒）：基本信息和位置优势
3. 特色展示（20-45秒）：重点特征和亮点
4. 结尾呼吁（45-${duration}秒）：${callToAction}

每段请包含：
- 时间轴
- 画面描述
- 旁白文案
- 拍摄建议

请用中文回复，格式清晰。`

    return await this.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: 2000
    })
  }
}

// 创建单例实例
const aiClient = new AIClient()

export default aiClient