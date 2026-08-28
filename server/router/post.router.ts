import { Router } from "express";
import * as PostController from "../controllers/post.controller.ts";
import * as CommentController from "../controllers/comment.controller.ts";
import { optionalUserAuth } from "../config/passport.ts";
import { mandatoryUserAuth } from "../config/passport.ts";
import { commentValidator } from "../middleware/validator/comment-validator.ts";
import { handleValidationErrors } from "../middleware/error-validator.ts";

const postRouter = Router();
postRouter.get('/posts', PostController.getAllPosts);
postRouter.get('/posts/:postId', optionalUserAuth, PostController.getPost);
postRouter.post('/posts', mandatoryUserAuth, PostController.handlePostCreation);

postRouter.patch('/posts/:postId', mandatoryUserAuth, PostController.handlePostUpdate);
postRouter.patch('/posts/:postId/settings', mandatoryUserAuth, PostController.handlePostSettingsUpdate);
postRouter.delete('/posts/:postId', mandatoryUserAuth, PostController.handlePostDelete);

postRouter.get('/posts/:postId/comments', optionalUserAuth, CommentController.getCommentsByPostId);
postRouter.post('/posts/:postId/comments', mandatoryUserAuth, commentValidator, handleValidationErrors, CommentController.createNewComment);
postRouter.post('/posts/:postId/comments/:commentId', mandatoryUserAuth, commentValidator, handleValidationErrors, CommentController.createNewReply);

postRouter.patch('/comments/:commentId', mandatoryUserAuth, commentValidator, handleValidationErrors, CommentController.modifyComment);
postRouter.delete('/comments/:commentId', mandatoryUserAuth, CommentController.deleteComemnt);
postRouter.post('/comments/:commentId/like', mandatoryUserAuth, CommentController.likeCommentAction);

postRouter.get('/profile/:userId/posts', optionalUserAuth, PostController.getPostsByUser);


export { postRouter }
