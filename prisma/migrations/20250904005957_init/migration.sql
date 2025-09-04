-- CreateTable
CREATE TABLE "public%"."Invoice" (
    "id" SERIAL NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "customer_Name" TEXT NOT NULL,
    "mobile_Number" TEXT,
    "address" TEXT,
    "purchase_date" TIMESTAMP(3) NOT NULL,
    "total_Amount" DOUBLE PRECISION,
    "reject_Amount" DOUBLE PRECISION,
    "remaining_Amount" DOUBLE PRECISION,
    "appointment_Date" TIMESTAMP(3),
    "seller" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productDetailsId" INTEGER NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public%"."ProductDetails" (
    "id" SERIAL NOT NULL,
    "product_Type" TEXT NOT NULL,
    "product_Name" TEXT NOT NULL,
    "purity_16" DOUBLE PRECISION,
    "purity_15" DOUBLE PRECISION,
    "purity_14" DOUBLE PRECISION,
    "purity_14_2" DOUBLE PRECISION,
    "weight" JSONB NOT NULL,
    "handWidth" TEXT,
    "length" TEXT,
    "isOrder" BOOLEAN NOT NULL DEFAULT false,
    "isOrderTaken" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "public%"."Invoice"("invoiceId");

-- AddForeignKey
ALTER TABLE "public%"."Invoice" ADD CONSTRAINT "Invoice_productDetailsId_fkey" FOREIGN KEY ("productDetailsId") REFERENCES "public%"."ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
