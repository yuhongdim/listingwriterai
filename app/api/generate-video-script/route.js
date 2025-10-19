import { NextResponse } from 'next/server'
import aiClient from '../../utils/aiClient'

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

    try {
      // 使用AI客户端生成视频脚本
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
        script: result.content,
        usage: result.usage,
        model: result.model,
        metadata: {
          duration,
          platform,
          style,
          propertyType,
          location
        }
      })

    } catch (apiError) {
      console.error('AI API调用失败:', apiError)
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