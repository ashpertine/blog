import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma.ts";
import { AppError } from "../utils/errors.ts";
import { UserModel } from "../models/user.ts";

async function checkAndGetUserPost(userId: number, postId: number) {
  const userModel = await UserModel.initUser(userId);
  if (!userModel.hasPermission("modifyOwnPost")) throw AppError.forbidden("You do not have permission to modify this post");
  const post = await prisma.post.findFirst({
    where: {
      id: postId
    }
  })

  if (!post) throw AppError.notFound("This post is not found");

  if (!(post.user_id !== userId)) {
    if (!userModel.hasPermission("modifyOtherPost")) throw AppError.forbidden("You do not have permission to modify this post");
  }

  return { userModel, post };
}


export async function createPost(userId: number, title: string | null, content: string | null) {
  const userModel = await UserModel.initUser(userId);
  if (!userModel.hasPermission("createPost")) throw AppError.forbidden("You do not have permission to create a new post");

  const newPost = await prisma.post.create({
    data: {
      user_id: userModel.obj.id,
      title: title ?? "Untitled Blog",
      content: content ?? "This is the start of your blog."
    }
  })

  return newPost;
}

export async function getAllPublicPosts(limit: number | null) {
  const posts = limit ? await prisma.post.findMany({
    where: {
      is_public: true
    },
    take: limit
  }) : await prisma.post.findMany({
    where: {
      is_public: true,
    }
  })

  return posts;
}

export async function getPost(postId: number) {
  const post = await prisma.post.findFirst({
    where: {
      id: postId
    }
  })

  if (!post || !post.is_public) throw AppError.notFound("Post not found!");

  return post;
}

export async function modifyPost(userId: number, postId: number, title: string, content: string) {
  await checkAndGetUserPost(userId, postId);

  const modifiedPost = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      title: title,
      content: content,
      last_updated_date: new Date()
    }
  })

  return modifiedPost
}

export async function modifyPostStatus(userId: number, postId: number, isPublic: boolean) {
  await checkAndGetUserPost(userId, postId);

  const modifiedPost = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      is_public: isPublic
    }
  });

  return modifiedPost;
}

export async function deletePost(userId: number, postId: number) {
  await checkAndGetUserPost(userId, postId);

  const deletedPost = await prisma.post.delete({
    where: {
      id: postId
    }
  });

  return deletedPost;
}

