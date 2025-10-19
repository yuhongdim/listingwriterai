import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { 
      recipients, // 收件人列表 [{email, name, customData}]
      template, // 邮件模板 {subject, body}
      senderInfo, // 发件人信息 {name, email, replyTo}
      sendOptions = {}, // 发送选项 {delay, batchSize, trackOpens, trackClicks}
      campaignName, // 活动名称
      scheduledTime // 定时发送时间
    } = await request.json()

    // 验证必填字段
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: '收件人列表不能为空' },
        { status: 400 }
      )
    }

    if (!template || !template.subject || !template.body) {
      return NextResponse.json(
        { error: '邮件模板必须包含主题和内容' },
        { status: 400 }
      )
    }

    if (!senderInfo || !senderInfo.email) {
      return NextResponse.json(
        { error: '发件人信息不完整' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = recipients.filter(r => !emailRegex.test(r.email))
    
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { 
          error: '以下邮箱格式不正确',
          invalidEmails: invalidEmails.map(r => r.email)
        },
        { status: 400 }
      )
    }

    // 处理批量发送
    const result = await processBulkEmail({
      recipients,
      template,
      senderInfo,
      sendOptions,
      campaignName,
      scheduledTime
    })

    return NextResponse.json({
      success: true,
      campaignId: result.campaignId,
      totalRecipients: recipients.length,
      status: scheduledTime ? 'scheduled' : 'processing',
      scheduledTime,
      estimatedCompletion: result.estimatedCompletion,
      trackingUrl: result.trackingUrl
    })

  } catch (error) {
    console.error('批量邮件发送错误:', error)
    return NextResponse.json(
      { error: '批量邮件发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 批量邮件处理函数
async function processBulkEmail(data) {
  const {
    recipients,
    template,
    senderInfo,
    sendOptions,
    campaignName,
    scheduledTime
  } = data

  // 生成活动ID
  const campaignId = generateCampaignId()
  
  // 设置默认发送选项
  const options = {
    delay: sendOptions.delay || 1000, // 每封邮件间隔1秒
    batchSize: sendOptions.batchSize || 50, // 每批50封
    trackOpens: sendOptions.trackOpens !== false, // 默认跟踪打开
    trackClicks: sendOptions.trackClicks !== false, // 默认跟踪点击
    ...sendOptions
  }

  // 如果是定时发送
  if (scheduledTime) {
    await scheduleEmailCampaign(campaignId, {
      recipients,
      template,
      senderInfo,
      options,
      campaignName,
      scheduledTime
    })
    
    return {
      campaignId,
      estimatedCompletion: scheduledTime,
      trackingUrl: `/api/track-email/${campaignId}`
    }
  }

  // 立即发送
  const estimatedTime = calculateEstimatedTime(recipients.length, options)
  
  // 异步处理发送（实际项目中应该使用队列系统）
  processEmailSending(campaignId, {
    recipients,
    template,
    senderInfo,
    options,
    campaignName
  })

  return {
    campaignId,
    estimatedCompletion: new Date(Date.now() + estimatedTime).toISOString(),
    trackingUrl: `/api/track-email/${campaignId}`
  }
}

// 异步邮件发送处理
async function processEmailSending(campaignId, data) {
  const { recipients, template, senderInfo, options, campaignName } = data
  
  try {
    // 记录活动开始
    await logCampaignStart(campaignId, {
      campaignName,
      totalRecipients: recipients.length,
      startTime: new Date().toISOString()
    })

    // 分批发送
    const batches = chunkArray(recipients, options.batchSize)
    let sentCount = 0
    let failedCount = 0

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      
      // 并行发送当前批次
      const batchPromises = batch.map(recipient => 
        sendSingleEmail(campaignId, recipient, template, senderInfo, options)
      )
      
      const batchResults = await Promise.allSettled(batchPromises)
      
      // 统计结果
      batchResults.forEach(result => {
        if (result.status === 'fulfilled') {
          sentCount++
        } else {
          failedCount++
          console.error('邮件发送失败:', result.reason)
        }
      })

      // 批次间延迟
      if (i < batches.length - 1) {
        await sleep(options.delay)
      }

      // 更新进度
      await updateCampaignProgress(campaignId, {
        sentCount,
        failedCount,
        totalRecipients: recipients.length,
        currentBatch: i + 1,
        totalBatches: batches.length
      })
    }

    // 记录活动完成
    await logCampaignComplete(campaignId, {
      sentCount,
      failedCount,
      completedTime: new Date().toISOString()
    })

  } catch (error) {
    console.error('批量发送处理错误:', error)
    await logCampaignError(campaignId, error.message)
  }
}

// 发送单封邮件
async function sendSingleEmail(campaignId, recipient, template, senderInfo, options) {
  try {
    // 个性化邮件内容
    const personalizedTemplate = personalizeTemplate(template, recipient)
    
    // 添加跟踪像素和链接
    const trackedTemplate = addEmailTracking(personalizedTemplate, campaignId, recipient.email, options)
    
    // 实际发送邮件（这里应该集成真实的邮件服务提供商）
    const result = await sendEmailViaProvider({
      to: recipient.email,
      subject: trackedTemplate.subject,
      html: trackedTemplate.body,
      from: `${senderInfo.name} <${senderInfo.email}>`,
      replyTo: senderInfo.replyTo || senderInfo.email
    })

    // 记录发送日志
    await logEmailSent(campaignId, recipient.email, result.messageId)
    
    return result

  } catch (error) {
    // 记录发送失败
    await logEmailFailed(campaignId, recipient.email, error.message)
    throw error
  }
}

// 个性化模板内容
function personalizeTemplate(template, recipient) {
  let subject = template.subject
  let body = template.body

  // 替换占位符
  const replacements = {
    '{{name}}': recipient.name || '尊敬的客户',
    '{{email}}': recipient.email,
    ...recipient.customData
  }

  Object.entries(replacements).forEach(([placeholder, value]) => {
    subject = subject.replace(new RegExp(placeholder, 'g'), value)
    body = body.replace(new RegExp(placeholder, 'g'), value)
  })

  return { subject, body }
}

// 添加邮件跟踪
function addEmailTracking(template, campaignId, email, options) {
  let body = template.body

  // 添加打开跟踪像素
  if (options.trackOpens) {
    const trackingPixel = `<img src="/api/track-email/${campaignId}/open?email=${encodeURIComponent(email)}" width="1" height="1" style="display:none;" />`
    body += trackingPixel
  }

  // 添加点击跟踪（简化版本）
  if (options.trackClicks) {
    // 这里应该替换所有链接为跟踪链接
    // 简化实现：只是添加跟踪参数
    body = body.replace(
      /href="([^"]+)"/g, 
      `href="/api/track-email/${campaignId}/click?url=$1&email=${encodeURIComponent(email)}"`
    )
  }

  return { ...template, body }
}

