import { Router } from 'express';
import * as articleController from '../controllers/articleController.js';
import { authMiddleware } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { articleLimiter } from '../middleware/rateLimit.js';

const router = Router();

// 公开路由（带缓存）
router.get('/', cacheMiddleware('articles', 300), articleController.getArticles);
router.get('/:id', cacheMiddleware('article', 300), articleController.getArticleById);

// 需要认证的路由
router.post('/', authMiddleware, articleLimiter, articleController.createArticle);
router.put('/:id', authMiddleware, articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);
router.post('/:id/like', articleController.likeArticle);

export default router;
