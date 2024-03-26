/*
  Warnings:

  - You are about to drop the column `userId` on the `Favorites` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_userId_fkey";

-- AlterTable
ALTER TABLE "Favorites" DROP COLUMN "userId";
