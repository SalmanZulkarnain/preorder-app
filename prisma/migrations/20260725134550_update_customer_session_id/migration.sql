/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_sessionId_key" ON "Customer"("sessionId");
