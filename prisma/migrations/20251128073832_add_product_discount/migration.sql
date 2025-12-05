-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountEnd" TIMESTAMP(3),
ADD COLUMN     "discountPercent" INTEGER,
ADD COLUMN     "discountStart" TIMESTAMP(3),
ALTER COLUMN "description" DROP NOT NULL;
