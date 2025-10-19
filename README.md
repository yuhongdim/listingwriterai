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

一个基于 AI 的房产描述生成器，专为房地产经纪人设计。使用 Next.js 14 和 Tailwind CSS 构建，集成星狐云API。

## 功能特性

- 🏠 智能房产描述生成
- 🎨 三种写作风格（专业、奢华、现代）
- 📱 响应式设计，支持移动端
- ⚡ 60秒快速生成
- 📋 一键复制功能
- 🔒 符合 Fair Housing Act 规定

## 技术栈

- **前端**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **AI**: 星狐云API (GPT-3.5-turbo)
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并添加您的星狐云API配置：

```bash
XINGHU_API_KEY=your_xinghu_api_key_here
XINGHU_API_URL=https://xinghuapi.com/v1/chat/completions
```

获取 API 密钥：
1. 访问 [星狐云控制台](https://xinghuapi.com/console)
2. 创建账户并获取 API 密钥
3. 将密钥添加到 `.env.local` 文件

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
listingwriterai/
├── app/
│   ├── api/generate/
│   │   └── route.js          # API 路由
│   ├── globals.css           # 全局样式
│   ├── layout.js            # 应用布局
│   └── page.js              # 主页面组件
├── .env.local               # 环境变量
├── next.config.js           # Next.js 配置
├── package.json             # 项目依赖
├── postcss.config.js        # PostCSS 配置
└── tailwind.config.js       # Tailwind 配置
```

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量 `ANTHROPIC_API_KEY`
4. 部署完成

## 使用说明

1. **首页**: 展示产品特性和定价
2. **生成器**: 填写房产信息并选择写作风格
3. **结果页**: 查看生成的描述并一键复制

## 注意事项

- 确保 Anthropic API 密钥有效
- 生成的内容符合 Fair Housing Act 规定
- 支持离线模拟内容（API 失败时）

## 许可证

MIT License