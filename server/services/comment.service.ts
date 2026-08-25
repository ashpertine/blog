import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma.ts";
import { AppError } from "../utils/errors.ts";
import { UserModel } from "../models/user.ts";
import { getPost } from "./post.service.ts";

export async function getCommentsByPost(userId: number | null, postId: number) {
  const post = await getPost(userId, postId);

  const comments = await prisma.comment.findMany({
    where: {
      post_id: post.id
    }, 
    include: {
      comment_user: {
        select: {
          username: true
        }
      }
    }
  })

  return comments
}

export async function getComment(commentId: number) {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId
    },
    include: {
      comment_user: {
        select: {
          username: true
        }
      }
    }
  })

  if (!comment) throw AppError.notFound("Comment cannot be found!");

  const post = await prisma.post.findFirst({
    where: {
      id: comment.post_id
    }
  })

  if (!post || !post.is_public) throw AppError.notFound("Comment cannot be found!");
  return comment;
}

export async function createComment(userId: number, postId: number, parentCommentId: number | null, content: string) {
  const userModel = await UserModel.initUser(userId);
  if (!userModel.hasPermission("createComment")) throw AppError.forbidden("You do not have permission to create a comment.");

  await getPost(userId, postId);

  const comment = await prisma.comment.create({
    data: {
      user_id: userId,
      content: content,
      post_id: postId,
      parent_comment_id: parentCommentId,
    }
  });

  return comment;
}

export async function modifyComment(userId: number, commentId: number, content: string) {
  const userModel = await UserModel.initUser(userId);
  if (!userModel.hasPermission("createComment")) throw AppError.forbidden("You do not have permission to create a comment.");

  try {
    const modifiedComment = await prisma.comment.update({
      data: {
        content: content
      },
      where: {
        id: commentId,
        user_id: userId
      }
    })

    return modifiedComment;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code == "P2025") {
      throw AppError.notFound("You do not have permissions to modify this comment.")
    }

    throw error;
  }
}

export async function likeActionComment(unlike: boolean, userId: number, commentId: number) {
  if (!unlike) {
    await prisma.commentLikes.create({
      data: {
        user_id: userId,
        comment_id: commentId
      }
    })
  } else {
    await prisma.commentLikes.delete({
      where: {
        user_id_comment_id: {
          user_id: userId,
          comment_id: commentId
        }
      }
    });
  }

  const comment = await prisma.comment.update({
    data: {
      likes: !unlike ? { increment: 1 } : { decrement: 1 }
    },
    where: {
      id: commentId
    }
  });

  return comment;
}


export async function deleteComment(userId: number, commentId: number) {
  try {
    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
        user_id: userId
      }
    });

    return comment;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code == "P2025") {
      throw AppError.notFound("You do not have permissions to modify this comment.")
    }

    throw error;
  }
}
