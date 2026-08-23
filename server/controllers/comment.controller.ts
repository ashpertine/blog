import { type Response, type Request, type NextFunction } from "express";
import { matchedData, } from "express-validator";
import { okRes, errorRes } from "./result-handler.ts";
import { AppError } from "../utils/errors.ts";
import * as CommentService from "../services/comment.service.ts";
import { getParamResourceId } from "./post.controller.ts";

export async function getCommentsByPostId(req: Request, res: Response) {
  const postId = getParamResourceId(req, "postId");
  const userId = req.user ? req.user.id : null;
  const comments = await CommentService.getCommentsByPost(userId, postId);

  return okRes(null, "Successfully received comments.", { comments: comments }, res);
}

export async function createNewComment(req: Request, res: Response) {
  const postId = getParamResourceId(req, "postId");
  const userId = req.user!.id;
  const { content } = matchedData(req) as { content: string };
  const comment = await CommentService.createComment(userId, postId, null, content);

  return okRes(201, "Successfully created comment.", { comment: comment }, res);
}

export async function createNewReply(req: Request, res: Response) {
  const postId = getParamResourceId(req, "postId");
  const userId = req.user!.id;
  const commentId = getParamResourceId(req, "commentId");

  const { content } = matchedData(req) as { content: string };
  const comment = await CommentService.createComment(userId, postId, commentId, content);

  return okRes(201, "Successfully created comment.", { comment: comment }, res);
}

export async function modifyComment(req: Request, res: Response) {
  const userId = req.user!.id;
  const commentId = getParamResourceId(req, "commentId");

  const { content } = matchedData(req) as { content: string };
  const comment = await CommentService.modifyComment(userId, commentId, content);

  return okRes(null, "Successfully modified comment.", { comment: comment }, res);
}

export async function deleteComemnt(req: Request, res: Response) {
  const userId = req.user!.id;
  const commentId = getParamResourceId(req, "commentId");

  const comment = await CommentService.deleteComment(userId, commentId);
  return okRes(null, "Successfully deleted comment.", { comment: comment }, res);
}

async function likeCommentCommon(req: Request, res: Response, unlike: boolean) {
  const userId = req.user!.id;
  const commentId = getParamResourceId(req, "commentId");

  const comment = await CommentService.likeActionComment(unlike, userId, commentId);
  return okRes(null, "Successfully deleted comment.", { comment: comment }, res);
}

export async function likeComment(req: Request, res: Response) {
  await likeCommentCommon(req, res, false);
}

export async function unlikeComment(req: Request, res: Response) {
  await likeCommentCommon(req, res, true);
}


