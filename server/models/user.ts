import { User } from "../generated/prisma/client";
import { prisma } from "../lib/prisma.ts";
import { AppError } from "../utils/errors.ts";
import { userPermissions } from "../config/permissions";

export class UserModel {
  obj: User;
  permissions: string[];
  constructor(user: User) {
    this.obj = user;
    this.permissions = this.#getPermissions();
  }

  static async initUser(userId: number) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId
      }
    });

    if(!user) throw AppError.notFound("User not found!");
    return new UserModel(user);
  }

  hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }

  #getPermissions() {
    const roles = [ this.obj.is_admin ? "admin" : null, this.obj.is_author ? "author" : null].filter(role => role !== null);
    let permissions: string[] = [];
    Object.keys(userPermissions).forEach(permission => {
      for(const role of roles) {
        if(userPermissions[permission]!.includes(role))  {
          permissions.push(permission); 
          break;
        }
      }
    })

    return permissions;
  }
}