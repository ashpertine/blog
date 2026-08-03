/*
  Warnings:

  - You are about to drop the column `is_admin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_author` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_commenter` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_admin",
DROP COLUMN "is_author",
DROP COLUMN "is_commenter",
ADD COLUMN     "roles" JSONB NOT NULL DEFAULT '["commenter"]';
