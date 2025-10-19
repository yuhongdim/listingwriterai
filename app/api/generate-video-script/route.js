import { NextResponse } from 'next/server'

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
      callToAction = '联系我们了解更多详情'
    } = await request.json()

    // 验证必填字段
    if (!propertyType || !location) {
      return NextResponse.json(
        { error: '房产类型和位置为必填项' },
        { status: 400 }
      )
    }

    // 使用星狐云API生成视频脚本
    const apiKey = process.env.XINGHU_API_KEY
    const apiUrl = process.env.XINGHU_API_URL

    if (!apiKey || !apiUrl) {
      // 如果没有配置API，返回模拟脚本
      return generateMockVideoScript({
        propertyType, location, bedrooms, bathrooms, squareFeet, 
        specialFeatures, duration, platform, style, keyFeatures, callToAction
      })
    }

    // 构建提示词
    const prompt = `请为以下房产生成一个${duration}秒的${platform}平台视频脚本，风格为${style}：

房产信息：
- 类型：${propertyType}
- 位置：${location}
- 卧室：${bedrooms}室
- 卫生间：${bathrooms}卫
- 面积：${squareFeet}平方米
- 特色：${specialFeatures}
- 重点特征：${keyFeatures.join('、')}

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

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error('API请求失败')
      }

      const data = await response.json()
      const script = data.choices?.[0]?.message?.content

      if (!script) {
        throw new Error('未获取到有效脚本')
      }

      return NextResponse.json({
        success: true,
        script: script,
        metadata: {
          duration,
          platform,
          style,
          propertyType,
          location
        }
      })

    } catch (apiError) {
      console.error('API调用失败:', apiError)
      // API失败时返回模拟脚本
      return generateMockVideoScript({
        propertyType, location, bedrooms, bathrooms, squareFeet, 
        specialFeatures, duration, platform, style, keyFeatures, callToAction
      })
    }

  } catch (error) {
    console.error('视频脚本生成错误:', error)
    return NextResponse.json(
      { error: '脚本生成失败，请重试' },
      { status: 500 }
    )
  }
}

function generateMockVideoScript({
  propertyType, location, bedrooms, bathrooms, squareFeet, 
  specialFeatures, duration, platform, style, keyFeatures, callToAction
}) {
  const script = `🎬 ${propertyType}视频脚本 - ${duration}秒版本

📍 地点：${location}
🏠 房型：${bedrooms}室${bathrooms}卫，${squareFeet}㎡
🎯 平台：${platform} | 风格：${style}

═══════════════════════════════════════

⏰ 【开场段】0-5秒
📹 画面：房产外观全景，阳光明媚
🎙️ 旁白："寻找理想家园？这里有一处${propertyType}等您发现！"
📝 拍摄建议：使用无人机拍摄，展现周边环境

⏰ 【介绍段】5-20秒  
📹 画面：从外观推进到室内，展示户型布局
🎙️ 旁白："位于${location}的${bedrooms}室${bathrooms}卫${propertyType}，${squareFeet}平方米的舒适空间，地理位置优越，交通便利。"
📝 拍摄建议：稳定器跟拍，流畅转场

⏰ 【特色段】20-${Math.max(45, duration-15)}秒
📹 画面：重点展示${specialFeatures || '精装修细节'}
🎙️ 旁白："${keyFeatures.length > 0 ? keyFeatures.join('，') : '精装修设计，品质生活从这里开始'}。每一处细节都彰显品质，每一寸空间都充满温馨。"
📝 拍摄建议：特写镜头展示亮点，配合柔和灯光

⏰ 【结尾段】${Math.max(45, duration-15)}-${duration}秒
📹 画面：回到客厅全景，温馨家庭氛围
🎙️ 旁白："${callToAction}，让我们为您开启美好生活新篇章！"
📝 拍摄建议：温暖色调，展现居住氛围

═══════════════════════════════════════

📋 拍摄清单：
✅ 外观全景（无人机）
✅ 室内布局（稳定器）  
✅ 特色细节（特写镜头）
✅ 生活场景（情景拍摄）

🎵 音乐建议：轻松愉悦的背景音乐，与旁白音量平衡

⚡ 后期要点：
- 转场自然流畅
- 字幕清晰易读
- 色调统一温馨
- 节奏紧凑有序`

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