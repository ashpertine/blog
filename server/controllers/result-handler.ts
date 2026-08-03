import { type Response } from "express";
import { AppError } from "../utils/errors";

type responseData = {
  success: boolean,
  message: string | string[],
  [additionalData: string]: unknown
}

function buildResponseData(success: boolean, message: string | string[] | null, additionalData: Record<string, unknown> | null): responseData {
  if (!additionalData) {
    return {
      success,
      message: message === null ? '' : message
    }
  }

  return {
    success,
    message: message === null ? '' : message,
    ...additionalData
  }
}

export function errorRes(error: Error, additionalData: Record<string, unknown> | null, res: Response) {
  if (error instanceof AppError) {
    console.log(error);
    return res.status(error.statusCode).json(buildResponseData(false, error.message, additionalData))
  }
  if(error instanceof SyntaxError) {
    return res.status(400).json(buildResponseData(false, error.message, additionalData))
  }
  return res.status(500).json(buildResponseData(false, error.message, additionalData))
}

export function okRes(customCode: number | null, message: string | string[] | null, additionalData: Record<string, unknown>, res: Response) {
  const statusCode = customCode ?? 200;
  return res.status(statusCode).json(buildResponseData(true, message, additionalData));
}
