import { body } from 'express-validator';

export const eventValidator = [
  body('title')
    .exists().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
  
  body('start_time')
    .exists().withMessage('Start time is required')
    .isISO8601().withMessage('Start time must be a valid ISO 8601 date'),

  body('end_time')
    .exists().withMessage('End time is required')
    .isISO8601().withMessage('End time must be a valid ISO 8601 date'),

  body('color')
    .optional()
    .isHexColor().withMessage('Color must be a valid hex color code'),
];
