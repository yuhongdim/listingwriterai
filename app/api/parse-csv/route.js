import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: '请选择CSV文件' },
        { status: 400 }
      )
    }

    // 检查文件类型
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: '请上传CSV格式文件' },
        { status: 400 }
      )
    }

    // 读取文件内容
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length === 0) {
      return NextResponse.json(
        { error: 'CSV文件为空' },
        { status: 400 }
      )
    }

    // 解析CSV
    const contacts = []
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    // 查找邮箱和姓名列
    const emailIndex = headers.findIndex(h => 
      h.toLowerCase().includes('email') || 
      h.toLowerCase().includes('邮箱') ||
      h.toLowerCase().includes('mail')
    )
    
    const nameIndex = headers.findIndex(h => 
      h.toLowerCase().includes('name') || 
      h.toLowerCase().includes('姓名') ||
      h.toLowerCase().includes('名字')
    )

    if (emailIndex === -1) {
      return NextResponse.json(
        { error: '未找到邮箱列，请确保CSV文件包含邮箱字段' },
        { status: 400 }
      )
    }

    // 解析数据行
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      
      if (values.length > emailIndex && values[emailIndex]) {
        const email = values[emailIndex]
        const name = nameIndex !== -1 && values[nameIndex] ? values[nameIndex] : email.split('@')[0]
        
        // 简单的邮箱验证
        if (email.includes('@') && email.includes('.')) {
          contacts.push({
            email,
            name,
            source: 'csv_import'
          })
        }
      }
    }

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: '未找到有效的邮箱地址' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `成功解析 ${contacts.length} 个联系人`,
      contacts,
      summary: {
        total: contacts.length,
        headers: headers
      }
    })

  } catch (error) {
    console.error('CSV解析错误:', error)
    return NextResponse.json(
      { error: 'CSV文件解析失败，请检查文件格式' },
      { status: 500 }
    )
  }
}