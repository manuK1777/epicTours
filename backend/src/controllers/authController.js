import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { serialize } from 'cookie';
import { handleResponse, handleError } from '../utils/responseHelper.js';
import { Op } from 'sequelize';
import crypto from 'crypto';

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return handleResponse(res, 400, 'Email already exists');
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    const newUser = await User.create({ 
      username,
      email, 
      password: hashedPassword,
      role: 'user'  // default role
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Set cookies
    const tokenCookie = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    res.setHeader('Set-Cookie', [tokenCookie, refreshTokenCookie]);

    handleResponse(res, 200, 'User registered successfully', {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return handleResponse(res, 401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleResponse(res, 401, 'Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set cookies
    const tokenCookie = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    res.setHeader('Set-Cookie', [tokenCookie, refreshTokenCookie]);
    // Also send the access token in the Authorization header
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    handleResponse(res, 200, 'Login successful', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: accessToken
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return handleResponse(res, 401, 'Refresh token not found');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return handleResponse(res, 401, 'User not found');
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Set new cookies
    const tokenCookie = serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    const refreshTokenCookie = serialize('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    res.setHeader('Set-Cookie', [tokenCookie, refreshTokenCookie]);
    // Also send the access token in the Authorization header
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    handleResponse(res, 200, 'Tokens refreshed successfully', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: accessToken
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return handleResponse(res, 401, 'Invalid refresh token');
    }
    handleError(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('refreshToken');
    return handleResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return handleResponse(res, 404, 'User not found');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    
    // Save reset token and expiry
    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await user.save();

    // In a real application, you would send this token via email
    // For development, we'll return it in the response
    return handleResponse(res, 200, 'Password reset token generated', { resetToken });
  } catch (error) {
    return handleError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetToken: { [Op.ne]: null },
        resetTokenExpiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return handleResponse(res, 400, 'Invalid or expired reset token');
    }

    // Verify token
    const isValidToken = await bcrypt.compare(token, user.resetToken);
    if (!isValidToken) {
      return handleResponse(res, 400, 'Invalid reset token');
    }

    // Update password and clear reset token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return handleResponse(res, 200, 'Password reset successful');
  } catch (error) {
    return handleError(res, error);
  }
};