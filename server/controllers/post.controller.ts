import { type Response, type Request, type NextFunction } from "express";
import { matchedData, } from "express-validator";
import { okRes, errorRes } from "./result-handler.ts";
import { AppError } from "../utils/errors.ts";
import { generateToken } from "../utils/jwt-utils.ts";