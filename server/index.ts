// server/index.ts
// 服务器入口文件

import express, { Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool, closePool } from './utils/database.js';
import { getRedisClient, closeRedis } from './utils/redis.js';

import authRoutes from './routes/auth.js';
import articleRoutes from './routes/articles.js';
import tagRoutes from './routes/tags.js';
import commentRoutes from './routes/comments.js';
import aiRoutes from './routes/ai.js';
import uploadRoutes from './routes/upload.js';
import animeRoutes from './routes/anime.js';

import { generalLimiter } from './middleware/rateLimit.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 中间件
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 全局限流
app.use('/api', generalLimiter);

// 提供上传文件的静态访问
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// 静态资源缓存策略
if (NODE_ENV === 'production') {
  app.use(
    '/assets',
    express.static(path.resolve(__dirname, '../dist/client/assets'), {
      maxAge: '1y',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      },
    })
  );

  app.use(
    express.static(path.resolve(__dirname, '../dist/client'), {
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
          res.setHeader('ETag', 'W/"' + Date.now() + '"');
        }
      },
    })
  );
}

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/anime', animeRoutes);

// 健康检查
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SSR 处理（生产环境）
if (NODE_ENV === 'production') {
  const { render } = await import('./entry-server.ts');

  app.get('*', async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;
      const { html, status } = await render(url);

      res.status(status).set({
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=300, must-revalidate',
        'ETag': `W/"${Date.now()}"`,
      }).send(html);
    } catch (error) {
      console.error('SSR 错误:', error);
      res.status(500).send('服务器错误');
    }
  });
}

// 初始化数据库和 Redis 连接
async function bootstrap() {
  try {
    // 连接 MySQL
    getPool();
    console.log('MySQL 已连接');

    // 连接 Redis（可选，失败不影响服务器启动）
    try {
      await getRedisClient();
      console.log('Redis 已连接');
    } catch (redisError) {
      console.warn('Redis 连接失败，缓存功能将被禁用:', redisError instanceof Error ? redisError.message : redisError);
      console.log('ℹ服务器将继续运行，但缓存功能不可用');
    }

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`
服务器已启动
环境: ${NODE_ENV}
API: http://localhost:${PORT}/api
${NODE_ENV === 'development' ? `🌐 前端: http://localhost:${process.env.CLIENT_PORT || 3000}` : ''}
      `);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('收到 SIGTERM 信号，正在关闭...');
  await closePool();
  await closeRedis();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('收到 SIGINT 信号，正在关闭...');
  await closePool();
  await closeRedis();
  process.exit(0);
});

bootstrap();
