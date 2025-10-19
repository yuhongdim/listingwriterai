import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { 
      templateType, // welcome, follow-up, newsletter, promotion, thank-you
      recipientName,
      agentName,
      agencyName,
      propertyInfo,
      customMessage,
      tone = 'professional', // professional, friendly, formal, casual
      includeSignature = true,
      callToAction,
      subject
    } = await request.json()

    // 验证必填字段
    if (!templateType || !agentName) {
      return NextResponse.json(
        { error: '模板类型和经纪人姓名是必填字段' },
        { status: 400 }
      )
    }

    // 生成邮件模板
    const emailTemplate = await generateEmailTemplate({
      templateType,
      recipientName,
      agentName,
      agencyName,
      propertyInfo,
      customMessage,
      tone,
      includeSignature,
      callToAction,
      subject
    })

    return NextResponse.json({
      success: true,
      template: emailTemplate,
      metadata: {
        templateType,
        tone,
        generatedAt: new Date().toISOString(),
        wordCount: emailTemplate.body.split(' ').length
      }
    })

  } catch (error) {
    console.error('邮件模板生成错误:', error)
    return NextResponse.json(
      { error: '生成邮件模板时发生错误，请稍后重试' },
      { status: 500 }
    )
  }
}

// 邮件模板生成函数
async function generateEmailTemplate(data) {
  const {
    templateType,
    recipientName,
    agentName,
    agencyName,
    propertyInfo,
    customMessage,
    tone,
    includeSignature,
    callToAction,
    subject
  } = data

  const templates = {
    welcome: {
      subject: subject || `欢迎选择${agencyName || '我们的'}房地产服务`,
      body: `
${recipientName ? `亲爱的${recipientName}，` : '您好，'}

欢迎选择${agencyName || '我们'}的专业房地产服务！我是您的专属房产顾问${agentName}。

作为经验丰富的房地产专家，我致力于为您提供：
• 专业的市场分析和房产评估
• 个性化的房源推荐服务
• 全程透明的交易流程
• 贴心的售后跟进服务

${customMessage || '我们深知买房/卖房是人生中的重要决定，因此我们承诺为您提供最专业、最贴心的服务。'}

${callToAction || '如有任何房产相关问题，请随时联系我。期待为您服务！'}

${tone === 'friendly' ? '祝您生活愉快！' : '此致敬礼！'}
      `
    },
    'follow-up': {
      subject: subject || '房产咨询跟进 - 您的专属房产顾问',
      body: `
${recipientName ? `${recipientName}您好，` : '您好，'}

感谢您对我们房产服务的关注！我是${agentName}，想跟进一下您的房产需求。

${propertyInfo ? `关于您咨询的${propertyInfo}：` : '根据我们之前的沟通：'}

• 我已为您筛选了几套符合条件的优质房源
• 市场分析报告已准备就绪
• 可安排实地看房时间

${customMessage || '房地产市场变化较快，优质房源往往很快就会被预订。建议我们尽快安排看房，以免错过心仪的房产。'}

${callToAction || '请告知您方便的时间，我将为您安排专业的看房服务。'}

期待您的回复！
      `
    },
    newsletter: {
      subject: subject || '房地产市场月报 - 最新动态与投资机会',
      body: `
${recipientName ? `${recipientName}您好，` : '尊敬的客户，'}

欢迎阅读本月的房地产市场简报！我是${agentName}，为您带来最新的市场动态。

📊 **本月市场亮点**
• 房价走势：稳中有升，优质地段涨幅明显
• 成交量：环比上升15%，市场活跃度提高
• 热门区域：${propertyInfo || '市中心、学区房、地铁沿线'}

🏡 **精选房源推荐**
本月为您精选了几套高性价比房源，包括：
• 学区房：教育资源优质，升值潜力大
• 地铁房：交通便利，适合投资出租
• 新盘：现代化设计，配套设施完善

💡 **投资建议**
${customMessage || '当前市场环境下，建议关注地段优越、配套完善的房产，长期投资价值较高。'}

${callToAction || '如需了解详细信息或预约看房，请随时联系我。'}

祝您投资顺利！
      `
    },
    promotion: {
      subject: subject || '限时优惠 - 专属房产投资机会',
      body: `
${recipientName ? `${recipientName}您好，` : '尊敬的客户，'}

${agentName}为您带来一个难得的投资机会！

🎯 **限时特惠房源**
${propertyInfo || '精选优质房产现正优惠促销中：'}

• 💰 价格优势：低于市场价5-10%
• 🏆 品质保证：精装修，即买即住
• 📍 地段优越：核心区域，升值潜力大
• ⏰ 限时优惠：仅限本月，机不可失

🔥 **特别福利**
• 免费市场评估服务
• 专业投资建议咨询
• VIP看房绿色通道
• 贷款协助服务

${customMessage || '这样的机会不多见，建议您尽快行动。我们的专业团队随时为您服务。'}

${callToAction || '立即联系我预约看房，抢占先机！'}

机会有限，欲购从速！
      `
    },
    'thank-you': {
      subject: subject || '感谢您的信任 - 期待继续为您服务',
      body: `
${recipientName ? `亲爱的${recipientName}，` : '尊敬的客户，'}

感谢您选择${agencyName || '我们'}的房地产服务！作为您的房产顾问${agentName}，能为您成功完成房产交易，我感到非常荣幸。

🎉 **交易完成**
${propertyInfo ? `恭喜您成功${propertyInfo}！` : '恭喜您成功完成房产交易！'}

在整个服务过程中，您的信任和配合让我们深受感动。我们始终坚持：
• 专业诚信的服务态度
• 透明公开的交易流程  
• 贴心周到的客户关怀

🤝 **持续服务**
虽然交易已完成，但我们的服务并未结束：
• 房产市场动态定期分享
• 投资机会优先推荐
• 房产相关问题随时咨询

${customMessage || '您的满意是我们最大的动力。如果您身边有朋友需要房产服务，欢迎推荐给我们。'}

${callToAction || '再次感谢您的信任，期待未来继续为您和您的家人提供优质服务！'}

祝您生活愉快，投资顺利！
      `
    }
  }

  const template = templates[templateType] || templates.welcome
  
  // 生成签名
  const signature = includeSignature ? `

---
${agentName}
${agencyName ? `${agencyName} ` : ''}专业房产顾问
📱 电话：[您的电话号码]
📧 邮箱：[您的邮箱地址]
🌐 网站：[公司网站]
📍 地址：[公司地址]

💡 专业 | 诚信 | 高效 | 贴心
` : ''

  return {
    subject: template.subject,
    body: template.body.trim() + signature,
    templateType,
    tone
  }
}

// GET方法用于获取可用的模板类型
export async function GET() {
  return NextResponse.json({
    name: '邮件模板生成API',
    version: '1.0.0',
    description: '生成各种类型的房地产营销邮件模板',
    templateTypes: {
      welcome: '欢迎邮件 - 新客户欢迎信息',
      'follow-up': '跟进邮件 - 客户咨询跟进',
      newsletter: '通讯邮件 - 市场动态分享',
      promotion: '促销邮件 - 特惠房源推广',
      'thank-you': '感谢邮件 - 交易完成感谢'
    },
    tones: ['professional', 'friendly', 'formal', 'casual'],
    endpoints: {
      POST: {
        description: '生成邮件模板',
        parameters: {
          required: ['templateType', 'agentName'],
          optional: ['recipientName', 'agencyName', 'propertyInfo', 'customMessage', 'tone', 'includeSignature', 'callToAction', 'subject']
        }
      }
    }
  })
}