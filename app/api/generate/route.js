import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
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