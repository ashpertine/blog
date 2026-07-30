import express from "express";
import { passport } from "./config/passport.ts";
import { authRouter } from "./router/auth.router";
import { postRouter } from "./router/post.router.ts";
import { AppError } from "./utils/errors";
import { errorFallback } from "./middleware/error-fallback.ts";

const app = express();

// Defaults
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1);

// Passport Auth
app.use(passport.initialize());

app.use('/api', authRouter);
app.use('/api', postRouter);
app.use('/{*splat}', (req, res, next) => {
  next(AppError.notFound("No resource on this route."));
})

// Error fallback (always last)
app.use(errorFallback);
export { app }
