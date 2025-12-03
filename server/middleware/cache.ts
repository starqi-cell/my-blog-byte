import { Request, Response, NextFunction } from 'express';
import { cacheGet, cacheSet } from '../utils/redis.js';

export function cacheMiddleware(keyPrefix: string, ttl: number = 300) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = `${keyPrefix}:${req.originalUrl}`;
      const cachedData = await cacheGet(cacheKey);

      if (cachedData) {
        console.log(`✅ Cache hit: ${cacheKey}`);
        return res.json(cachedData);
      }

      // 保存原始 json 方法
      const originalJson = res.json.bind(res);

      // 重写 json 方法，在返回数据时缓存
      res.json = function (data: any) {
        cacheSet(cacheKey, data, ttl).catch(err => {
          console.error('缓存设置失败:', err);
        });
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('缓存中间件错误:', error);
      next();
    }
  };
}
