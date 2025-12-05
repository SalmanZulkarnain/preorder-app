-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "discountApplied" INTEGER,
ADD COLUMN     "originalPrice" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPrice" INTEGER,
ADD COLUMN     "isDiscountActive" BOOLEAN NOT NULL DEFAULT false;
