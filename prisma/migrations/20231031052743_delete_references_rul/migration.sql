-- DropForeignKey
ALTER TABLE "speeches" DROP CONSTRAINT "speeches_userId_fkey";

-- AddForeignKey
ALTER TABLE "speeches" ADD CONSTRAINT "speeches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
