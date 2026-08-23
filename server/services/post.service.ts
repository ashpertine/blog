import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma.ts";
import { AppError } from "../utils/errors.ts";
import { UserModel } from "../models/user.ts";
import { SortOrder } from "../generated/prisma/internal/prismaNamespace.ts";

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
      content: content ?? "This is the start of your blog.",
    }
  })

  return newPost;
}

export async function getPostsByUserId(userId: number, onlyPublic: boolean = true) {
  const posts = await prisma.post.findMany({
    where: {
      user_id: userId,
      ...(onlyPublic && { is_public: onlyPublic })
    },
    include: {
      post_user: {
        select: {
          username: true
        }
      }
    },
    orderBy: {
      created_date: "desc"
    }
  }
  );

  return posts;
}

export async function getAllPublicPosts(limit: number | null) {
  const options = {
    where: {
      is_public: true,
    },
    include: {
      post_user: {
        select: {
          username: true
        }
      }
    },
    orderBy: {
      last_updated_date: "desc" as SortOrder
    }
  }
  const posts = limit ? await prisma.post.findMany({ ...options, take: limit }) : await prisma.post.findMany(options)

  return posts;
}

export async function getPost(userId: number | null, postId: number) {
  const post = await prisma.post.findFirst({
    where: {
      id: postId
    },
    include: {
      post_user: {
        select: {
          username: true
        }
      }
    }
  });

  if (!post) throw AppError.notFound("Post not found!");
  if (!post.is_public && post.user_id !== userId) {
    throw AppError.notFound("Post not found!");
  }

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

  const modifiedPost = isPublic ? await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      is_public: isPublic,
      published_date: new Date(),
    }
  }) : await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      is_public: isPublic,
    }
  })

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

