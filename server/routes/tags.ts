import { Router } from 'express';
import * as tagController from '../controllers/tagController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheMiddleware('tags', 3600), tagController.getTags);
router.post('/', authMiddleware, adminMiddleware, tagController.createTag);
router.put('/:id', authMiddleware, adminMiddleware, tagController.updateTag);
router.delete('/:id', authMiddleware, adminMiddleware, tagController.deleteTag);

export default router;
