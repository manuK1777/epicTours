import { body } from 'express-validator';

// Crew validation middleware
export const crewValidator = [
  // Validate name
  body("name")
    .exists()
    .withMessage("Crew member name is required")
    .isString()
    .withMessage("Crew member name should be a string")
    .isLength({ min: 2 })
    .withMessage("Crew member name should be at least 2 characters"),

  // Validate email
  body("email")
    .exists()
    .withMessage("Crew member email is required")
    .isEmail()
    .withMessage("Crew member email must be a valid email address"),

  // Validate phone
  body("phone")
    .exists()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone should be a string")
    .matches(/^[0-9]{7,15}$/)
    .withMessage("Phone should be a valid number with 7 to 15 digits"),

  // Validate file (optional)
  body("file")
    .optional({ nullable: true })
    .isString()
    .withMessage("File must be a string")
];
