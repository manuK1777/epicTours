// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login, logout, forgotPassword, changePassword } from '../controllers/authController.js';
import { registerValidator, loginValidator, forgotPasswordValidator, changePasswordValidator } from '../validations/auth.Validation.js'
import { validate } from "../middlewares/validate.js";

const router = Router();

// Rutas para registrarse e iniciar sesión
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/change-password', changePasswordValidator, validate, changePassword);
router.get('/logout', logout);

export default router;
