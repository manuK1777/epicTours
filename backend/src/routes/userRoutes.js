// src/routes/userRoutes.js
import { Router } from 'express';
import { getUser, uploadfile } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import upload from '../middlewares/upload.js';

const router = Router();

// User routes
router.get('/', authenticateToken(['user']), getUser);
router.post('/upload-file', authenticateToken(['user']), upload.single('file'), uploadfile);

export default router;
