import express from 'express';
import { upload } from '../middleware/upload.js';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/image', authenticate, upload.single('image'), uploadImage);

router.delete('/image/:filename', authenticate, deleteImage);

export default router;
