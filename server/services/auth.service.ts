import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma.ts";
import { genPasswordHash, validPasswordHash} from "../utils/password-utils.ts";
import { AppError } from "../utils/errors.ts";

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
  } catch(error) {
    if(error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      throw AppError.conflict("There is already an existing user with this username!")
    }

    throw AppError.internalError((error as Error).message);
  }
}

export async function compareUserCredentials(user_id: number, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id
      }
    })

    if(!user) return false;
    const match = await validPasswordHash(password, user.password);

    if(!match) return false
    
    return true;
  } catch(error) {
    throw AppError.internalError((error as Error).message);
  }
}