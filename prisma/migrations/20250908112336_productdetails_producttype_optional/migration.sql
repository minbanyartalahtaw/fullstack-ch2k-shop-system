/*
  Warnings:

  - Made the column `productType` on table `ProductDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public%"."ProductDetails" ALTER COLUMN "productType" SET NOT NULL;
