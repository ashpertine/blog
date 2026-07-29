import { type Request, type Response, type NextFunction } from "express";
import { errorRes } from "../controllers/result-handler";

export function errorFallback(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error.stack);

  return errorRes(error, null, res);
}
