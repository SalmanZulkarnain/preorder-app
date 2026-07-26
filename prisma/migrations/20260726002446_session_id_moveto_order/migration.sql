/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `sessionId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_sessionId_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "sessionId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sessionId" TEXT NOT NULL;
