import { body, ValidationChain } from "express-validator";

export const commentValidator = body("content")
  .notEmpty().withMessage("Comment cannot be empty!")
  .trim()
