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

    // Validate required fields
    if (!templateType || !agentName) {
      return NextResponse.json(
        { error: 'Template type and agent name are required fields' },
        { status: 400 }
      )
    }

    // Generate email template
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
    console.error('Email template generation error:', error)
    return NextResponse.json(
      { error: 'An error occurred while generating email template, please try again later' },
      { status: 500 }
    )
  }
}

// Email template generation function
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
      subject: subject || `Welcome to ${agencyName || 'our'} real estate services`,
      body: `
${recipientName ? `Dear ${recipientName},` : 'Hello,'}

Welcome to ${agencyName || 'our'} professional real estate services! I am ${agentName}, your dedicated property consultant.

As an experienced real estate expert, I am committed to providing you with:
• Professional market analysis and property evaluation
• Personalized property recommendation services
• Transparent transaction process throughout
• Thoughtful after-sales follow-up services

${customMessage || 'We understand that buying/selling a home is an important decision in life, so we promise to provide you with the most professional and caring service.'}

${callToAction || 'If you have any property-related questions, please feel free to contact me. Looking forward to serving you!'}

${tone === 'friendly' ? 'Wish you a pleasant life!' : 'Best regards!'}
      `
    },
    'follow-up': {
      subject: subject || 'Property Consultation Follow-up - Your Dedicated Property Consultant',
      body: `
${recipientName ? `Hello ${recipientName},` : 'Hello,'}

Thank you for your interest in our property services! I am ${agentName}, and I would like to follow up on your property needs.

${propertyInfo ? `Regarding the ${propertyInfo} you inquired about:` : 'Based on our previous communication:'}

• I have screened several quality properties that meet your criteria
• Market analysis report is ready
• Property viewing appointments can be arranged

${customMessage || 'The real estate market changes rapidly, and quality properties are often booked quickly. I suggest we arrange viewings as soon as possible to avoid missing your ideal property.'}

${callToAction || 'Please let me know your convenient time, and I will arrange professional property viewing services for you.'}

Looking forward to your reply!
      `
    },
    newsletter: {
      subject: subject || 'Real Estate Market Monthly Report - Latest Trends & Investment Opportunities',
      body: `
${recipientName ? `Hello ${recipientName},` : 'Dear valued client,'}

Welcome to this month's real estate market newsletter! I am ${agentName}, bringing you the latest market trends.

📊 **This Month's Market Highlights**
• Price trends: Steady growth with significant increases in prime locations
• Transaction volume: Up 15% month-over-month, increased market activity
• Hot areas: ${propertyInfo || 'City center, school districts, subway lines'}

🏡 **Featured Property Recommendations**
This month we've selected several high-value properties for you, including:
• School district properties: Quality educational resources, high appreciation potential
• Subway properties: Convenient transportation, suitable for rental investment
• New developments: Modern design, complete facilities

💡 **Investment Advice**
${customMessage || 'In the current market environment, we recommend focusing on properties with superior locations and complete facilities, which have higher long-term investment value.'}

${callToAction || 'For detailed information or to schedule viewings, please contact me anytime.'}

Wishing you successful investments!
      `
    },
    promotion: {
      subject: subject || 'Limited Time Offer - Exclusive Property Investment Opportunity',
      body: `
${recipientName ? `Hello ${recipientName},` : 'Dear valued client,'}

${agentName} brings you a rare investment opportunity!

🎯 **Limited Time Special Properties**
${propertyInfo || 'Selected quality properties now on promotional offer:'}

• 💰 Price advantage: 5-10% below market price
• 🏆 Quality guarantee: Fully renovated, move-in ready
• 📍 Prime location: Core area, high appreciation potential
• ⏰ Limited time offer: This month only, don't miss out

🔥 **Special Benefits**
• Free market evaluation service
• Professional investment consultation
• VIP property viewing fast track
• Loan assistance service

${customMessage || 'Such opportunities are rare, we recommend you act quickly. Our professional team is ready to serve you at any time.'}

${callToAction || 'Contact me immediately to schedule a viewing and seize the opportunity!'}

Limited opportunity, act fast!
      `
    },
    'thank-you': {
      subject: subject || 'Thank You for Your Trust - Looking Forward to Continuing to Serve You',
      body: `
${recipientName ? `Dear ${recipientName},` : 'Dear valued client,'}

Thank you for choosing ${agencyName || 'our'} real estate services! As your property consultant ${agentName}, I feel very honored to have successfully completed your property transaction.

🎉 **Transaction Completed**
${propertyInfo ? `Congratulations on successfully ${propertyInfo}!` : 'Congratulations on successfully completing your property transaction!'}

Throughout the entire service process, your trust and cooperation have deeply moved us. We always adhere to:
• Professional and honest service attitude
• Transparent and open transaction process
• Thoughtful and considerate customer care

🤝 **Continued Service**
Although the transaction is complete, our service doesn't end here:
• Regular sharing of property market trends
• Priority recommendations for investment opportunities
• Property-related questions available for consultation anytime

${customMessage || 'Your satisfaction is our greatest motivation. If you have friends who need property services, we welcome your referrals.'}

${callToAction || 'Thank you again for your trust, and we look forward to continuing to provide quality services for you and your family in the future!'}

Wishing you a pleasant life and successful investments!
      `
    }
  }

  const template = templates[templateType] || templates.welcome
  
  // Generate signature
  const signature = includeSignature ? `

---
${agentName}
${agencyName ? `${agencyName} ` : ''}Professional Property Consultant
📱 Phone: [Your phone number]
📧 Email: [Your email address]
🌐 Website: [Company website]
📍 Address: [Company address]

💡 Professional | Honest | Efficient | Caring
` : ''

  return {
    subject: template.subject,
    body: template.body.trim() + signature,
    templateType,
    tone
  }
}

// GET method for retrieving available template types
export async function GET() {
  return NextResponse.json({
    name: 'Email Template Generation API',
    version: '1.0.0',
    description: 'Generate various types of real estate marketing email templates',
    templateTypes: {
      welcome: 'Welcome Email - New customer welcome message',
      'follow-up': 'Follow-up Email - Customer inquiry follow-up',
      newsletter: 'Newsletter Email - Market trends sharing',
      promotion: 'Promotional Email - Special property promotion',
      'thank-you': 'Thank You Email - Transaction completion thanks'
    },
    tones: ['professional', 'friendly', 'formal', 'casual'],
    endpoints: {
      POST: {
        description: 'Generate email template',
        parameters: {
          required: ['templateType', 'agentName'],
          optional: ['recipientName', 'agencyName', 'propertyInfo', 'customMessage', 'tone', 'includeSignature', 'callToAction', 'subject']
        }
      }
    }
  })
}