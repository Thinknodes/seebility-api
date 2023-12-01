/*
  Warnings:

  - The values [FACEBOOK,GITHUB,TWITTER] on the enum `ModeOfSignUp` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `speeches` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModeOfSignUp_new" AS ENUM ('EMAIL', 'GOOGLE', 'APPLE');
ALTER TABLE "users" ALTER COLUMN "modeOfSignUp" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "modeOfSignUp" TYPE "ModeOfSignUp_new" USING ("modeOfSignUp"::text::"ModeOfSignUp_new");
ALTER TYPE "ModeOfSignUp" RENAME TO "ModeOfSignUp_old";
ALTER TYPE "ModeOfSignUp_new" RENAME TO "ModeOfSignUp";
DROP TYPE "ModeOfSignUp_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "speeches" DROP CONSTRAINT "speeches_userId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "modeOfSignUp" DROP DEFAULT;

-- DropTable
DROP TABLE "speeches";

-- DropEnum
DROP TYPE "LengthType";

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "image" TEXT,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wait_list" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,

    CONSTRAINT "wait_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wait_list_email_key" ON "wait_list"("email");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
