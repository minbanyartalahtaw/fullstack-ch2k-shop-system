-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STAFF', 'MANAGER');

-- CreateTable
CREATE TABLE "public"."Staff" (
    "id" SERIAL NOT NULL,
    "staffId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isFire" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductDetails" (
    "id" SERIAL NOT NULL,
    "productType" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "public"."Invoice" (
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

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staffId_key" ON "public"."Staff"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "public"."Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_phone_key" ON "public"."Staff"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "public"."Invoice"("invoiceId");

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_productDetailsId_fkey" FOREIGN KEY ("productDetailsId") REFERENCES "public"."ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
