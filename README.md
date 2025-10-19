# ListingWriterAI

一个基于 AI 的房产描述生成器，专为房地产经纪人设计。使用 Next.js 14 和 Tailwind CSS 构建，集成 Anthropic Claude API。

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
- **AI**: Anthropic Claude API
- **部署**: Vercel

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local` 文件并添加您的 Anthropic API 密钥：

```bash
ANTHROPIC_API_KEY=your_actual_api_key_here
```

获取 API 密钥：
1. 访问 [Anthropic Console](https://console.anthropic.com/)
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