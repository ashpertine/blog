import { type Response, type Request, type NextFunction } from "express";
import { matchedData, } from "express-validator";
import { okRes, errorRes } from "./result-handler.ts";
import { AppError } from "../utils/errors.ts";
import { createNewUser, verifyAndGetUser, getProfile, getPermissions, setPermissions } from "../services/auth.service.ts";
import { generateToken } from "../utils/jwt-utils.ts";
import { getParamResourceId } from "./post.controller.ts";


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

export async function setUserPermissions(req: Request, res: Response) {
  const fromUserId = req.user!.id;
  const targetUserId = getParamResourceId(req, "userId");
  const roles = req.body.roles as string[] | undefined;

  if (!Array.isArray(roles) || roles.length === 0 || !roles.every((r) => typeof r === "string")) {
    throw AppError.badRequest("Roles (roles) must be a non-empty array of strings.");
  }
  
  const password = req.body.password ? String(req.body.password) : null;
  if(!roles) throw AppError.badRequest("Roles (roles) array needs to be defined.");

  const modifiedUser = await setPermissions(fromUserId, targetUserId, roles, password);
  return okRes(null, null, {user: modifiedUser}, res);
}