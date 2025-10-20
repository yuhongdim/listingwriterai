'use client'

import { useState } from 'react'
import { 
  Share2, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter,
  Copy,
  Download,
  Sparkles,
  Hash,
  Users,
  Target,
  Calendar,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  BarChart3,
  Home
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'
import errorHandler from '../utils/errorHandler'
import LoadingSpinner, { ContentGeneratingLoader, ApiLoadingSpinner } from './LoadingSpinner'
import { useToast } from './Toast'

const SocialMediaGenerator = ({ usageCount, setUsageCount, setCurrentPage }) => {
  // Toast hook
  const { success, error, warning, info } = useToast()
  
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    priceRange: '',
    keyFeatures: '',
    targetAudience: 'first-time-buyers',
    contentGoal: 'generate-leads',
    tone: 'professional'
  })
  
  const [generatedContent, setGeneratedContent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState(['facebook', 'instagram'])
  const [copySuccess, setCopySuccess] = useState('')

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'blue',
      maxLength: 2200,
      features: ['Long-form content', 'Multiple hashtags', 'Link sharing'],
      audience: 'Broad demographic, family-focused'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'pink',
      maxLength: 2200,
      features: ['Visual storytelling', 'Stories', 'Reels'],
      audience: 'Younger demographic, visual-focused'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'blue',
      maxLength: 1300,
      features: ['Professional network', 'Industry insights', 'B2B focus'],
      audience: 'Professionals, investors, agents'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'gray',
      maxLength: 280,
      features: ['Concise messaging', 'Real-time updates', 'Trending topics'],
      audience: 'News-focused, quick updates'
    }
  ]

  const targetAudiences = [
    { id: 'first-time-buyers', label: 'First-Time Buyers', description: 'Young professionals, new families' },
    { id: 'luxury-buyers', label: 'Luxury Buyers', description: 'High-net-worth individuals' },
    { id: 'investors', label: 'Real Estate Investors', description: 'Investment-focused buyers' },
    { id: 'downsizers', label: 'Downsizers', description: 'Empty nesters, retirees' },
    { id: 'families', label: 'Growing Families', description: 'Families needing more space' }
  ]

  const contentGoals = [
    { id: 'generate-leads', label: 'Generate Leads', icon: Target },
    { id: 'brand-awareness', label: 'Brand Awareness', icon: Eye },
    { id: 'engagement', label: 'Boost Engagement', icon: Heart },
    { id: 'showcase-listing', label: 'Showcase Listing', icon: TrendingUp }
  ]

  const tones = [
    { id: 'professional', label: 'Professional', description: 'Authoritative and trustworthy' },
    { id: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { id: 'luxury', label: 'Luxury', description: 'Sophisticated and exclusive' },
    { id: 'casual', label: 'Casual', description: 'Relaxed and conversational' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const validateForm = () => {
    const isValid = formData.propertyType && 
                   formData.location && 
                   formData.keyFeatures && 
                   selectedPlatforms.length > 0
    
    console.log('Form validation result:', {
      propertyType: formData.propertyType,
      location: formData.location,
      keyFeatures: formData.keyFeatures,
      selectedPlatforms: selectedPlatforms,
      isValid: isValid
    })
    
    return isValid
  }

  const generateContent = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields and select at least one platform')
      return
    }

    if (usageCount >= 3) {
      alert('You have reached today\'s free usage limit (3 times)')
      return
    }

    console.log('Generate button clicked')
    console.log('Current form data:', formData)
    console.log('Selected platforms:', selectedPlatforms)

    setIsLoading(true)
    console.log('Starting content generation...')

    try {
      // 调用真实的API端点
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: 'social',
          propertyType: formData.propertyType,
          location: formData.location,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          squareFeet: formData.squareFeet,
          priceRange: formData.priceRange,
          specialFeatures: formData.keyFeatures,
          platform: selectedPlatforms[0], // 主要平台
          targetAudience: formData.targetAudience,
          emotion: formData.tone,
          contentGoal: formData.contentGoal
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.content) {
        // 为所有选中的平台生成内容
        const platformContent = {}
        selectedPlatforms.forEach(platformId => {
          platformContent[platformId] = {
            text: data.content,
            hashtags: data.hashtags || generateHashtags(formData, platformId),
            callToAction: generateCTA(formData.contentGoal, platformId),
            engagement: { likes: Math.floor(Math.random() * 200), comments: Math.floor(Math.random() * 50), shares: Math.floor(Math.random() * 30) }
          }
        })
        
        setGeneratedContent({ platforms: platformContent, metadata: { targetAudience: formData.targetAudience, contentGoal: formData.contentGoal, tone: formData.tone } })
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
        
        success('Content generated successfully', 'Social media content has been successfully generated!')
      } else {
        throw new Error('API returned empty content')
      }

    } catch (err) {
      console.error('Generation Error:', err)
      
      // 如果API失败，使用模拟内容作为后备
      warning('API call failed', 'Using mock content as fallback')
      const mockContent = generateMockContent(formData, selectedPlatforms)
      setGeneratedContent({ platforms: mockContent, metadata: { targetAudience: formData.targetAudience, contentGoal: formData.contentGoal, tone: formData.tone } })
      const newCount = usageTracker.incrementUsage()
      setUsageCount(newCount)
      
      // 使用错误处理器
      const { userMessage } = errorHandler.handleApiError(err, false)
      error('Generation failed', userMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockContent = (data, platforms) => {
    const baseContent = {
      propertyInfo: `${data.bedrooms}BR/${data.bathrooms}BA ${data.propertyType} in ${data.location}`,
      features: data.keyFeatures.split(',').map(f => f.trim()).filter(f => f),
      audience: targetAudiences.find(a => a.id === data.targetAudience)?.label,
      goal: contentGoals.find(g => g.id === data.contentGoal)?.label,
      tone: tones.find(t => t.id === data.tone)?.label
    }

    const platformContent = {}

    selectedPlatforms.forEach(platformId => {
      const platform = platforms.find(p => p.id === platformId)
      
      switch (platformId) {
        case 'facebook':
          platformContent[platformId] = {
            text: generateFacebookContent(baseContent, data),
            hashtags: generateHashtags(data, 'facebook'),
            callToAction: generateCTA(data.contentGoal, 'facebook'),
            engagement: { likes: 45, comments: 12, shares: 8 }
          }
          break
        case 'instagram':
          platformContent[platformId] = {
            text: generateInstagramContent(baseContent, data),
            hashtags: generateHashtags(data, 'instagram'),
            callToAction: generateCTA(data.contentGoal, 'instagram'),
            engagement: { likes: 127, comments: 23, shares: 15 }
          }
          break
        case 'linkedin':
          platformContent[platformId] = {
            text: generateLinkedInContent(baseContent, data),
            hashtags: generateHashtags(data, 'linkedin'),
            callToAction: generateCTA(data.contentGoal, 'linkedin'),
            engagement: { likes: 34, comments: 8, shares: 12 }
          }
          break
        case 'twitter':
          platformContent[platformId] = {
            text: generateTwitterContent(baseContent, data),
            hashtags: generateHashtags(data, 'twitter'),
            callToAction: generateCTA(data.contentGoal, 'twitter'),
            engagement: { likes: 89, retweets: 23, replies: 15 }
          }
          break
      }
    })

    return platformContent
  }

  const generateFacebookContent = (base, data) => {
    const toneMap = {
      professional: `🏡 JUST LISTED: ${base.propertyInfo}

This exceptional property offers everything you're looking for in your next home. Located in the desirable ${data.location} area, this ${data.propertyType.toLowerCase()} features ${data.squareFeet} sq ft of thoughtfully designed living space.

✨ Key Features:
${base.features.map(f => `• ${f}`).join('\n')}

Perfect for ${base.audience.toLowerCase()}, this property represents an outstanding opportunity in today's market.`,

      friendly: `🏠 Hey everyone! I'm so excited to share this amazing ${data.propertyType.toLowerCase()} that just hit the market in ${data.location}! 

This beautiful home has everything a family could want - ${data.bedrooms} bedrooms, ${data.bathrooms} bathrooms, and ${data.squareFeet} sq ft of pure comfort.

What makes this special? 
${base.features.map(f => `💫 ${f}`).join('\n')}

I can already picture the memories that will be made here! `,

      luxury: `🌟 EXCLUSIVE LISTING: Sophisticated ${data.propertyType} in Prestigious ${data.location}

Discover unparalleled elegance in this meticulously crafted residence spanning ${data.squareFeet} square feet. This distinguished property exemplifies luxury living at its finest.

Premier Features:
${base.features.map(f => `◆ ${f}`).join('\n')}

An extraordinary opportunity for the discerning buyer seeking excellence.`,

      casual: `🏡 New listing alert! Check out this awesome ${data.propertyType.toLowerCase()} in ${data.location} 

${data.bedrooms} beds, ${data.bathrooms} baths, ${data.squareFeet} sq ft of pure awesomeness! 

Here's what's cool about it:
${base.features.map(f => `🔥 ${f}`).join('\n')}

This one's gonna go fast! `
    }

    return toneMap[data.tone] || toneMap.professional
  }

  const generateInstagramContent = (base, data) => {
    const toneMap = {
      professional: `✨ JUST LISTED ✨
${base.propertyInfo}

Swipe to see why this property is perfect for your next chapter 📸

${base.features.slice(0, 3).map(f => `• ${f}`).join('\n')}

Ready to call this home? 🏡`,

      friendly: `🏠 DREAM HOME ALERT! 🏠

This gorgeous ${data.propertyType.toLowerCase()} in ${data.location} is giving me all the feels! 😍

${base.features.slice(0, 3).map(f => `💕 ${f}`).join('\n')}

Who's ready to fall in love? 💫`,

      luxury: `🌟 LUXURY UNVEILED 🌟

Presenting an exquisite ${data.propertyType.toLowerCase()} in the prestigious ${data.location} 

${base.features.slice(0, 3).map(f => `◆ ${f}`).join('\n')}

Where sophistication meets comfort ✨`,

      casual: `🔥 NEW DROP 🔥

This ${data.propertyType.toLowerCase()} in ${data.location} is absolutely fire! 

${base.features.slice(0, 3).map(f => `🚀 ${f}`).join('\n')}

Slide into my DMs for details! 📱`
    }

    return toneMap[data.tone] || toneMap.professional
  }

  const generateLinkedInContent = (base, data) => {
    return `🏢 MARKET UPDATE: Premium ${data.propertyType} Listed in ${data.location}

As a real estate professional, I'm pleased to present this exceptional property that exemplifies current market trends and buyer preferences.

Property Highlights:
${base.features.map(f => `• ${f}`).join('\n')}

This listing represents the quality and value that today's ${base.audience.toLowerCase()} are seeking. The ${data.location} market continues to show strong fundamentals with properties like this leading the way.

Interested in learning more about market opportunities in this area? Let's connect.

#RealEstate #${data.location.replace(/\s+/g, '')} #PropertyInvestment #MarketUpdate`
  }

  const generateTwitterContent = (base, data) => {
    const features = base.features.slice(0, 2).join(' & ')
    return `🏡 JUST LISTED: ${data.bedrooms}BR/${data.bathrooms}BA ${data.propertyType} in ${data.location}

${features}

Perfect for ${base.audience.toLowerCase()}! 

#RealEstate #${data.location.replace(/\s+/g, '')} #JustListed`
  }

  const generateHashtags = (data, platform) => {
    const baseHashtags = [
      '#RealEstate',
      `#${data.location.replace(/\s+/g, '')}`,
      '#JustListed',
      `#${data.propertyType.replace(/\s+/g, '')}`
    ]

    const platformSpecific = {
      facebook: ['#DreamHome', '#PropertyForSale', '#NewListing'],
      instagram: ['#HomeForSale', '#PropertyPhotography', '#RealEstateLife', '#DreamHome', '#NewListing'],
      linkedin: ['#PropertyInvestment', '#RealEstateMarket', '#CommercialRealEstate'],
      twitter: ['#PropertyAlert', '#HomeBuying']
    }

    return [...baseHashtags, ...platformSpecific[platform]].slice(0, platform === 'instagram' ? 10 : 5)
  }

  const generateCTA = (goal, platform) => {
    const ctas = {
      'generate-leads': {
        facebook: "Ready to schedule a viewing? Send me a message or call today!",
        instagram: "DM me for more details! 📱",
        linkedin: "Connect with me to discuss this opportunity.",
        twitter: "DM for details!"
      },
      'brand-awareness': {
        facebook: "Follow for more amazing properties in your area!",
        instagram: "Follow for daily property inspiration! ✨",
        linkedin: "Follow for market insights and premium listings.",
        twitter: "Follow for market updates!"
      },
      'engagement': {
        facebook: "What's your favorite feature? Let me know in the comments!",
        instagram: "Which room would be your favorite? Comment below! 👇",
        linkedin: "What trends are you seeing in your market? Share your thoughts.",
        twitter: "Thoughts on this listing?"
      },
      'showcase-listing': {
        facebook: "This property won't last long - contact me today!",
        instagram: "This beauty won't stay on the market long! 🏃‍♀️💨",
        linkedin: "Exceptional properties like this move quickly in today's market.",
        twitter: "This won't last long!"
      }
    }

    return ctas[goal]?.[platform] || "Contact me for more information!"
  }

  // 调度发布
  const schedulePost = (platform, content) => {
    if (!postSchedule.date || !postSchedule.time) {
      warning('Schedule settings', 'Please set publish date and time')
      return
    }

    const newScheduledPost = {
      id: Date.now(),
      platform,
      content,
      scheduledTime: new Date(`${postSchedule.date}T${postSchedule.time}`),
      status: 'scheduled'
    }
    setScheduledPosts(prev => [...prev, newScheduledPost])
    info('Schedule successful', 'Post has been successfully added to publish schedule')
  }

  const copyToClipboard = async (text, platform) => {
    try {
      await navigator.clipboard.writeText(text)
      success('Copy successful', `${platform} content has been copied to clipboard`)
    } catch (err) {
      console.error('Failed to copy text: ', err)
      error('Copy failed', 'Unable to copy to clipboard, please copy manually')
    }
  }

  const exportContent = (format) => {
    if (!generatedContent) return

    const content = Object.entries(generatedContent.platforms).map(([platform, data]) => {
      return `=== ${platform.toUpperCase()} ===\n\n${data.text}\n\nHashtags: ${data.hashtags.join(' ')}\n\nCall to Action: ${data.callToAction}\n\n`
    }).join('\n')

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `social-media-content-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (generatedContent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Social Media Content Generated</h1>
            <p className="text-gray-600">Platform-optimized content ready to post</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => exportContent('txt')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export All</span>
            </button>
            <button
              onClick={() => setGeneratedContent(null)}
              className="gradient-button"
            >
              <Sparkles size={20} />
              <span>Generate New</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {Object.entries(generatedContent.platforms).map(([platformId, content]) => {
            const platform = platforms.find(p => p.id === platformId)
            const IconComponent = platform.icon

            return (
              <div key={platformId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className={`bg-gradient-to-r ${
                  platform.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  platform.color === 'pink' ? 'from-pink-500 to-purple-600' :
                  platform.color === 'gray' ? 'from-gray-800 to-gray-900' :
                  'from-blue-500 to-blue-600'
                } text-white p-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent size={24} />
                      <div>
                        <h3 className="font-semibold">{platform.name}</h3>
                        <p className="text-sm opacity-90">{platform.audience}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm opacity-90">
                      <div>Max: {platform.maxLength} chars</div>
                      <div>Used: {content.text.length} chars</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Post Content</label>
                      <div className="bg-gray-50 rounded-lg p-4 relative">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">{content.text}</pre>
                        <button
                          onClick={() => copyToClipboard(content.text, platformId)}
                          className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded"
                        >
                          <Copy size={16} />
                        </button>
                        {copySuccess === platformId && (
                          <div className="absolute top-2 right-12 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Copied!
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags.map((tag, index) => (
                              <span key={index} className="text-blue-600 text-sm font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-green-800 text-sm">{content.callToAction}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Predicted Engagement</label>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3">
                        <div className="flex items-center space-x-6 text-sm">
                          {platformId === 'twitter' ? (
                            <>
                              <div className="flex items-center space-x-1">
                                <Heart size={16} className="text-red-500" />
                                <span>{content.engagement.likes} likes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Repeat2 size={16} className="text-green-500" />
                                <span>{content.engagement.retweets} retweets</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle size={16} className="text-blue-500" />
                                <span>{content.engagement.replies} replies</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center space-x-1">
                                <Heart size={16} className="text-red-500" />
                                <span>{content.engagement.likes} likes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle size={16} className="text-blue-500" />
                                <span>{content.engagement.comments} comments</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Share2 size={16} className="text-green-500" />
                                <span>{content.engagement.shares} shares</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Content Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Target Audience:</span> {generatedContent.metadata.targetAudience}
            </div>
            <div>
              <span className="font-medium">Content Goal:</span> {generatedContent.metadata.contentGoal}
            </div>
            <div>
              <span className="font-medium">Tone:</span> {generatedContent.metadata.tone}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Media Content Generator</h1>
            <p className="text-gray-600">Create platform-optimized content for Facebook, Instagram, LinkedIn, and Twitter</p>
          </div>
          <button
            onClick={() => {
              console.log('Clicked return button, navigating to dashboard')
              setCurrentPage('dashboard')
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Home size={20} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="space-y-8">
          {/* Property Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Share2 className="text-blue-600" size={20} />
              <span>Property Information</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select property type</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Austin, TX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                <input
                  type="number"
                  value={formData.squareFeet}
                  onChange={(e) => handleInputChange('squareFeet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="2000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <input
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => handleInputChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="$400,000 - $450,000"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features *</label>
              <textarea
                value={formData.keyFeatures}
                onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Updated kitchen, hardwood floors, large backyard, garage"
              />
            </div>
          </div>

          {/* Platform Selection */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <Target className="text-purple-600" size={20} />
              <span>Select Platforms</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform) => {
                const IconComponent = platform.icon
                const isSelected = selectedPlatforms.includes(platform.id)
                
                return (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        platform.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        platform.color === 'pink' ? 'bg-pink-100 text-pink-600' :
                        platform.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{platform.audience}</p>
                        <div className="text-xs text-gray-500">
                          <div>Max length: {platform.maxLength} characters</div>
                          <div className="mt-1">
                            {platform.features.map((feature, index) => (
                              <span key={index} className="inline-block bg-gray-100 rounded px-2 py-0.5 mr-1 mb-1">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-blue-600">
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content Strategy */}
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
              <BarChart3 className="text-green-600" size={20} />
              <span>Content Strategy</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Target Audience</label>
                <div className="space-y-2">
                  {targetAudiences.map((audience) => (
                    <label key={audience.id} className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="targetAudience"
                        value={audience.id}
                        checked={formData.targetAudience === audience.id}
                        onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{audience.label}</div>
                        <div className="text-xs text-gray-500">{audience.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Content Goal</label>
                <div className="space-y-2">
                  {contentGoals.map((goal) => {
                    const IconComponent = goal.icon
                    return (
                      <label key={goal.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="contentGoal"
                          value={goal.id}
                          checked={formData.contentGoal === goal.id}
                          onChange={(e) => handleInputChange('contentGoal', e.target.value)}
                        />
                        <IconComponent size={16} className="text-gray-600" />
                        <span className="text-sm text-gray-900">{goal.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tone</label>
                <div className="space-y-2">
                  {tones.map((tone) => (
                    <label key={tone.id} className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="tone"
                        value={tone.id}
                        checked={formData.tone === tone.id}
                        onChange={(e) => handleInputChange('tone', e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{tone.label}</div>
                        <div className="text-xs text-gray-500">{tone.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Usage Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700 font-medium">
                  Daily Usage: <span className="font-bold">{usageCount}</span>/3 generations
                </span>
              </div>
              {usageCount >= 3 && (
                <span className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded">
                  {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
                </span>
              )}
            </div>
            {usageCount >= 3 && (
              <div className="mt-2 text-xs text-blue-600 flex items-center space-x-1">
                <span>⏰</span>
                <span>Free quota exhausted - resets at midnight</span>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              console.log('Button was clicked')
              console.log('Button status check:', {
                validateForm: validateForm(),
                isLoading: isLoading,
                usageCount: usageCount,
                disabled: !validateForm() || isLoading || usageCount >= 3
              })
              generateContent()
            }}
            disabled={!validateForm() || isLoading || usageCount >= 3}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
              (!validateForm() || isLoading || usageCount >= 3) 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105 cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <ApiLoadingSpinner />
                <span>Generating content...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate Social Media Content</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SocialMediaGenerator