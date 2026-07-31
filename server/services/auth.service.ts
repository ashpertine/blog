import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma.ts";
import { genPasswordHash, validPasswordHash } from "../utils/password-utils.ts";
import { AppError } from "../utils/errors.ts";
import { User } from "../generated/prisma/client.ts";

export async function createNewUser(username: string, password: string) {
  try {
    const hashedPassword = await genPasswordHash(password);
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword
      }
    })

    return newUser;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw AppError.conflict("There is already an existing user with this username!")
    }

    throw error;
  }
}

export async function verifyAndGetUser(username: string, password: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  })

  if (!user) throw AppError.badRequest("Incorrect username/password.");

  const match = await validPasswordHash(password, user.password);

  if (!match) throw AppError.badRequest("Incorrect username/password.");

  return user;
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }
  })

  if(!user) throw AppError.notFound("User not found")

  return user;
}
