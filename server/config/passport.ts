import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { env } from "./env.ts";
import passport from "passport";
import { prisma } from "../lib/prisma.ts";
import { type userPayload } from "../utils/jwt-utils.ts";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwtSecretKey
}

passport.use(new JwtStrategy(options, async (jwt_payload: userPayload, done) => {
  try {
    const userId = jwt_payload.sub;
    const user = await prisma.user.findUnique({
      where: { 
        id: userId
      }
    })
    if(!user) {
      return done(null, false)
    }

    done(null, user);
  } catch(error) {
    done(error, false);
  }
}))

export { 
  passport
}