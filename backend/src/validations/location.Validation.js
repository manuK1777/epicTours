import { body } from 'express-validator';

export const locationValidator = [
  // Validate name
  body("name")
    .exists()
    .withMessage("Location name is required")
    .isString()
    .withMessage("Location name should be a string")
    .isLength({ min: 2 })
    .withMessage("Location name should be at least 2 characters"),

  // Validate category (optional)
  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),

  // Validate latitude
  body("latitude")
    .exists()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid number between -90 and 90"),

  // Validate longitude
  body("longitude")
    .exists()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid number between -180 and 180"),

  // Validate category (optional)
  body("category")
    .optional()
    .isString()
    .withMessage("category must be a string"),
];
