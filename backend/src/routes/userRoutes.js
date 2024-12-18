// src/routes/userRoutes.js
import { Router } from 'express';
import { getUser, uploadfile } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';


const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken(['user']), getUser);
// router.post("/upload-file", authenticateToken(['user']), uploadFileMiddleware, uploadfile);

export default router;
