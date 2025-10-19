import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { recipients, subject, content, senderName = 'ListingWriterAI' } = await request.json()

    // 验证必填字段
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: '收件人列表不能为空' },
        { status: 400 }
      )
    }

    if (!subject || !content) {
      return NextResponse.json(
        { error: '邮件主题和内容不能为空' },
        { status: 400 }
      )
    }

    // 模拟邮件发送（实际项目中可以集成 Resend、SendGrid 等服务）
    const results = []
    
    for (const recipient of recipients) {
      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 模拟发送成功率（90%）
      const success = Math.random() > 0.1
      
      results.push({
        email: recipient.email,
        name: recipient.name,
        success,
        messageId: success ? `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null,
        error: success ? null : '发送失败'
      })
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      message: `邮件发送完成：成功 ${successCount} 封，失败 ${failureCount} 封`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failure: failureCount
      }
    })

  } catch (error) {
    console.error('邮件发送错误:', error)
    return NextResponse.json(
      { error: '邮件发送失败，请重试' },
      { status: 500 }
    )
  }
}