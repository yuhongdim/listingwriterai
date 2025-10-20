import { NextResponse } from 'next/server'
import aiClient from '../../utils/aiClient'

export async function POST(request) {
  try {
    const body = await request.json()
    const { 
      contentType, // New: content type 'listing', 'social', 'video'
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
      // Social media specific parameters
      platform,
      targetAudience,
      emotion,
      // Video script specific parameters
      videoType,
      duration,
      callToAction
    } = body

    console.log('Received request:', body) // Add debug log

    // Different validation and processing based on content type
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
    
    // Return basic mock content on error
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

// Handle property listing generation
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

  // Validate required fields
  if (!propertyType || !bedrooms || !bathrooms || !squareFeet || !location) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    // Use AI client to generate content
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
    // Use mock content when AI fails
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

// Handle social media content generation
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

  // Validate required fields
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

// Handle video script generation
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

  // Validate required fields
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

// Generate social media content
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
    excitement: ['🏡✨', 'exciting', 'great opportunity', 'don\'t miss out'],
    trust: ['🤝', 'trustworthy', 'professional service', 'reliable choice'],
    urgency: ['⏰', 'limited time offer', 'book now', 'opportunity knocks'],
    luxury: ['💎', 'luxury experience', 'premium enjoyment', 'quality living'],
    comfort: ['🏠', 'warm and comfortable', 'feels like home', 'peaceful living']
  }

  const tone = emotionTones[emotion] || emotionTones.comfort
  const [emoji, ...keywords] = tone

  let content = ''
  let hashtags = []

  // Generate different styles of content based on platform
  switch (platform) {
    case 'instagram':
      content = `${emoji} ${keywords[0]} ${propertyType} now available!\n\n📍 Location: ${location}\n${specialFeatures ? `✨ Features: ${specialFeatures}\n` : ''}${priceRange ? `💰 Price: ${priceRange}\n` : ''}\nThis is not just a home, it's the beginning of your dream life!\n\n#RealEstate #${location.replace(/\s+/g, '')} #${propertyType} #NewListing`
      hashtags = [`RealEstate`, `${location.replace(/\s+/g, '')}`, `${propertyType}`, `NewListing`, `Investment`, `DreamHome`]
      break

    case 'facebook':
      content = `🏡 Discover this ${keywords[0]} ${propertyType}!\n\nLocated in ${location}, this property offers you a ${keywords[1]} living experience. ${specialFeatures ? `Property features include ${specialFeatures}, ` : ''}making every day comfortable and convenient.\n\n${priceRange ? `Price: ${priceRange}\n` : ''}Want to learn more? Contact us immediately to schedule a viewing!\n\n#${location}RealEstate #${propertyType}ForSale`
      hashtags = [`${location}RealEstate`, `${propertyType}ForSale`, `PropertyInvestment`]
      break

    case 'twitter':
      content = `${emoji} ${location} ${propertyType} available now! ${specialFeatures ? `Features: ${specialFeatures.substring(0, 30)}...` : ''}${priceRange ? ` ${priceRange}` : ''} Contact for viewing!`
      hashtags = [`${location}`, `${propertyType}`, `Property`]
      break

    case 'linkedin':
      content = `🏢 Investment Opportunity: Premium ${propertyType} in ${location}\n\nAs a real estate professional, I'm pleased to recommend this ${propertyType} located in ${location}. ${specialFeatures ? `What makes this property unique is ${specialFeatures}, ` : ''}providing excellent value for both investors and homebuyers.\n\n${priceRange ? `Investment amount: ${priceRange}\n` : ''}Market analysis shows this area has good appreciation potential. Welcome professional investors and homebuyers to contact for detailed discussion.`
      hashtags = [`RealEstateInvestment`, `${location}`, `${propertyType}`, `InvestmentOpportunity`]
      break

    case 'tiktok':
      content = `${emoji} Amazing ${propertyType} in ${location}! ${specialFeatures ? `${specialFeatures.split(',')[0]}` : 'Perfect design'} waiting for you to see! ${priceRange ? ` ${priceRange}` : ''}`
      hashtags = [`Property`, `${location}`, `${propertyType}`, `Viewing`, `NewHome`]
      break
  }

  // Limit content length
  if (content.length > config.maxLength) {
    content = content.substring(0, config.maxLength - 3) + '...'
  }

  // Limit hashtag count
  hashtags = hashtags.slice(0, config.hashtagLimit)

  return { text: content, hashtags }
}

