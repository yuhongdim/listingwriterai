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
    keyFeatures: '',
    callToAction: '联系我们了解更多详情'
  })
  const [generatedScript, setGeneratedScript] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const platforms = [
    { id: 'youtube', name: 'YouTube', duration: '60-180秒' },
    { id: 'tiktok', name: 'TikTok', duration: '15-60秒' },
    { id: 'instagram', name: 'Instagram', duration: '15-90秒' },
    { id: 'facebook', name: 'Facebook', duration: '30-120秒' }
  ]

  const styles = [
    { id: 'professional', name: '专业风格', desc: '正式、权威、突出专业性' },
    { id: 'lifestyle', name: '生活方式', desc: '温馨、舒适、强调生活品质' },
    { id: 'luxury', name: '奢华风格', desc: '高端、精致、突出独特性' },
    { id: 'modern', name: '现代简约', desc: '简洁、时尚、突出设计感' }
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
      alert(`您已达到今日免费使用限制（3次），${resetTime}`)
      return
    }

    if (!formData.propertyType || !formData.location || !formData.keyFeatures) {
      alert('请填写房产类型、位置和主要特色')
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
          location: formData.location || '优质地段',
          bedrooms: formData.bedrooms || '3',
          bathrooms: formData.bathrooms || '2',
          squareFeet: formData.squareFeet || '120',
          specialFeatures: formData.keyFeatures,
          keyFeatures: formData.keyFeatures.split('，').filter(f => f.trim()),
          callToAction: formData.callToAction || '联系我们了解更多详情'
        })
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedScript(data.script)
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
      } else {
        alert('生成失败：' + data.error)
        const mockScript = generateMockScript(formData)
        setGeneratedScript(mockScript)
        const newCount = usageTracker.incrementUsage()
        setUsageCount(newCount)
      }
    } catch (error) {
      console.error('视频脚本生成错误:', error)
      alert('生成失败，使用模拟脚本')
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
        time: '0-5秒',
        scene: '开场镜头',
        content: `欢迎来到这套令人惊艳的${data.propertyType}！`,
        shootingTip: '使用无人机拍摄房屋外观全景，配合动感音乐',
        visual: '房屋外观全景'
      },
      {
        time: '5-15秒',
        scene: '入户大厅',
        content: '一进门就能感受到宽敞明亮的空间设计',
        shootingTip: '从门口向内拍摄，展示空间层次感',
        visual: '入户门厅，突出空间感'
      },
      {
        time: '15-30秒',
        scene: '主要特色',
        content: `这里的${data.keyFeatures}让这个家与众不同`,
        shootingTip: '特写镜头展示房屋亮点，使用稳定器拍摄',
        visual: '房屋特色功能区域'
      },
      {
        time: '30-45秒',
        scene: '生活场景',
        content: '想象一下在这里的美好生活...',
        shootingTip: '拍摄生活化场景，营造温馨氛围',
        visual: '客厅、厨房等生活区域'
      },
      {
        time: '45-60秒',
        scene: '结尾呼吁',
        content: data.callToAction || '立即联系我们，预约看房！',
        shootingTip: '回到外观镜头，叠加联系方式',
        visual: '房屋外观 + 联系信息'
      }
    ]

    return {
      title: `${data.propertyType}展示视频脚本`,
      platform: platforms.find(p => p.id === data.platform)?.name,
      duration: `${data.duration}秒`,
      style: styles.find(s => s.id === data.style)?.name,
      segments,
      tips: [
        '保持镜头稳定，使用三脚架或稳定器',
        '注意光线，选择自然光充足的时间拍摄',
        '音乐要与房屋风格匹配',
        '每个镜头不要超过3-5秒',
        '添加字幕以提高观看体验'
      ]
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
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
          filename: `${generatedScript.title || '视频脚本'}_${Date.now()}.${format}`
        })
      })

      const data = await response.json()

      if (data.success) {
        if (format === 'pdf') {
          // 对于PDF，创建一个新窗口显示HTML内容，用户可以打印为PDF
          const newWindow = window.open('', '_blank')
          newWindow.document.write(data.content)
          newWindow.document.close()
        } else {
          // 对于TXT和CSV，直接下载
          const blob = new Blob([data.content], { type: data.mimeType })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.filename
          a.click()
          URL.revokeObjectURL(url)
        }
      } else {
        alert('导出失败：' + data.error)
      }
    } catch (error) {
      console.error('导出错误:', error)
      // 如果API失败，使用原来的简单导出方法
      const content = `${generatedScript.title}\n\n` +
        `平台: ${generatedScript.platform}\n` +
        `时长: ${generatedScript.duration}\n` +
        `风格: ${generatedScript.style}\n\n` +
        `分段脚本:\n` +
        generatedScript.segments.map(segment => 
          `${segment.time} - ${segment.scene}\n` +
          `内容: ${segment.content}\n` +
          `拍摄建议: ${segment.shootingTip}\n` +
          `视觉元素: ${segment.visual}\n\n`
        ).join('') +
        `拍摄小贴士:\n` +
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
      callToAction: '联系我们了解更多详情'
    })
    setGeneratedScript(null)
  }

  if (generatedScript) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">视频脚本已生成</h1>
            <p className="text-gray-600">专业的分段式视频脚本，包含拍摄建议</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(JSON.stringify(generatedScript, null, 2))}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Copy size={20} />
              <span>{copySuccess ? '已复制!' : '复制脚本'}</span>
            </button>
            <button
              onClick={() => exportScript('txt')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>导出TXT</span>
            </button>
            <div className="relative group">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                <Download size={20} />
                <span>更多格式</span>
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                <button
                  onClick={() => exportScript('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
                >
                  导出为 PDF
                </button>
                <button
                  onClick={() => exportScript('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
                >
                  导出为 CSV
                </button>
              </div>
            </div>
            <button
              onClick={reset}
              className="gradient-button"
            >
              <RotateCcw size={20} />
              重新生成
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
                <p className="text-sm text-gray-600">平台</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Clock size={24} className="text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.duration}</p>
                <p className="text-sm text-gray-600">时长</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Camera size={24} className="text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.style}</p>
                <p className="text-sm text-gray-600">风格</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Mic size={24} className="text-orange-600 mx-auto mb-2" />
                <p className="font-semibold text-gray-900">{generatedScript.segments.length}</p>
                <p className="text-sm text-gray-600">分段</p>
              </div>
            </div>
          </div>

          {/* Script Segments */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">分段脚本</h3>
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
                      <h5 className="font-medium text-gray-700 mb-2">📝 脚本内容</h5>
                      <p className="text-gray-600 text-sm">{segment.content}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">🎬 拍摄建议</h5>
                      <p className="text-gray-600 text-sm">{segment.shootingTip}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">👁️ 视觉元素</h5>
                      <p className="text-gray-600 text-sm">{segment.visual}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shooting Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">🎯 拍摄小贴士</h3>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">视频脚本生成器</h1>
        <p className="text-gray-600">创建专业的房产展示视频脚本，包含分段内容和拍摄建议</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">房产类型 *</label>
            <input
              type="text"
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="如：独栋别墅、公寓、联排别墅..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">房产位置 *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="如：市中心、学区房、海景房..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">卧室数量</label>
            <input
              type="number"
              value={formData.bedrooms}
              onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="如：3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">卫生间数量</label>
            <input
              type="number"
              value={formData.bathrooms}
              onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="如：2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">建筑面积（平方米）</label>
            <input
              type="number"
              value={formData.squareFeet}
              onChange={(e) => handleInputChange('squareFeet', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="如：120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">视频时长</label>
            <select
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="30">30秒</option>
              <option value="60">60秒</option>
              <option value="90">90秒</option>
              <option value="120">120秒</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">发布平台</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">视频风格</label>
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
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">主要特色 *</label>
            <textarea
              value={formData.keyFeatures}
              onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="描述房产的主要特色和亮点，如：开放式厨房、大理石台面、花园景观..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">行动呼吁</label>
            <input
              type="text"
              value={formData.callToAction}
              onChange={(e) => handleInputChange('callToAction', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="如：立即联系预约看房、扫码获取更多信息..."
            />
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700">
              今日剩余次数: <span className="font-semibold">{3 - usageCount}</span>/3
            </span>
            {usageCount >= 3 && (
              <span className="text-blue-600 text-xs">
                {typeof window !== 'undefined' && usageTracker.formatTimeUntilReset()}
              </span>
            )}
          </div>
          {usageCount >= 3 && (
            <div className="mt-1 text-xs text-blue-600">
              免费额度已用完，明日0点自动重置
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
                生成中...
              </>
            ) : usageCount >= 3 ? (
              '已达到今日免费使用限制'
            ) : (
              <>
                <Video size={20} />
                生成视频脚本
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoScript