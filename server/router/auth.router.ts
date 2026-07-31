import { Router } from "express";
import { registerValidator, loginValidator } from "../middleware/validator/auth-validator";
import * as AuthController from "../controllers/auth.controller.ts";
import { handleValidationErrors } from "../middleware/error-validator.ts";
import { passport } from "../config/passport.ts";

const authRouter = Router();
authRouter.post('/register', registerValidator, handleValidationErrors, AuthController.handleUserRegister);
authRouter.post('/login', loginValidator, handleValidationErrors, AuthController.handleUserLogin);
authRouter.get('/profile', passport.authenticate('jwt', { session: false }), AuthController.getUserProfile);

export { authRouter }
