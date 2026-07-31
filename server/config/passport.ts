import { Strategy as JwtStrategy, StrategyOptionsWithoutRequest } from "passport-jwt";
import { type Request, type Response, type NextFunction } from "express";
import { ExtractJwt } from "passport-jwt";
import { env } from "./env.ts";
import passport from "passport";
import { prisma } from "../lib/prisma.ts";
import { type userPayload } from "../utils/jwt-utils.ts";
import { User } from "../generated/prisma/client.ts";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecretKey
} as StrategyOptionsWithoutRequest

passport.use(new JwtStrategy(options, async (jwt_payload: userPayload, done) => {
  try {
    const userId = jwt_payload.sub;
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return done(null, false)
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}))

const optionalUserAuth = async(req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false} , (error: Error, user: User | null) => {
    if(error) return next(error);
    
    req.user = user ?? undefined;
    next();
  })(req, res, next);
}

export {
  passport,
  optionalUserAuth
}
