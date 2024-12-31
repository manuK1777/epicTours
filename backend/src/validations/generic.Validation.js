import { check, body } from 'express-validator';

export const idValidator = (paramName = 'id') => [
    check(paramName).isInt().withMessage(`Invalid ${paramName}`)
];

export const nameValidator = [
    body('name').isString().withMessage('Invalid Name file')
];
