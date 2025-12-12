// server/middleware/rateLimit.ts
// 限流中间件


import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10000, 
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: '登录尝试次数过多，请15分钟后再试',
  skipSuccessfulRequests: true, 
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  message: '注册过于频繁，请1小时后再试',
});

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: '评论发布过于频繁，请稍后再试',
});

export const articleLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: '文章发布过于频繁，请稍后再试',
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  message: 'AI助手请求过于频繁，请稍后再试',
});
