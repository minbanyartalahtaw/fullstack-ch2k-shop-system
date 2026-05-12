-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "sellerId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
