# My SSR Blog System

本人参加字节青训营做的一个全栈 SSR 博客系统，基于 React + Express + MySQL + Redis 构建。

## ✨ 功能特性

### 📋 基础功能
- ✅ **SSR 服务端渲染** - 文章列表页和详情页支持 SSR，SEO 友好
- ✅ **文章 CRUD** - 完整的文章创建、读取、更新、删除功能
- ✅ **MySQL 数据库** - 持久化存储，支持事务和全文搜索
- ✅ **Redux 状态管理** - 前端状态统一管理
- ✅ **TypeScript** - 全栈类型安全，减少运行时错误
- ✅ **Ant Design UI** - 著名 UI 组件库
- ✅ **Styled Components** - CSS-in-JS 样式方案
- ✅ **Hash 路由** - 客户端路由系统

### 🚀 进阶功能
- ✅ **HTTP 缓存** - 强缓存 + 协商缓存双重策略
- ✅ **Redis 缓存** - 热点数据缓存，TTL 自动过期
- ✅ **服务端降级** - 数据库故障时自动降级到缓存
- ✅ **AI 写作助手** - 集成 AI 辅助内容生成
- ✅ **JWT 认证** - 安全的用户身份验证
- ✅ **权限控制** - 管理员 / 普通用户角色分离
- ✅ **接口限流** - 防止 API 被恶意刷取
- ✅ **Markdown 编辑器** - 支持实时预览
- ✅ **暗黑模式** - 深色主题切换
- ✅ **评论系统** - 支持多级嵌套回复
- ✅ **阅读量统计** - 自动记录文章浏览次数
- ✅ **标签管理** - 文章标签分类
- ✅ **标签云** - 可视化标签展示，动态字体大小
- ✅ **相关推荐** - 基于标签和热度的智能推荐算法

### ⚡ 性能优化
- ✅ **代码分割** - React.lazy + Suspense 路由懒加载
- ✅ **图片懒加载** - SSR 兼容的图片延迟加载
- ✅ **CDN 缓存** - 生产环境静态资源 1 年缓存

### 🎨 拓展功能
- ✅ **管理后台** - 用户/文章/评论集中管理
- ✅ **文章导出** - 支持导出为 PDF、Markdown、TXT
- ✅ **数据统计** - 文章数、用户数、阅读量等数据可视化

## 技术栈

**前端**
- React 18 + TypeScript
- Redux Toolkit
- React Router (Hash Router)
- Ant Design
- Styled Components
- Vite

**后端**
- Express + TypeScript
- MySQL 8.0
- Redis 7
- JWT 认证
- AI 写作助手

**工具**
- Docker & Docker Compose
- TSX (TypeScript executor)
- Vite (构建工具)

## 快速开始

### 本地开发

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
# 编辑 .env 文件，配置数据库和 Redis 连接信息
cp .env.example .env

```

3. 启动 MySQL 和 Redis（使用 Docker）
```bash
docker-compose up -d mysql redis
```

4. 初始化数据库
```bash
npm run db:init
```

5. 启动开发服务器
```bash
npm run dev
```

- 前端访问：http://localhost:3000
- 后端 API：http://localhost:4000

### 登录管理员账号

系统已预置管理员账号：

- 用户名：`admin`
- 密码：`admin123`
- 邮箱：`admin@blog.com`

登录后点击右上角头像，即可看到"管理后台"入口。

### Docker 部署

```bash
# 构建并启动所有服务
npm run docker:up

# 停止服务
npm run docker:down
```

## 项目结构

```
my-ssr-blog/
├── client/              # React 前端
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面组件
│   ├── store/           # Redux 状态管理
│   ├── styles/          # 全局样式和主题
│   ├── client.tsx       # 客户端入口（hydration）
│   └── App.tsx          # 根组件
├── server/              # Express 后端
│   ├── controllers/     # 控制器
│   ├── routes/          # 路由
│   ├── models/          # 数据库模型
│   ├── middleware/      # 中间件
│   ├── utils/           # 工具函数（Redis, AI 等）
│   ├── scripts/         # 数据库脚本
│   ├── entry-server.tsx # SSR 入口
│   └── index.ts         # 服务器入口
├── shared/              # 前后端共享代码
│   └── types/           # TypeScript 类型定义
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── docker-compose.yml   # Docker Compose 配置
└── Dockerfile           # Docker 镜像配置
```

## 核心功能说明

### SSR 实现
- 文章列表页和详情页在服务端预渲染
- 客户端 hydration 激活交互
- 支持服务端降级（数据库故障时返回骨架屏）

### 缓存策略
- **HTTP 缓存**：静态资源强缓存，动态内容协商缓存
- **Redis 缓存**：热点文章数据缓存，缓存失效策略

### AI 写作助手
- 支持标题/关键词生成文章初稿
- 生成摘要和段落建议
- 可编辑后发布

### 认证与权限
- JWT Token 认证
- 管理员/普通用户权限控制
- 接口访问限流

## API 文档

### 文章相关
- `GET /api/articles` - 获取文章列表（支持分页、排序、筛选）
- `GET /api/articles/:id` - 获取文章详情
- `POST /api/articles` - 创建文章（需认证）
- `PUT /api/articles/:id` - 更新文章（需认证）
- `DELETE /api/articles/:id` - 删除文章（需认证）

### 用户相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息（需认证）

### AI 助手
- `POST /api/ai/generate` - AI 生成文章内容（需认证）

