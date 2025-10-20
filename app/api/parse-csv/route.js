import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json(
        { error: 'Please select a CSV file' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Please upload a CSV format file' },
        { status: 400 }
      )
    }

    // Read file content
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file is empty' },
        { status: 400 }
      )
    }

    // Parse CSV
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const rows = lines.slice(1)

    // Find email and name columns
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
        { error: 'Email column not found, please ensure CSV file contains email field' },
        { status: 400 }
      )
    }

    // Parse data rows
    const contacts = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const email = values[emailIndex]
      const name = nameIndex !== -1 ? values[nameIndex] : ''

      // Simple email validation
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        contacts.push({
          email,
          name: name || email.split('@')[0],
          source: 'CSV Import',
          importedAt: new Date().toISOString()
        })
      }
    }

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: 'No valid email addresses found' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      contacts,
      message: `Successfully parsed ${contacts.length} contacts`,
      total: contacts.length
    })

  } catch (error) {
    console.error('CSV parsing error:', error)
    return NextResponse.json(
      { error: 'CSV file parsing failed, please check file format' },
      { status: 500 }
    )
  }
}