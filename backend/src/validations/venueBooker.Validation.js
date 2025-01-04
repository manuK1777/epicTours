import { body } from "express-validator";

export const venueBookerValidator = [
  body("name")
    .exists()
    .withMessage("VenueBooker name is required")
    .isString()
    .withMessage("VenueBooker name should be a string")
    .isLength({ min: 2 })
    .withMessage("VenueBooker name should be at least 2 characters"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),

  body("phone")
    .optional()
    .isString()
    .withMessage("Phone should be a string")
    .matches(/^[0-9+\-\s()]*$/)
    .withMessage("Invalid phone number format"),
];
