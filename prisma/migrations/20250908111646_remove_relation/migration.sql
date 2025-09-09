/*
  Warnings:

  - You are about to drop the column `productTypeId` on the `ProductDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public%"."ProductDetails" DROP COLUMN "productTypeId",
ADD COLUMN     "productType" TEXT;
