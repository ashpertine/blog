import { type Response, type Request, type NextFunction } from "express";
import { matchedData, } from "express-validator";
import { okRes, errorRes } from "./result-handler.ts";
import { AppError } from "../utils/errors.ts";
import { createNewUser, verifyAndGetUser, getProfile, getPermissions } from "../services/auth.service.ts";
import { generateToken } from "../utils/jwt-utils.ts";


export async function handleUserRegister(req: Request, res: Response) {
  const { username, password, confirmPassword } = matchedData(req) as { username: string, password: string, confirmPassword: string };

  if (password !== confirmPassword) return errorRes(AppError.badRequest("Your inputs are invalid"), { details: "Your passwords do not match!" }, res);

  const user = await createNewUser(username, password);
  return okRes(201, "User created.", { username: user.username, createdAt: user.created_date }, res);
}

export async function handleUserLogin(req: Request, res: Response) {
  const { username, password } = matchedData(req) as { username: string, password: string };

  const user = await verifyAndGetUser(username, password);
  const jwtToken = generateToken({
    sub: user.id
  })

  return okRes(null, "Successfully logged in.", { token: jwtToken }, res);
}

export async function getUserProfile(req: Request, res: Response) {
  const userId = req.user!.id;
  const user = await getProfile(userId);


  return okRes(null, null, { user: user }, res);
}

export async function getUserPermissions(req: Request, res: Response) {
  const userId = req.user!.id;
  const perms = await getPermissions(userId);

  return okRes(null, null, {permissions: perms }, res);
}
