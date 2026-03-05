/*
  Warnings:

  - You are about to drop the column `isOrder` on the `ProductDetails` table. All the data in the column will be lost.
  - You are about to drop the column `isOrderTaken` on the `ProductDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('NOT_ORDER', 'ORDER_PENDING', 'ORDER_COMPLETED');

-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "isOrder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "orderStatus" "public"."OrderStatus" NOT NULL DEFAULT 'NOT_ORDER';

-- AlterTable
ALTER TABLE "public"."ProductDetails" DROP COLUMN "isOrder",
DROP COLUMN "isOrderTaken";
