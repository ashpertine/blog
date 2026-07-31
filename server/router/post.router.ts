import { Router } from "express";
import * as PostController from "../controllers/post.controller.ts";
import { passport, optionalUserAuth } from "../config/passport.ts";

const postRouter = Router();
postRouter.get('/posts', PostController.getAllPosts);
postRouter.get('/posts/:postId', optionalUserAuth, PostController.getPost);
postRouter.post('/posts', passport.authenticate('jwt', { session: false }), PostController.handlePostCreation);

postRouter.patch('/posts/:postId', passport.authenticate('jwt', { session: false }), PostController.handlePostUpdate);
postRouter.patch('/posts/:postId/settings', passport.authenticate('jwt', { session: false }), PostController.handlePostSettingsUpdate);
postRouter.delete('/posts/:postId', passport.authenticate('jwt', { session: false }), PostController.handlePostDelete);


export { postRouter }
