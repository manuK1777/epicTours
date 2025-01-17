// src/routes/authRoutes.js
import { Router } from 'express';
import { 
    register, 
    login, 
    logout,
    refreshToken,
    requestPasswordReset,
    resetPassword
} from '../controllers/authController.js';
import { 
    registerValidator, 
    loginValidator, 
    forgotPasswordValidator, 
    changePasswordValidator 
} from '../validations/auth.Validation.js'
import { validate } from "../middlewares/validate.js";
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Authentication routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPasswordValidator, validate, requestPasswordReset);
router.post('/change-password', changePasswordValidator, validate, resetPassword);
router.get('/logout', logout);

// Test routes for role verification
router.get('/test-admin', authenticateToken(['admin']), (req, res) => {
    res.json({
        message: 'You have admin access',
        user: req.user
    });
});

router.get('/test-user', authenticateToken(['admin', 'user']), (req, res) => {
    res.json({
        message: 'You have user access',
        user: req.user
    });
});

export default router;
