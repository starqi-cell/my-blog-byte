import { Router } from 'express';
import * as commentController from '../controllers/commentController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { commentLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.get('/article/:articleId', commentController.getComments);
router.post('/article/:articleId', authMiddleware, commentLimiter, commentController.createComment);
router.put('/:id/approve', authMiddleware, adminMiddleware, commentController.approveComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

export default router;
