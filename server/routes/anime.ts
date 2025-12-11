import express from 'express';
import {
  crawlFromBangumi,
  createAnime,
  getAnimeList,
  getAnimeById,
  updateAnime,
  deleteAnime,
  getAnimeStats,
} from '../controllers/animeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 公开路由
router.get('/list', getAnimeList);
router.get('/stats', getAnimeStats);
router.get('/:id', getAnimeById);

// 需要认证的路由
router.post('/crawl', authenticateToken, crawlFromBangumi);
router.post('/', authenticateToken, createAnime);
router.put('/:id', authenticateToken, updateAnime);
router.delete('/:id', authenticateToken, deleteAnime);

export default router;
