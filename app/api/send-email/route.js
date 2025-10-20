import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { recipients, subject, content, senderName = 'ListingWriterAI' } = await request.json()

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Recipients list cannot be empty' },
        { status: 400 }
      )
    }

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Email subject and content cannot be empty' },
        { status: 400 }
      )
    }

    // Mock email sending (in real projects, integrate with Resend, SendGrid, etc.)
    const results = []
    
    for (const recipient of recipients) {
      // Mock sending delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Mock success rate (90%)
      const success = Math.random() > 0.1
      
      results.push({
        email: recipient.email,
        name: recipient.name,
        success,
        messageId: success ? `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null,
        error: success ? null : 'Send failed'
      })
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      success: true,
      message: `Email sending completed: ${successCount} successful, ${failureCount} failed`,
      results,
      summary: {
        total: results.length,
        success: successCount,
        failure: failureCount
      }
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Email sending failed, please try again' },
      { status: 500 }
    )
  }
}