import { Router } from 'express';
import * as aiController from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/generate', authMiddleware, aiLimiter, aiController.generateContent);

export default router;
