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
      duration = 60, 
      platform = 'general',
      style = 'professional',
      keyFeatures = [],
      callToAction = 'Contact us for more details'
    } = await request.json()

    // Validate required fields
    if (!propertyType || !location) {
      return NextResponse.json(
        { error: 'Property type and location are required fields' },
        { status: 400 }
      )
    }

    // Use AI client to generate video script
    try {
      const result = await aiClient.generateVideoScript({
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
      })

      return NextResponse.json({
        success: true,
        script: result.script || generateMockVideoScript({
          propertyType, location, bedrooms, bathrooms, squareFeet, 
          specialFeatures, duration, platform, style, keyFeatures, callToAction
        })
      })

    } catch (apiError) {
      console.error('AI API call failed:', apiError)
      // Return mock script when API fails
      return NextResponse.json({
        success: true,
        script: generateMockVideoScript({
          propertyType, location, bedrooms, bathrooms, squareFeet, 
          specialFeatures, duration, platform, style, keyFeatures, callToAction
        })
      })
    }

  } catch (error) {
    console.error('Video script generation error:', error)
    return NextResponse.json(
      { error: 'Script generation failed, please try again' },
      { status: 500 }
    )
  }
}

function generateMockVideoScript({
  propertyType, location, bedrooms, bathrooms, squareFeet, 
  specialFeatures, duration, platform, style, keyFeatures, callToAction
}) {
  const script = `🎬 ${propertyType} Video Script - ${duration}s Version

📍 Location: ${location}
🏠 Property: ${bedrooms} bed ${bathrooms} bath, ${squareFeet}㎡
🎯 Platform: ${platform} | Style: ${style}

📝 SCRIPT CONTENT:

⏰ 【Opening】0-5s
📹 Scene: Property exterior panoramic view, bright sunlight
🎙️ Voiceover: "Looking for your ideal home? Here's a ${propertyType} waiting for you to discover!"
📝 Shooting Tips: Use drone for aerial shots, showcase surrounding environment

⏰ 【Introduction】5-20s
📹 Scene: From exterior to interior, showing layout
🎙️ Voiceover: "Located in ${location}, this ${bedrooms} bed ${bathrooms} bath ${propertyType}, ${squareFeet} square meters of comfortable space, excellent location, convenient transportation."
📝 Shooting Tips: Stabilizer tracking, smooth transitions

⏰ 【Features】20-${Math.max(45, duration-15)}s
📹 Scene: Highlight ${specialFeatures || 'premium renovation details'}
🎙️ Voiceover: "${keyFeatures.length > 0 ? keyFeatures.join(', ') : 'Premium design, quality living starts here'}. Every detail showcases quality, every inch of space is filled with warmth."
📝 Shooting Tips: Close-up shots of highlights, with soft lighting

⏰ 【Closing】${Math.max(45, duration-15)}-${duration}s
📹 Scene: Return to living room panoramic view, warm family atmosphere
🎙️ Voiceover: "${callToAction}, let us open a new chapter of beautiful life for you!"
📝 Shooting Tips: Warm tones, showcase living atmosphere

🎬 PRODUCTION NOTES:

📋 Shooting Checklist:
✅ Exterior panoramic (drone)
✅ Interior layout (stabilizer)
✅ Feature details (close-up shots)
✅ Living scenes (lifestyle shots)

🎵 Music Suggestion: Light and pleasant background music, balanced with voiceover volume

⚡ Post-production Points:
- Natural and smooth transitions
- Clear and readable subtitles
- Unified warm color tone
- Compact and orderly rhythm`

  return NextResponse.json({
    success: true,
    script: script,
    metadata: {
      duration,
      platform,
      style,
      propertyType,
      location,
      source: 'mock'
    }
  })
}