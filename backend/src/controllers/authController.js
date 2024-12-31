import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import RecoveryToken from '../models/recoveryTokenModel.js';
import sendEmail from '../utils/email/sendEmail.js';
import { serialize } from 'cookie';
import { handleResponse, handleError } from '../utils/responseHelper.js';

const clientURL = process.env.CLIENT_URL;

export const register = async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return handleResponse(res, 400, 'Ya existe un usuario con el mismo correo electrónico');
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    const newUser = new User({ email, password: hashedPassword, name, surname, status: 1 });
    await newUser.save();

    // Generate JWT token
    const token = serialize('token', jwt.sign(
      { id: newUser.id_user },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    ), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    res.setHeader('Set-Cookie', token);

    handleResponse(res, 200, 'Usuario registrado correctamente', {
      user: {
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email
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
      return handleResponse(res, 401, 'Usuario no existe');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return handleResponse(res, 401, 'Credenciales incorrectas');
    }

    // Generate JWT token
    const token = serialize('token', jwt.sign(
      { id: user.id_user },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    ), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    res.setHeader('Set-Cookie', token);

    handleResponse(res, 200, 'Login OK', {
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return handleResponse(res, 404, 'Email does not exist');
    }

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT));

    await RecoveryToken.create({
      user_id: user.id_user,
      token: hash,
      status: 1
    });

    const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user.id_user}`;

    sendEmail(
      user.email,
      'Password Reset Request',
      { name: user.name, link: link },
      'email/template/requestResetPassword.handlebars'
    ).then(() => {
      handleResponse(res, 200, 'Send Email OK', {
        token: resetToken,
        link: link
      });
    }, error => {
      console.error(error);
      handleResponse(res, 500, 'Send Email KO', { error });
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Check if token exists
    const tokenRecord = await RecoveryToken.findOne({ where: { token } });
    if (!tokenRecord) {
      return handleResponse(res, 404, 'Token Incorrecto');
    }

    // Find user
    const user = await User.findOne({ where: { id_user: tokenRecord.user_id } });
    if (!user) {
      return handleResponse(res, 404, 'Usuario no encontrado');
    }

    // Update password
    user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await user.save();

    // Delete used token
    await RecoveryToken.update(
      { status: 0 },
      { where: { user_id: user.id_user } }
    );

    // Generate new JWT token
    const token_jwt = serialize('token', jwt.sign(
      { id: user.id_user },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    ), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    res.setHeader('Set-Cookie', token_jwt);

    handleResponse(res, 200, 'Password reset successful', {
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    const token = serialize('token', null, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1,
      path: '/',
    });
    res.setHeader('Set-Cookie', token);

    handleResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    handleError(res, error);
  }
};