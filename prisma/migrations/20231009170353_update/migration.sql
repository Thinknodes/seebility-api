/*
  Warnings:

  - Added the required column `title` to the `speeches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `speeches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModeOfSignUp" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK', 'GITHUB', 'TWITTER');

-- AlterTable
ALTER TABLE "speeches" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modeOfSignUp" "ModeOfSignUp" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "speeches" ADD CONSTRAINT "speeches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
