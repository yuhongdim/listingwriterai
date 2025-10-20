'use client'

import { useState } from 'react'
import { 
  Video, 
  Clock, 
  Camera, 
  Mic, 
  Download,
  Copy,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import usageTracker from '../utils/usageTracker'

const VideoScript = ({ usageCount, setUsageCount }) => {
  const [formData, setFormData] = useState({
    propertyType: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    duration: '60',
    platform: 'youtube',
    style: 'professional',
    videoType: 'property-tour',
    keyFeatures: '',
    callToAction: 'Contact us for more details',
    targetAudience: 'buyers',
    mood: 'inspiring'
  })
  const [generatedScript, setGeneratedScript] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const platforms = [
    { id: 'youtube', name: 'YouTube', duration: '60-180 seconds', icon: '📺' },
    { id: 'tiktok', name: 'TikTok', duration: '15-60 seconds', icon: '🎵' },
    { id: 'instagram', name: 'Instagram Reels', duration: '15-90 seconds', icon: '📸' },
    { id: 'facebook', name: 'Facebook', duration: '30-120 seconds', icon: '👥' },
    { id: 'linkedin', name: 'LinkedIn', duration: '30-90 seconds', icon: '💼' }
  ]

  const videoTypes = [
    { id: 'property-tour', name: 'Property Tour', desc: 'Complete walkthrough of the property' },
    { id: 'neighborhood-guide', name: 'Neighborhood Guide', desc: 'Showcase local amenities and lifestyle' },
    { id: 'testimonial', name: 'Client Testimonial', desc: 'Happy client sharing their experience' },
    { id: 'market-update', name: 'Market Update', desc: 'Local real estate market insights' },
    { id: 'listing-highlight', name: 'Listing Highlight', desc: 'Quick showcase of key features' },
    { id: 'agent-intro', name: 'Agent Introduction', desc: 'Personal brand and expertise showcase' },
    { id: 'before-after', name: 'Before & After', desc: 'Property transformation story' },
    { id: 'investment-analysis', name: 'Investment Analysis', desc: 'ROI and investment potential' }
  ]

  const styles = [
    { id: 'professional', name: 'Professional', desc: 'Formal, authoritative, business-focused', color: 'blue' },
    { id: 'lifestyle', name: 'Lifestyle', desc: 'Warm, comfortable, life-quality focused', color: 'green' },
    { id: 'luxury', name: 'Luxury', desc: 'High-end, sophisticated, exclusive', color: 'purple' },
    { id: 'modern', name: 'Modern', desc: 'Clean, trendy, design-focused', color: 'gray' },
    { id: 'storytelling', name: 'Storytelling', desc: 'Narrative-driven, emotional connection', color: 'pink' },
    { id: 'educational', name: 'Educational', desc: 'Informative, helpful, expert guidance', color: 'orange' }
  ]

  const targetAudiences = [
    { id: 'buyers', name: 'Home Buyers', desc: 'People looking to purchase' },
    { id: 'sellers', name: 'Home Sellers', desc: 'Property owners wanting to sell' },
    { id: 'investors', name: 'Real Estate Investors', desc: 'Investment-focused audience' },
    { id: 'renters', name: 'Renters', desc: 'People looking for rental properties' },
    { id: 'first-time', name: 'First-Time Buyers', desc: 'New to real estate market' }
  ]

  const moods = [
    { id: 'inspiring', name: 'Inspiring', desc: 'Motivational and uplifting' },
    { id: 'trustworthy', name: 'Trustworthy', desc: 'Reliable and professional' },
    { id: 'exciting', name: 'Exciting', desc: 'Energetic and dynamic' },
    { id: 'calming', name: 'Calming', desc: 'Peaceful and reassuring' },
    { id: 'urgent', name: 'Urgent', desc: 'Time-sensitive and compelling' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateScript = async () => {
    if (!usageTracker.canUse()) {
      const resetTime = usageTracker.formatTimeUntilReset()
      alert(`You've reached today's free usage limit (3 times), ${resetTime}`)
      return
    }

    if (!formData.propertyType || !formData.location || !formData.keyFeatures) {
      alert('Please fill in property type, location, and key features')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-video-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          location: formData.location || 'Prime location',
          bedrooms: formData.bedrooms || '3',
          bathrooms: formData.bathrooms || '2',
          squareFeet: formData.squareFeet || '120',
          specialFeatures: formData.keyFeatures,
          keyFeatures: formData.keyFeatures.split('，').filter(f => f.trim()),
          callToAction: formData.callToAction || 'Contact us for more details'
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedScript(data.script)
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
      } else {
        alert('Generation failed: ' + data.error)
        const mockScript = generateMockScript(formData)
        setGeneratedScript(mockScript)
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
      }
    } catch (error) {
      console.error('Video script generation error:', error)
      alert('Generation failed, using mock script')
      const mockScript = generateMockScript(formData)
      setGeneratedScript(mockScript)
      const newCount = usageTracker.incrementUsage()
      setUsageCount(newCount)
    }

    setIsLoading(false)
  }

  const generateMockScript = (data) => {
    const segments = [
      {
        time: '0-5s',
        scene: 'Opening Shot',
        content: `Welcome to this stunning ${data.propertyType}!`,
        shootingTip: 'Use drone to capture exterior panoramic view with dynamic music',
        visual: 'Exterior panoramic view'
      },
      {
        time: '5-15s',
        scene: 'Entrance Hall',
        content: 'Step inside and feel the spacious and bright design',
        shootingTip: 'Shoot from entrance inward to show spatial depth',
        visual: 'Entrance foyer highlighting spaciousness'
      },
      {
        time: '15-30s',
        scene: 'Key Features',
        content: `The ${data.keyFeatures} makes this home truly unique`,
        shootingTip: 'Close-up shots of property highlights using stabilizer',
        visual: 'Property feature areas'
      },
      {
        time: '30-45s',
        scene: 'Lifestyle Scene',
        content: 'Imagine the wonderful life you could have here...',
        shootingTip: 'Capture lifestyle scenes to create warm atmosphere',
        visual: 'Living room, kitchen and other living areas'
      },
      {
        time: '45-60s',
        scene: 'Call to Action',
        content: data.callToAction || 'Contact us now to schedule a viewing!',
        shootingTip: 'Return to exterior shot with contact information overlay',
        visual: 'Exterior view + contact information'
      }
    ]

    return {
      title: `${data.propertyType} Showcase Video Script`,
      platform: platforms.find(p => p.id === data.platform)?.name,
      duration: `${data.duration} seconds`,
      style: styles.find(s => s.id === data.style)?.name,
      segments,
      tips: [
        'Keep camera steady, use tripod or stabilizer',
        'Pay attention to lighting, shoot during natural light hours',
        'Music should match the property style',
        'Keep each shot under 3-5 seconds',
        'Add subtitles to improve viewing experience'
      ]
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const exportScript = async (format = 'txt') => {
    if (!generatedScript) return

    try {
      const response = await fetch('/api/export-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generatedScript,
          format: format,
          type: 'video-script',
          filename: `${generatedScript.title || 'Video Script'}_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          // For PDF, create a new window to display HTML content, user can print as PDF
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          // For TXT and CSV, download directly
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        alert('Export failed: ' + data.error)
      }
    } catch (error) {
      console.error('Export error:', error)
      // If API fails, use simple export method
      const content = `${generatedScript.title}\n\n` +
        `Platform: ${generatedScript.platform}\n` +
        `Duration: ${generatedScript.duration}\n` +
        `Style: ${generatedScript.style}\n\n` +
        `Script Segments:\n` +
        generatedScript.segments.map(segment => 
          `${segment.time} - ${segment.scene}\n` +
          `Content: ${segment.content}\n` +
          `Shooting Tip: ${segment.shootingTip}\n` +
          `Visual Elements: ${segment.visual}\n\n`
        ).join('') +
        `Shooting Tips:\n` +
        generatedScript.tips.map(tip => `• ${tip}`).join('\n')

      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${generatedScript.title}.txt`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const reset = () => {
    setFormData({
      propertyType: '',
      location: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      duration: '60',
      platform: 'youtube',
      style: 'professional',
      keyFeatures: '',
      callToAction: 'Contact us for more details'
    })
    setGeneratedScript(null)
  }

  if (generatedScript) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Script Generated</h1>
            <p className="text-gray-600">Professional segmented video script with shooting suggestions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(JSON.stringify(generatedScript, null, 2))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Copy size={20} />
              <span>{copySuccess ? 'Copied!' : 'Copy Script'}</span>
            </button>
            <button
              onClick={() => exportScript('txt')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export TXT</span>
            </button>
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download size={20} />
                <span>More Formats</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                <button
                  onClick={() => exportScript('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => exportScript('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
                >
                  Export as CSV
                </button>
              </div>
            </div>
            <button
              onClick={reset}
              className="gradient-button"
            >
              <RotateCcw size={20} />
              Regenerate
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Script Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Video size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.platform}</p>
                <p className="text-sm text-gray-600">Platform</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock size={24} className="text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.duration}</p>
                <p className="text-sm text-gray-600">Duration</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Camera size={24} className="text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.style}</p>
                <p className="text-sm text-gray-600">Style</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Mic size={24} className="text-orange-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.segments.length}</p>
                <p className="text-sm text-gray-600">Segments</p>
              </div>
            </div>
          </div>

          {/* Script Segments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Script Segments</h3>
            <div className="space-y-4">
              {generatedScript.segments.map((segment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {segment.time}
                      </span>
                      <h4 className="font-semibold text-gray-900">{segment.scene}</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">📝 Script Content</h5>
                      <p className="text-gray-600 text-sm">{segment.content}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">🎬 Shooting Tips</h5>
                      <p className="text-gray-600 text-sm">{segment.shootingTip}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">👁️ Visual Elements</h5>
                      <p className="text-gray-600 text-sm">{segment.visual}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shooting Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">🎯 Shooting Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedScript.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <p className="text-gray-700 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Video Script Generator</h1>
        <p className="text-gray-600">Create professional real estate video scripts with segmented content and shooting suggestions</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
            <input
              type="text"
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g.: Single-family home, Apartment, Townhouse..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g.: Downtown, School district, Waterfront..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Bedrooms</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g.: 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Bathrooms</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g.: 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Floor Area (sq ft)</label>
            <input
              type="number"
              value={formData.squareFeet}
              onChange={(e) => handleInputChange('squareFeet', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g.: 1200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Duration</label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="90">90 seconds</option>
              <option value="120">120 seconds</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Publishing Platform</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {platforms.map((platform) => (
                <label key={platform.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="platform"
                    value={platform.id}
                    checked={formData.platform === platform.id}
                    onChange={(e) => handleInputChange('platform', e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-sm">{platform.name}</p>
                    <p className="text-xs text-gray-500">{platform.duration}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Style</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {styles.map((style) => (
                <label key={style.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="style"
                    value={style.id}
                    checked={formData.style === style.id}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-sm">{style.name}</p>
                    <p className="text-xs text-gray-500">{style.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {videoTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="videoType"
                    value={type.id}
                    checked={formData.videoType === type.id}
                    onChange={(e) => handleInputChange('videoType', e.target.value)}
                    className="text-blue-600"
                  />
                  <div>
                    <p className="font-medium text-sm">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
            <select
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {targetAudiences.map((audience) => (
                <option key={audience.id} value={audience.id}>{audience.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video Mood</label>
            <select
              value={formData.mood}
              onChange={(e) => handleInputChange('mood', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {moods.map((mood) => (
                <option key={mood.id} value={mood.id}>{mood.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Features *</label>
            <textarea
              value={formData.keyFeatures}
              onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the main features and highlights of the property, e.g.: Open-plan kitchen, Marble countertops, Garden views..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action</label>
            <input
              type="text"
              value={formData.callToAction}
              onChange={(e) => handleInputChange('callToAction', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g.: Contact us now to schedule a viewing, Scan QR code for more information..."
            />
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              Remaining uses today: <span className="font-semibold">{3 - usageCount}</span>/3
            </span>
            {usageCount >= 3 && (
              <span className="text-blue-600 text-xs">
                {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
              </span>
            )}
          </div>
          {usageCount >= 3 && (
            <div className="mt-1 text-xs text-blue-600">
              Free quota used up, resets automatically at 0:00 tomorrow
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={generateScript}
            disabled={isLoading || usageCount >= 3}
            className="gradient-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Generating...
              </>
            ) : usageCount >= 3 ? (
              'Daily free usage limit reached'
            ) : (
              <>
                <Video size={20} />
                Generate Video Script
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoScript