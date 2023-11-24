/*
  Warnings:

  - Added the required column `tokens` to the `speeches` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LengthType" AS ENUM ('TIME', 'WORD');

-- AlterTable
ALTER TABLE "speeches" ADD COLUMN     "lengthType" "LengthType" NOT NULL DEFAULT 'TIME',
ADD COLUMN     "tokens" INTEGER NOT NULL;
