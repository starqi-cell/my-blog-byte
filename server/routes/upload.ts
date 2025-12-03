import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 上传图片（需要登录）
router.post('/image', authenticate, upload.single('image'), uploadImage);

// 删除图片（需要登录）
router.delete('/image/:filename', authenticate, deleteImage);

export default router;
