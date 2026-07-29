import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.ts";

export type userPayload = {
  sub: number,
}

export function generateToken(payload: userPayload) {
  const secretKey: string = env.jwtSecretKey;
  const options = {
    expiresIn: '3d'
  }

  const token = jwt.sign(payload, secretKey, options as SignOptions);
  return token;
}
