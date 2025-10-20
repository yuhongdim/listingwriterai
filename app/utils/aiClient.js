// AI API client configuration
class AIClient {
  constructor() {
    // Prioritize Xinghu Cloud API configuration
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

  // Generate property listing
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

    const prompt = `Please generate a professional marketing description for the following property in ${writingStyle} style with ${contentLength} length:

Property Information:
- Type: ${propertyType}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Square Feet: ${squareFeet}
- Location: ${location}
- Special Features: ${specialFeatures}
- Year Built: ${yearBuilt}
- Price Range: ${priceRange}
- Target Keywords: ${targetKeywords}

Please generate an attractive property description that highlights selling points and advantages, meeting real estate marketing standards.`

    return await this.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: contentLength === 'Short' ? 500 : contentLength === 'Long' ? 1500 : 1000
    })
  }

  // Generate email template
  async generateEmailTemplate(emailData) {
    const { 
      purpose, 
      propertyType, 
      location, 
      targetAudience, 
      tone, 
      includeProperty 
    } = emailData

    const prompt = `Please generate a real estate email template for ${purpose} with ${tone} tone, targeting ${targetAudience}:

${includeProperty ? `
Property Information:
- Type: ${propertyType}
- Location: ${location}
` : ''}

Please include:
1. Compelling subject line
2. Personalized opening
3. Core content
4. Clear call to action
5. Professional closing

Format requirements: Email content should be professional, persuasive, and meet real estate industry standards.`

    return await this.generateContent(prompt, {
      temperature: 0.7,
      maxTokens: 1200
    })
  }

  // Generate video script
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

    const prompt = `Please generate a ${duration}-second video script for ${platform} platform in ${style} style for the following property:

Property Information:
- Type: ${propertyType}
- Location: ${location}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Square Feet: ${squareFeet}
- Special Features: ${specialFeatures}
- Key Features: ${keyFeatures?.join(', ') || ''}

Please generate a segmented script in the following format:
1. Opening (0-5 seconds): Attention-grabbing opening
2. Property Introduction (5-20 seconds): Basic information and location advantages
3. Feature Showcase (20-45 seconds): Key features and highlights
4. Closing Call-to-Action (45-${duration} seconds): ${callToAction}

Each segment should include:
- Timeline
- Visual description
- Voiceover script
- Filming suggestions

Please respond in clear format.`

    return await this.generateContent(prompt, {
      temperature: 0.8,
      maxTokens: 2000
    })
  }
}

// Create singleton instance
const aiClient = new AIClient()

export default aiClient