# ListingWriter AI

AI-powered real estate marketing platform for generating listings, emails, and social media content.

## Features

- 🏠 **AI Listing Generator**: Create compelling property descriptions
- 📧 **Email Marketing**: Generate and send bulk email campaigns
- 📱 **Social Media Content**: Create engaging social media posts
- 🎬 **Video Scripts**: Generate professional video marketing scripts
- 📊 **Analytics Dashboard**: Track performance and engagement
- 💰 **Flexible Pricing**: Free, Professional, and Team plans

## Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yuhongdim/listingwriterai.git
cd listingwriterai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your OpenAI API key.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your GitHub repository
4. Add your environment variables in Vercel dashboard
5. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yuhongdim/listingwriterai)

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Email configuration (optional)
- `NEXT_PUBLIC_APP_URL`: Your app URL for production

## Pricing Plans

- **Free**: 3 generations per feature per day
- **Professional**: $29/month, 100 generations per day
- **Team**: $69/month, 500 generations per day

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- OpenAI API
- Vercel (deployment)

## About

An AI-powered property description generator designed specifically for real estate agents. Built with Next.js 14 and Tailwind CSS, integrated with advanced AI technology.

## Key Features

- 🏠 Intelligent property description generation
- 🎨 Three writing styles (Professional, Luxury, Modern)
- 📱 Responsive design with mobile support
- ⚡ Generate content in 60 seconds
- 📋 One-click copy functionality
- 🔒 Fair Housing Act compliant

## Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Advanced AI API (GPT-3.5-turbo)
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the `.env.local` file and add your AI API configuration:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key:
1. Visit your AI service provider console
2. Create an account and obtain an API key
3. Add the key to your `.env.local` file

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
listingwriterai/
├── app/
│   ├── api/generate/
│   │   └── route.js          # API routes
│   ├── globals.css           # Global styles
│   ├── layout.js            # Application layout
│   └── page.js              # Main page component
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── postcss.config.js        # PostCSS configuration
└── tailwind.config.js       # Tailwind configuration
```

## Deploy to Vercel

1. Push your code to GitHub repository
2. Import project on [Vercel](https://vercel.com)
3. Add environment variable `ANTHROPIC_API_KEY`
4. Deploy complete

## Usage Instructions

1. **Homepage**: Display product features and pricing
2. **Generator**: Fill in property information and select writing style
3. **Results Page**: View generated descriptions and copy with one click

## Important Notes

- Ensure Anthropic API key is valid
- Generated content complies with Fair Housing Act regulations
- Supports offline simulation content (when API fails)

## License

MIT License