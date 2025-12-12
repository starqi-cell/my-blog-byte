import rateLimit from 'express-rate-limit';

// 通用限流配置：每15分钟最多100个请求
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10000, // 最多100个请求
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
});

// 登录限流：每15分钟最多5次尝试
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: '登录尝试次数过多，请15分钟后再试',
  skipSuccessfulRequests: true, // 成功的请求不计入限制
});

// 注册限流：每小时最多3次注册
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  message: '注册过于频繁，请1小时后再试',
});

// 评论限流：每分钟最多3条评论
export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  message: '评论发布过于频繁，请稍后再试',
});

// 文章发布限流：每小时最多10篇文章
export const articleLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: '文章发布过于频繁，请稍后再试',
});

// AI助手限流：每分钟最多5次请求
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  message: 'AI助手请求过于频繁，请稍后再试',
});
