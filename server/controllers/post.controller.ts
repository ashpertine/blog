import { type Response, type Request, type NextFunction } from "express";
import { matchedData, } from "express-validator";
import { okRes, errorRes } from "./result-handler.ts";
import { AppError } from "../utils/errors.ts";
import { generateToken } from "../utils/jwt-utils.ts";
import * as PostService from "../services/post.service.ts";

export function getParamResourceId(req: Request, name: string) {
  const resourceId = req.params[name];
  if (!resourceId) throw AppError.badRequest(`${name} is not defined`);

  return Number(resourceId);
}

export async function getAllPosts(req: Request, res: Response) {
  const posts = await PostService.getAllPublicPosts(null);

  return okRes(null, "Successfully fetched posts.", { posts: posts }, res);
}

export async function getPostsByUser(req: Request, res: Response) {
  const userId = getParamResourceId(req, "userId");
  const fromUserId = req.user ? req.user.id : null;
  const onlyPublic = fromUserId !== userId;
  const posts = await PostService.getPostsByUserId(userId, onlyPublic);

  return okRes(null, "Successfully fetched posts.", { posts: posts }, res);
}

export async function getPost(req: Request, res: Response) {
  const userId = req.user ? req.user.id : null;
  const postId = getParamResourceId(req, "postId")
  const post = await PostService.getPost(userId, Number(postId));

  return okRes(null, `Successfully fetched post ${postId}.`, { post: post }, res);
}

export async function handlePostCreation(req: Request, res: Response) {
  const userId = req.user!.id;
  const { title: rawTitle, content: rawContent } = req.body as { title: string | undefined, content: string | undefined };
  const title = rawTitle ? rawTitle : null;
  const content = rawContent ? rawContent : null;
  const newPost = await PostService.createPost(userId, title, content);

  return okRes(null, `Successfully created post.`, { post: newPost }, res);
}

export async function handlePostUpdate(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = getParamResourceId(req, "postId");
  const { title, content } = req.body as { title: string | undefined, content: string | undefined };
  if (!title || !content) return errorRes(AppError.badRequest("content and/or title not defined!"), null, res);

  const modifiedPost = await PostService.modifyPost(userId, postId, title, content);

  return okRes(null, `Successfully modified post ${postId}`, { post: modifiedPost }, res);
}

export async function handlePostSettingsUpdate(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = getParamResourceId(req, "postId");
  const isPublic = req.body.is_public ? true : false;

  const modifiedPost = await PostService.modifyPostStatus(userId, postId, isPublic);
  return okRes(null, `Successfully modified post ${postId}`, { post: modifiedPost }, res);
}


export async function handlePostDelete(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = getParamResourceId(req, "postId");

  const deletedPost = await PostService.deletePost(userId, postId);
  return okRes(null, `Successfully deleted post ${postId}`, { post: deletedPost }, res);
}
