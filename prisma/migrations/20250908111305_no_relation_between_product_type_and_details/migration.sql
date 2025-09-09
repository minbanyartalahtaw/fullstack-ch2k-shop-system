/*
  Warnings:

  - Made the column `productTypeId` on table `ProductDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public%"."ProductDetails" DROP CONSTRAINT "ProductDetails_productTypeId_fkey";

-- AlterTable
ALTER TABLE "public%"."ProductDetails" ALTER COLUMN "productTypeId" SET NOT NULL,
ALTER COLUMN "productTypeId" DROP DEFAULT,
ALTER COLUMN "productTypeId" SET DATA TYPE TEXT;
