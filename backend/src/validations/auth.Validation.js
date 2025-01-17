import { check } from 'express-validator';

export const registerValidator = [
    check('username')
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be between 3 and 100 characters'),
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .isLength({ max: 100 })
        .withMessage('Email must not exceed 100 characters'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Password must be between 5 and 100 characters')
        .custom(value => {
            if (value === '123456') {
                throw new Error('This password is too basic');
            }
            return true;
        })
];

export const loginValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
];

export const forgotPasswordValidator = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
];

export const changePasswordValidator = [
    check('token')
        .notEmpty()
        .withMessage('Token is required'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5, max: 100 })
        .withMessage('Password must be between 5 and 100 characters')
];