// Generate video script
function generateVideoScript({ propertyType, location, videoType, duration, specialFeatures, targetAudience, callToAction }) {
  const durationMinutes = parseInt(duration) || 1
  const sceneDuration = Math.max(10, Math.floor((durationMinutes * 60) / 6)) // Average duration per scene

  const scriptTemplates = {
    tour: {
      scenes: [
        { type: 'opening', duration: sceneDuration, description: 'Exterior showcase' },
        { type: 'entrance', duration: sceneDuration, description: 'Entrance and foyer' },
        { type: 'living', duration: sceneDuration, description: 'Living area' },
        { type: 'kitchen', duration: sceneDuration, description: 'Kitchen showcase' },
        { type: 'bedrooms', duration: sceneDuration, description: 'Bedroom tour' },
        { type: 'closing', duration: sceneDuration, description: 'Summary and contact info' }
      ]
    },
    promotional: {
      scenes: [
        { type: 'hook', duration: sceneDuration, description: 'Attention-grabbing opening' },
        { type: 'problem', duration: sceneDuration, description: 'Problem solving' },
        { type: 'solution', duration: sceneDuration, description: 'Property as solution' },
        { type: 'benefits', duration: sceneDuration, description: 'Core benefits showcase' },
        { type: 'social_proof', duration: sceneDuration, description: 'Customer testimonials' },
        { type: 'cta', duration: sceneDuration, description: 'Call to action' }
      ]
    },
    testimonial: {
      scenes: [
        { type: 'introduction', duration: sceneDuration, description: 'Customer introduction' },
        { type: 'before', duration: sceneDuration, description: 'Pre-purchase needs' },
        { type: 'process', duration: sceneDuration, description: 'Purchase process' },
        { type: 'after', duration: sceneDuration, description: 'Post-move experience' },
        { type: 'recommendation', duration: sceneDuration, description: 'Recommendation to others' },
        { type: 'contact', duration: sceneDuration, description: 'Contact information' }
      ]
    }
  }

  const template = scriptTemplates[videoType] || scriptTemplates.tour
  const scenes = template.scenes.slice(0, Math.ceil(durationMinutes * 60 / sceneDuration))

  let script = `# ${propertyType} - ${location} Video Script\n\n**Video Type**: ${videoType}\n**Target Duration**: ${durationMinutes} minutes\n**Target Audience**: ${targetAudience || 'Potential buyers'}\n\n---\n\n`

  scenes.forEach((scene, index) => {
    script += `## Scene ${index + 1}: ${scene.description} (${scene.duration}s)\n\n`
    
    switch (scene.type) {
      case 'opening':
        script += `**Visual**: Property exterior panorama, showcasing architectural style and surroundings\n**Voiceover**: "Welcome to this beautiful ${propertyType} located in ${location}. Let's explore what could be your new home."\n**Music**: Light and pleasant background music\n\n`
        break
      case 'entrance':
        script += `**Visual**: Starting from entrance foyer, showcasing space layout\n**Voiceover**: "Upon entering, you'll immediately feel the warm atmosphere and thoughtfully designed space layout."\n**Effects**: Smooth camera movement\n\n`
        break
      case 'living':
        script += `**Visual**: Living room panorama, highlighting lighting and furniture arrangement\n**Voiceover**: "The spacious and bright living room is the perfect place for family gatherings and relaxation. ${specialFeatures ? `Particularly noteworthy is ${specialFeatures.split(',')[0]}.` : ''}"\n**Camera**: Multi-angle showcase\n\n`
        break
      case 'kitchen':
        script += `**Visual**: Kitchen equipment and countertops\n**Voiceover**: "The modern kitchen is equipped with top-tier facilities, making cooking a pleasure."\n**Details**: Showcase kitchen appliances and storage space\n\n`
        break
      case 'bedrooms':
        script += `**Visual**: Master bedroom and other bedrooms\n**Voiceover**: "Comfortable bedrooms provide a peaceful resting environment, with every detail carefully considered."\n**Focus**: Showcase storage space and lighting\n\n`
        break
      case 'closing':
        script += `**Visual**: Property highlights review montage\n**Voiceover**: "This is your ideal home in ${location}. ${callToAction || 'Contact us to schedule a viewing and start your new life chapter.'}"\n**Text**: Contact information and website details\n\n`
        break
      case 'hook':
        script += `**Visual**: Property's most attractive features\n**Voiceover**: "Are you still searching for the perfect residence in ${location}? This might be the answer you've been looking for."\n**Effect**: Fast-paced editing\n\n`
        break
      case 'problem':
        script += `**Visual**: Comparison with other properties' shortcomings\n**Voiceover**: "In the real estate market, finding a house that fits your budget while meeting all your needs isn't easy."\n**Emotion**: Create resonance\n\n`
        break
      case 'solution':
        script += `**Visual**: Showcase how the property solves problems\n**Voiceover**: "But this ${propertyType} perfectly solves these problems. Prime location, reasonable price, excellent quality."\n**Focus**: Core selling points\n\n`
        break
      case 'benefits':
        script += `**Visual**: Property core advantages showcase\n**Voiceover**: "${specialFeatures ? `${specialFeatures} makes this place stand out.` : ''} Whether for investment or residence, this is an excellent choice."\n**Data**: Display relevant data and advantages\n\n`
        break
      case 'social_proof':
        script += `**Visual**: Customer reviews or community environment\n**Voiceover**: "Many satisfied homeowners have already chosen this place, and their quality of life has improved significantly."\n**Proof**: Display customer feedback\n\n`
        break
      case 'cta':
        script += `**Visual**: Contact information and urgency elements\n**Voiceover**: "${callToAction || 'Don\'t miss this opportunity, contact us immediately to schedule a viewing!'}"\n**Text**: Clear contact information and action guidance\n\n`
        break
      default:
        script += `**Visual**: Relevant scene showcase\n**Voiceover**: Customized content based on scene type\n**Note**: Specific content needs adjustment based on actual situation\n\n`
    }
  })

  script += `---\n\n**Production Notes**:\n- Ensure all shots are stable and clear\n- High audio quality required, avoid noise\n- Maintain consistent tone and style\n- Add appropriate transition effects\n- Add text descriptions at key moments\n\n**Estimated Total Duration**: ${Math.ceil(scenes.reduce((total, scene) => total + scene.duration, 0) / 60)} minutes`

  return {
    script,
    scenes: scenes.map(scene => ({
      ...scene,
      estimatedDuration: scene.duration
    })),
    estimatedDuration: Math.ceil(scenes.reduce((total, scene) => total + scene.duration, 0) / 60)
  }
}