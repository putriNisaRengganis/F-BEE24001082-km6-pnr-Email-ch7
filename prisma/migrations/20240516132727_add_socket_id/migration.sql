/*
  Warnings:

  - Added the required column `socketId` to the `ActiveSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiveSession" ADD COLUMN     "socketId" TEXT NOT NULL;
