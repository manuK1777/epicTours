// src/routes/userRoutes.js
import { Router } from 'express';
import { getUser, uploadfile } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

// User routes
router.get('/', authenticateToken(['user']), getUser);
router.post('/upload-file', authenticateToken(['user']), uploadFileMiddleware, uploadfile);

export default router;
