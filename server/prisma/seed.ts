import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { genPasswordHash } from "../utils/password-utils";
import { env } from "../config/env";

const connectionString = env.databaseUrl;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  if(env.initAdminPass.trim().length < 8) throw Error("Admin password length is too low. (min 8 characters)")
  const adminPassword = await genPasswordHash(env.initAdminPass);
  const adminRolesJson = ["commenter", "admin", "author"] as Prisma.JsonArray;
  const admin = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      roles: adminRolesJson
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });