/*
  Warnings:

  - Made the column `last_updated_date` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "last_updated_date" SET NOT NULL,
ALTER COLUMN "last_updated_date" SET DEFAULT CURRENT_TIMESTAMP;
