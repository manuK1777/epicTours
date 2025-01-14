// src/middlewares/authenticateToken.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = (allowedRoles) => async (req, res, next) => {
  try {
    const { cookies } = req;
    const accessToken = cookies.token;

    if (!accessToken) {
      return res.status(401).json({
        code: -50,
        message: 'No access token provided'
      });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findByPk(decodedToken.id_user);
    if (!user) {
      return res.status(401).json({
        code: -70,
        message: 'Invalid access token'
      });
    }

    const hasPermission = user.roles.some(role => allowedRoles.includes(role));
    if (!hasPermission) {
      return res.status(403).json({
        code: -10,
        message: 'You do not have the necessary permissions.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'An error occurred while authenticating the access token'
    });
  }
};