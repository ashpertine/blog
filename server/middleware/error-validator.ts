import { type Request, type Response, type NextFunction } from "express";
import { errorRes } from "../controllers/result-handler.ts"
import { validationResult, ValidationError, Result } from "express-validator";
import { AppError } from "../utils/errors";

function validationErrToStringArr(result: Result<ValidationError>): string[] {
  const errorMap = result.mapped();
  const errorMsgArray: string[] = Object.keys(errorMap).map(field => {
    if (errorMap[field]) return errorMap[field]!.msg;
  })

  return errorMsgArray
}

function getValidationErrors(req: Request) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = validationErrToStringArr(result);
    return { error: AppError.badRequest("Your inputs are invalid"), details }
  }

  return null
}

export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errObj = getValidationErrors(req);
  if (errObj) return errorRes(errObj.error, { details: errObj.details }, res);

  return next();
}
