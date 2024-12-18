import { body } from 'express-validator';

// Artist validation middleware
export const artistValidator = [
  // Validate name
  body("name")
    .exists()
    .withMessage("Artist name is required")
    .isString()
    .withMessage("Artist name should be a string")
    .isLength({ min: 2 })
    .withMessage("Artist name should be at least 2 characters"),

  // Validate email
  body("email")
    .exists()
    .withMessage("Artist email is required")
    .isEmail()
    .withMessage("Artist email must be a valid email address"),

  // Validate contact
  body("contact")
    .exists()
    .withMessage("Contact person is required")
    .isString()
    .withMessage("Contact person should be a string")
    .isLength({ min: 2 })
    .withMessage("Contact person should be at least 2 characters"),

  // Validate phone
  body("phone")
    .exists()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone should be a string")
    .matches(/^[0-9]{7,15}$/)
    .withMessage("Phone should be a valid number with 7 to 15 digits"),

  // Validate webPage (optional)
  body("webPage")
  .optional({ values: "falsy" }) // Allows undefined, null, or empty string
  .isString()
  .withMessage("Web Page must be a string")
  .matches(/^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/)
  .withMessage("Web Page must be a valid URL")
  .bail(),

  // Validate file (optional)
  body("file")
    .optional({ nullable: true })
    .isString()
    .withMessage("file must be a string"),
];
