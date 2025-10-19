import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { content, format, filename, type } = await request.json()

    if (!content || !format) {
      return NextResponse.json(
        { error: '内容和格式不能为空' },
        { status: 400 }
      )
    }

    let exportContent = ''
    let mimeType = ''
    let fileExtension = ''

    switch (format.toLowerCase()) {
      case 'txt':
        exportContent = formatTextContent(content, type)
        mimeType = 'text/plain'
        fileExtension = 'txt'
        break
      
      case 'csv':
        exportContent = formatCSVContent(content, type)
        mimeType = 'text/csv'
        fileExtension = 'csv'
        break
      
      case 'pdf':
        // 对于PDF，我们返回HTML内容，前端可以使用库如jsPDF或html2pdf转换
        exportContent = formatHTMLContent(content, type)
        mimeType = 'text/html'
        fileExtension = 'html'
        break
      
      default:
        return NextResponse.json(
          { error: '不支持的导出格式' },
          { status: 400 }
        )
    }

    const finalFilename = filename || `${type}_${Date.now()}.${fileExtension}`

    return NextResponse.json({
      success: true,
      content: exportContent,
      filename: finalFilename,
      mimeType,
      size: new Blob([exportContent]).size
    })

  } catch (error) {
    console.error('内容导出错误:', error)
    return NextResponse.json(
      { error: '导出失败，请重试' },
      { status: 500 }
    )
  }
}

function formatTextContent(content, type) {
  const timestamp = new Date().toLocaleString('zh-CN')
  
  switch (type) {
    case 'listing':
      return `房产文案 - ${timestamp}

${content.title || '房产标题'}

${content.description || content}

---
由 ListingWriterAI Pro 生成
生成时间：${timestamp}`

    case 'video-script':
      if (typeof content === 'string') {
        return `视频脚本 - ${timestamp}

${content}

---
由 ListingWriterAI Pro 生成
生成时间：${timestamp}`
      }
      
      return `视频脚本 - ${timestamp}

${content.title || '视频脚本'}
平台：${content.platform || '未指定'}
时长：${content.duration || '未指定'}
风格：${content.style || '未指定'}

${content.segments ? content.segments.map(segment => 
  `${segment.time} - ${segment.scene}
内容：${segment.content}
拍摄建议：${segment.shootingTip}
视觉元素：${segment.visual}
`).join('\n') : content}

${content.tips ? '拍摄小贴士：\n' + content.tips.map(tip => `• ${tip}`).join('\n') : ''}

---
由 ListingWriterAI Pro 生成
生成时间：${timestamp}`

    case 'email':
      return `邮件内容 - ${timestamp}

主题：${content.subject || '邮件主题'}

${content.body || content}

---
由 ListingWriterAI Pro 生成
生成时间：${timestamp}`

    default:
      return `${content}

---
由 ListingWriterAI Pro 生成
生成时间：${timestamp}`
  }
}

function formatCSVContent(content, type) {
  const timestamp = new Date().toLocaleString('zh-CN')
  
  switch (type) {
    case 'contacts':
      if (Array.isArray(content)) {
        const headers = ['姓名', '邮箱', '电话', '来源', '导入时间']
        const rows = content.map(contact => [
          contact.name || '',
          contact.email || '',
          contact.phone || '',
          contact.source || '',
          timestamp
        ])
        
        return [headers, ...rows]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n')
      }
      break
      
    case 'email-stats':
      const headers = ['指标', '数值', '导出时间']
      const rows = [
        ['发送总数', content.emailsSent || 0, timestamp],
        ['打开率', `${content.openRate || 0}%`, timestamp],
        ['点击率', `${content.clickRate || 0}%`, timestamp]
      ]
      
      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
        
    default:
      return `"内容","类型","导出时间"
"${content}","${type}","${timestamp}"`
  }
}

function formatHTMLContent(content, type) {
  const timestamp = new Date().toLocaleString('zh-CN')
  
  const baseHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${type === 'listing' ? '房产文案' : type === 'video-script' ? '视频脚本' : '内容导出'}</title>
    <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { border-bottom: 2px solid #007bff; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #007bff; font-size: 24px; font-weight: bold; margin: 0; }
        .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
        .content { margin-bottom: 30px; }
        .segment { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; }
        .segment-title { font-weight: bold; color: #007bff; margin-bottom: 10px; }
        .tips { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; }
        .footer { border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>`

  switch (type) {
    case 'video-script':
      if (typeof content === 'string') {
        return `${baseHTML}
    <div class="header">
        <h1 class="title">视频脚本</h1>
        <p class="subtitle">生成时间：${timestamp}</p>
    </div>
    <div class="content">
        <pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>
    </div>
    <div class="footer">
        <p>由 ListingWriterAI Pro 生成</p>
    </div>
</body>
</html>`
      }
      
      return `${baseHTML}
    <div class="header">
        <h1 class="title">${content.title || '视频脚本'}</h1>
        <p class="subtitle">平台：${content.platform} | 时长：${content.duration} | 风格：${content.style}</p>
        <p class="subtitle">生成时间：${timestamp}</p>
    </div>
    <div class="content">
        ${content.segments ? content.segments.map(segment => `
        <div class="segment">
            <div class="segment-title">${segment.time} - ${segment.scene}</div>
            <p><strong>内容：</strong>${segment.content}</p>
            <p><strong>拍摄建议：</strong>${segment.shootingTip}</p>
            <p><strong>视觉元素：</strong>${segment.visual}</p>
        </div>
        `).join('') : `<p>${content}</p>`}
        
        ${content.tips ? `
        <div class="tips">
            <h3>拍摄小贴士</h3>
            <ul>
                ${content.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    <div class="footer">
        <p>由 ListingWriterAI Pro 生成</p>
    </div>
</body>
</html>`

    default:
      return `${baseHTML}
    <div class="header">
        <h1 class="title">${type === 'listing' ? '房产文案' : '内容导出'}</h1>
        <p class="subtitle">生成时间：${timestamp}</p>
    </div>
    <div class="content">
        <div style="white-space: pre-wrap;">${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</div>
    </div>
    <div class="footer">
        <p>由 ListingWriterAI Pro 生成</p>
    </div>
</body>
</html>`
  }
}