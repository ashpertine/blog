import { validationResult, ValidationError, Result } from "express-validator";
import { type Request } from "express";
import { AppError } from "../utils/errors";
export function validationErrToStringArr(result: Result<ValidationError>): string[] {
  const errorMap = result.mapped();
  const errorMsgArray: string[] = Object.keys(errorMap).map(field => {
    if (errorMap[field]) return errorMap[field]!.msg;
  })

  return errorMsgArray
}

export function handleValidationErrors(req: Request) {
  const result = validationResult(req);
  if(!result.isEmpty()) {
    const details = validationErrToStringArr(result);
    return { error: AppError.badRequest("Your inputs are invalid"), details }
  }

  return null
}