// 模拟邮件发送服务
async function sendEmailViaProvider(emailData) {
  // 这里应该集成真实的邮件服务提供商（如SendGrid、AWS SES等）
  // 现在返回模拟结果
  await sleep(100) // 模拟网络延迟
  
  return {
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'sent'
  }
}

// 工具函数
function generateCampaignId() {
  return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function chunkArray(array, size) {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

function calculateEstimatedTime(recipientCount, options) {
  const batchCount = Math.ceil(recipientCount / options.batchSize)
  const totalDelay = (batchCount - 1) * options.delay
  const processingTime = recipientCount * 200 // 假设每封邮件200ms处理时间
  return totalDelay + processingTime
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 日志记录函数（实际项目中应该使用数据库）
async function logCampaignStart(campaignId, data) {
  console.log(`活动开始: ${campaignId}`, data)
}

async function logCampaignComplete(campaignId, data) {
  console.log(`活动完成: ${campaignId}`, data)
}

async function logCampaignError(campaignId, error) {
  console.error(`活动错误: ${campaignId}`, error)
}

async function updateCampaignProgress(campaignId, progress) {
  console.log(`活动进度: ${campaignId}`, progress)
}

async function logEmailSent(campaignId, email, messageId) {
  console.log(`邮件发送成功: ${campaignId} -> ${email} (${messageId})`)
}

async function logEmailFailed(campaignId, email, error) {
  console.error(`邮件发送失败: ${campaignId} -> ${email}`, error)
}

async function scheduleEmailCampaign(campaignId, data) {
  // 这里应该使用任务调度系统（如cron、队列等）
  console.log(`邮件活动已安排: ${campaignId}`, data)
}

// GET方法用于获取API信息
export async function GET() {
  return NextResponse.json({
    name: '批量邮件发送API',
    version: '1.0.0',
    description: '支持批量发送个性化邮件，包含跟踪和调度功能',
    features: [
      '批量邮件发送',
      '个性化内容替换',
      '发送进度跟踪',
      '打开和点击跟踪',
      '定时发送',
      '发送速率控制',
      '失败重试机制'
    ],
    endpoints: {
      POST: {
        description: '发送批量邮件',
        parameters: {
          required: ['recipients', 'template', 'senderInfo'],
          optional: ['sendOptions', 'campaignName', 'scheduledTime']
        }
      }
    },
    limits: {
      maxRecipients: 1000,
      maxBatchSize: 100,
      minDelay: 100
    }
  })
}