import { body } from "express-validator";

export const contactValidator = [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address"),
    body("phone")
        .optional()
        .matches(/^[0-9]{7,15}$/)
        .withMessage("Phone must be a valid number with 7 to 15 digits"),
    body("website")
        .optional()
        .isURL()
        .withMessage("Website must be a valid URL"),
    body("socialMedia")
        .optional()
        .isString()
        .withMessage("Social Media must be a string"),
];
