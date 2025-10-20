import { NextResponse } from 'next/server'
import aiClient from '@/app/utils/aiClient'

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

    // Validate required fields
    if (!propertyType || !location) {
      return NextResponse.json(
        { error: 'Property type and location are required fields' },
        { status: 400 }
      )
    }

    try {
      // Use AI client to generate listing description
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
      console.error('AI API call failed:', apiError)
      // Return mock description when API fails
      return generateMockListing({
        propertyType, location, bedrooms, bathrooms, squareFeet, 
        specialFeatures, style, targetAudience, keyFeatures, priceRange, neighborhood
      })
    }

  } catch (error) {
    console.error('Listing description generation error:', error)
    return NextResponse.json(
      { error: 'Description generation failed, please try again' },
      { status: 500 }
    )
  }
}

// Generate mock listing description function
function generateMockListing({
  propertyType, location, bedrooms, bathrooms, squareFeet, 
  specialFeatures, style, targetAudience, keyFeatures, priceRange, neighborhood
}) {
  const mockDescriptions = {
    apartment: `Beautiful ${bedrooms}-bedroom ${bathrooms}-bathroom apartment located in the prime area of ${location}. ${squareFeet} square feet, featuring ${specialFeatures}. Modern renovation, convenient living, excellent transportation.`,
    house: `Detached house with ${bedrooms} bedrooms and ${bathrooms} bathrooms, situated in a quality community in ${location}. Building area of ${squareFeet} square feet, featuring ${specialFeatures}. Private garden, ample parking.`,
    condo: `Luxury condominium with ${bedrooms} bedrooms and ${bathrooms} bathrooms in the core location of ${location}. ${squareFeet} square feet, featuring ${specialFeatures}. Excellent property management, complete facilities.`,
    townhouse: `Townhouse with ${bedrooms} bedrooms and ${bathrooms} bathrooms, located in a quiet community in ${location}. ${squareFeet} square feet, featuring ${specialFeatures}. Independent entrance, excellent privacy.`
  }

  const description = mockDescriptions[propertyType] || `Quality property with ${bedrooms} bedrooms and ${bathrooms} bathrooms, located in ${location}. ${squareFeet} square feet, featuring ${specialFeatures}.`

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

// Mock AI content generation function
async function generateListingContent(prompt, propertyData) {
  // This should call actual AI API (like OpenAI, Claude, etc.)
  // Now returning mock content
  
  const { propertyType, location, bedrooms, bathrooms, squareFeet, specialFeatures, writingStyle, priceRange, listingType } = propertyData
  
  const templates = {
    'Professional': {
      title: `Premium ${propertyType} | ${location} Core Area | ${bedrooms}BR ${bathrooms}BA`,
      content: `
🏡 **Property Highlights**
This ${propertyType} located in ${location}, with ${squareFeet || 'spacious'} square feet of living space, features a well-designed ${bedrooms}-bedroom ${bathrooms}-bathroom layout, providing you with a comfortable living experience.

🌟 **Key Features**
${specialFeatures ? `• ${specialFeatures.split(',').join('\n• ')}` : '• Premium finishes, move-in ready\n• Abundant natural light, excellent ventilation\n• Convenient transportation, complete amenities'}

📍 **Location Advantages**
${location} offers a prime location with comprehensive surrounding facilities, convenient transportation, making it an ideal choice for ${listingType === 'sale' ? 'investment and homeownership' : 'rental living'}.

💰 **Investment Value**
${priceRange ? `Price: ${priceRange}` : 'Price negotiable'}, excellent value with great appreciation potential.

📞 **Contact Us**
Welcome to schedule a viewing. For more details, please contact our professional advisory team.
      `
    },
    'Luxury': {
      title: `Luxury ${propertyType} | ${location} Premium Community | Prestigious Living Standard`,
      content: `
✨ **Luxury Standard**
This top-tier ${propertyType} situated in ${location}, featuring a spacious ${bedrooms}-bedroom ${bathrooms}-bathroom layout with ${squareFeet ? `${squareFeet} square feet` : 'expansive'} luxury space, epitomizes the essence of quality living.

🏆 **Premium Features**
${specialFeatures ? `• ${specialFeatures.split(',').join('\n• ')}` : '• Top-grade finishing materials, exquisite craftsmanship\n• Smart home system, technological convenience\n• Private garden/balcony, beautiful views'}

🌆 **Prime Location**
${location} as the city's core area, brings together the finest educational, medical, and shopping resources, showcasing the prestigious status of residents.

💎 **Exclusive Value**
${priceRange ? `Price: ${priceRange}` : 'Price upon inquiry'}, limited collection, opportunity not to be missed.

🤝 **Exclusive Service**
VIP viewing service provided, professional real estate consultants accompany throughout, customizing property solutions for you.
      `
    }
  }

  const template = templates[writingStyle] || templates['Professional']
  
  return `${template.title}\n\n${template.content.trim()}`
}

// GET method for API information
export async function GET() {
  return NextResponse.json({
    name: 'Property Listing Generation API',
    version: '1.0.0',
    description: 'Generate professional marketing copy based on property information',
    endpoints: {
      POST: {
        description: 'Generate property listing copy',
        parameters: {
          required: ['propertyType', 'location'],
          optional: ['bedrooms', 'bathrooms', 'squareFeet', 'specialFeatures', 'writingStyle', 'contentLength', 'targetKeywords', 'priceRange', 'yearBuilt', 'listingType']
        }
      }
    }
  })
}