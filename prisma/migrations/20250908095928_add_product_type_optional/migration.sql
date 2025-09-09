/*
  Warnings:

  - You are about to drop the column `product_Type` on the `ProductDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public%"."ProductDetails" DROP COLUMN "product_Type",
ADD COLUMN     "productTypeId" INTEGER;

-- CreateTable
CREATE TABLE "public%"."ProductType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public%"."ProductDetails" ADD CONSTRAINT "ProductDetails_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "public%"."ProductType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
