-- DropForeignKey
ALTER TABLE "ActiveSession" DROP CONSTRAINT "ActiveSession_userId_fkey";

-- AlterTable
ALTER TABLE "ActiveSession" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
