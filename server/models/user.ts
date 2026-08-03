import { User } from "../generated/prisma/client";
import { prisma } from "../lib/prisma.ts";
import { AppError } from "../utils/errors.ts";
import { userPermissions } from "../config/permissions";
import { Prisma } from "../generated/prisma/client";

export class UserModel {
  obj: User;
  permissions: string[];
  roles: string[];
  constructor(user: User) {
    this.obj = user;
    this.permissions = this.getPermissions();
    this.roles = this.obj.roles as string[];
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

  getPermissions() {
    const roles = this.obj.roles as Prisma.JsonArray;

    let permissions: string[] = [];
    Object.keys(userPermissions).forEach(permission => {
      for(const role of roles) {
        const roleToString = String(role);
        if(userPermissions[permission]!.includes(roleToString))  {
          permissions.push(permission); 
          break;
        }
      }
    });

    return permissions;
  }
}