import { body, ValidationChain } from "express-validator";

export const registerValidator: ValidationChain[] = [
  body("username").notEmpty().withMessage("Username cannot be empty!")
    .trim()
    .isAlphanumeric('en-US', { ignore: "_" }).withMessage("Username cannot contain special characters.")
    .isLength({ min: 4, max: 20 }).withMessage("Username must be between 4 and 20 characters."),

  body("password").notEmpty().withMessage("Password cannot be empty!")
    .trim()
    .isLength({ min: 8 }).withMessage("Password must be more than 8 characters."),

  body("confirmPassword").notEmpty().withMessage("Confirm Password cannot be empty!")
    .trim()
    .isLength({ min: 8 }).withMessage("Confirm Password must be more than 8 characters."),
]

export const loginValidator: ValidationChain[] = registerValidator.slice(0, 2);
