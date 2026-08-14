import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma.ts";
import { genPasswordHash, validPasswordHash } from "../utils/password-utils.ts";
import { AppError } from "../utils/errors.ts";
import { User } from "../generated/prisma/client.ts";
import { UserModel } from "../models/user.ts";
import { userRoles } from "../config/permissions.ts";

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

export async function verifyAndGetUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username
    }
  })

  if (!user) throw AppError.badRequest("Incorrect username/password.");

  const match = await validPasswordHash(password, user.password);

  if (!match) throw AppError.badRequest("Incorrect username/password.");

  return (new UserModel(user)).getAllowedProperties();
}

export async function getProfile(userId: number) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }
  })

  if (!user) throw AppError.notFound("User not found")

  return (new UserModel(user)).getAllowedProperties();
}

export async function getPermissions(userId: number) {
  const userModel = await UserModel.initUser(userId);
  return userModel.getPermissions();
}

export async function setPermissions(fromUserId: number, targetUserId: number, roles: string[], password: string | null) {
  const userModel = await UserModel.initUser(fromUserId);
  if (!userModel.hasPermission("modifyRoles")) throw AppError.forbidden("You do not have permission to modify roles.");

  for (const role of roles) {
    if (!userRoles.includes(role)) throw AppError.badRequest("Invalid role given.");
  }

  if (fromUserId === targetUserId && !roles.includes("admin") && userModel.obj.roles.includes("admin")) {
    if (password === null) throw AppError.forbidden("You cannot remove your admin privileges without your password.");

    const match = await validPasswordHash(password, userModel.obj.password);
    if (!match) throw AppError.badRequest("Password for removing admin privileges is incorrect.");
  }

  const modifiedUser = await prisma.user.update({
    data: {
      roles: roles
    },
    where: {
      id: targetUserId
    }
  })

  return (new UserModel(modifiedUser)).getAllowedProperties;
}
