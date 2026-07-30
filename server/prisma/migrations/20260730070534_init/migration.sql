/*
  Warnings:

  - You are about to drop the column `is_draft` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "is_draft",
ADD COLUMN     "last_updated_date" TIMESTAMP(3);
