# My SSR Blog

一个功能完整的 SSR 博客系统已经创建完成！

## 📦 项目结构

```
my-ssr-blog/
├── client/                 # React 前端
│   ├── components/         # 可复用组件
│   ├── pages/             # 页面组件
│   ├── store/             # Redux 状态管理
│   ├── styles/            # 样式和主题
│   ├── App.tsx            # 根组件
│   └── client.tsx         # 客户端入口
├── server/                # Express 后端
│   ├── controllers/       # 控制器
│   ├── routes/           # 路由
│   ├── models/           # 数据库模型
│   ├── middleware/       # 中间件
│   ├── utils/            # 工具函数
│   ├── scripts/          # 数据库脚本
│   ├── entry-server.tsx  # SSR 入口
│   └── index.ts          # 服务器入口
├── shared/               # 共享类型定义
└── docker-compose.yml    # Docker 配置
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动数据库服务（Docker）

```bash
docker-compose up -d mysql redis
```

### 3. 初始化数据库

```bash
npm run db:init
```

### 4. 启动开发服务器

```bash
npm run dev
```

- 前端：http://localhost:3000
- 后端：http://localhost:4000

### 5. 生产环境部署

```bash
# 构建
npm run build

# 预览
npm run preview

# 或使用 Docker
npm run docker:up
```

## ✨ 功能特性

### 基础功能 ✅
- [x] SSR 服务端渲染（文章列表页和详情页）
- [x] 完整的文章 CRUD API
- [x] MySQL 数据库存储
- [x] Redux 状态管理和缓存
- [x] TypeScript 全栈类型安全
- [x] Ant Design UI 组件库
- [x] Styled Components 样式管理
- [x] 哈希路由

### 进阶功能 ✅
- [x] HTTP 缓存策略（强缓存 + 协商缓存）
- [x] Redis 缓存优化
- [x] 服务端降级方案
- [x] AI 写作助手集成
- [x] JWT 用户认证
- [x] Markdown 编辑器
- [x] 暗黑模式
- [x] 评论功能
- [x] 阅读量统计
- [x] 标签管理

## 📝 API 文档

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息（需认证）

### 文章相关
- `GET /api/articles` - 获取文章列表（支持分页、排序、筛选）
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/:id` - 更新文章（需认证）
- `DELETE /api/articles/:id` - 删除文章（需认证）
- `POST /api/articles/:id/like` - 点赞文章

### 标签相关
- `GET /api/tags` - 获取所有标签
- `POST /api/tags` - 创建标签（需管理员）
- `PUT /api/tags/:id` - 更新标签（需管理员）
- `DELETE /api/tags/:id` - 删除标签（需管理员）

### 评论相关
- `GET /api/comments/article/:articleId` - 获取文章评论
- `POST /api/comments/article/:articleId` - 发表评论（需认证）
- `PUT /api/comments/:id/approve` - 审核评论（需管理员）
- `DELETE /api/comments/:id` - 删除评论（需认证）

### AI 助手
- `POST /api/ai/generate` - AI 生成内容（需认证）
  - 参数：`{ type: 'content' | 'summary' | 'title', input: string }`

## 🎨 主题配置

蓝色极简主题已配置，支持明亮/暗黑模式切换。

主题颜色：
- 主色：#1890ff
- 成功：#52c41a
- 警告：#faad14
- 错误：#f5222d

## 🔧 环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```env
# Server
NODE_ENV=development
PORT=4000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# AI (可选)
AI_API_KEY=your_ai_api_key
AI_API_URL=https://api.openai.com/v1/chat/completions
```

## 🐳 Docker 部署

完整的 Docker 配置已准备好：

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📊 性能优化

1. **SSR 优化**
   - 服务端预渲染关键页面
   - 客户端 hydration 激活交互
   - 降级方案保证可用性

2. **缓存策略**
   - Redis 缓存热点数据（5 分钟 TTL）
   - HTTP 强缓存（静态资源 1 年）
   - 协商缓存（动态内容）

3. **代码优化**
   - 代码分割（React.lazy）
   - 按需加载（路由懒加载）
   - Tree shaking

## 🎯 下一步计划

- [ ] 图片上传功能
- [ ] 文章导出（PDF/Markdown）
- [ ] 站内搜索（Elasticsearch）
- [ ] 相关文章推荐
- [ ] RSS 订阅
- [ ] 数据统计看板

## 📄 License

MIT

---

**Enjoy coding! 🎉**
