import { type Response, type Request, type NextFunction } from "express";
import { matchedData,  } from "express-validator";
import { okRes, errorRes } from "./result-handler.ts";
import { AppError } from "../utils/errors.ts";
import { createNewUser } from "../services/auth.service.ts";
import { handleValidationErrors } from "./validator-handler.ts";


export async function handleUserRegister(req: Request, res: Response) {
  const errObj = handleValidationErrors(req);
  if(errObj) return errorRes(errObj.error, { details: errObj.details }, res);

  const { username, password, confirmPassword } = matchedData(req) as { username: string, password: string, confirmPassword: string };
  if(password !== confirmPassword) return errorRes(AppError.badRequest("Your inputs are invalid"), { details: "Your passwords do not match!"}, res);

  const user = await createNewUser(username, password);
  okRes(201, "User created.", {username: user.username, createdAt: user.created_date }, res);
}
