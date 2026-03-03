-- AlterTable
ALTER TABLE "public"."ProductDetails" ADD COLUMN     "productTypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."ProductDetails" ADD CONSTRAINT "ProductDetails_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "public"."ProductType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
