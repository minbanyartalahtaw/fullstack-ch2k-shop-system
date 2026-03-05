"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

// --- Types (aligned with schema) ---

interface ProductType {
  id: number;
  name: string;
}

/** Weight matrix for product (matches ProductDetails.weight Json) */
const WEIGHT_ROW_KEYS = [
  "row1",
  "row2",
  "row3",
  "row4",
  "row5",
  "row6",
] as const;

export type WeightRowKey = (typeof WEIGHT_ROW_KEYS)[number];

export interface ProductDetailsInput {
  productTypeId: number;
  productType: string;
  productName: string;
  purity_16?: number | null;
  purity_15?: number | null;
  purity_14?: number | null;
  purity_14_2?: number | null;
  weight: {
    row1: number[];
    row2: number[];
    row3: number[];
    row4: number[];
    row5: number[];
    row6: number[];
  };
  handWidth: string;
  length: string;
}

export interface InvoiceDataInput {
  customer_Name: string;
  mobile_Number?: string | null;
  address?: string | null;
  purchase_date: Date;
  product_Details: ProductDetailsInput;
  total_Amount: number;
  reject_Amount?: number | null;
  remaining_Amount?: number | null;
  appointment_Date?: Date | null;
  seller: string;
  isOrder: boolean;
  orderStatus: OrderStatus;
}

export async function getProductTypes() {
  try {
    const productTypes: ProductType[] = await prisma.productType.findMany({
      where: {
        isAvailable: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return { success: true, productTypes };
  } catch (error) {
    console.error("Failed to get product types:", error);
    return { success: false, error: (error as Error).message };
  }
}

function generateInvoiceId(): string {
  const ts = Date.now().toString();
  const rnd = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `INV-${ts.slice(0, 4)}-${ts.slice(4, 8)}-${ts.slice(8, 12)}-${rnd}`;
}

export async function createInvoice(formData: InvoiceDataInput) {
  try {
    if (!formData.product_Details.productType) {
      return { success: false, error: "ပစ္စည်းအမျိုးအစားရွေးရန်" };
    }
    if (
      typeof formData.total_Amount !== "number" ||
      formData.total_Amount < 0
    ) {
      return { success: false, error: "စုစုပေါင်းတန်ဖိုးထည့်ရန်" };
    }

    const productDetails = await prisma.productDetails.create({
      data: {
        productName: formData.product_Details.productName,
        productTypeId: formData.product_Details.productTypeId,
        productType: formData.product_Details.productType,
        purity_16: formData.product_Details.purity_16 ?? null,
        purity_15: formData.product_Details.purity_15 ?? null,
        purity_14: formData.product_Details.purity_14 ?? null,
        purity_14_2: formData.product_Details.purity_14_2 ?? null,
        weight: formData.product_Details.weight,
        handWidth: formData.product_Details.handWidth || null,
        length: formData.product_Details.length || null,
      },
    });

    const isOrder = formData.orderStatus !== OrderStatus.NOT_ORDER;
    const orderAmounts =
      formData.orderStatus === OrderStatus.ORDER_PENDING ||
      formData.orderStatus === OrderStatus.ORDER_COMPLETED
        ? {
            reject_Amount: formData.reject_Amount ?? null,
            remaining_Amount: formData.remaining_Amount ?? null,
          }
        : { reject_Amount: null, remaining_Amount: null };

    const invoice = await prisma.invoice.create({
      data: {
        invoiceId: generateInvoiceId(),
        customer_Name: formData.customer_Name,
        mobile_Number: formData.mobile_Number ?? null,
        address: formData.address ?? null,
        purchase_date: formData.purchase_date,
        total_Amount: formData.total_Amount,
        ...orderAmounts,
        appointment_Date: formData.appointment_Date ?? null,
        seller: formData.seller,
        isOrder,
        orderStatus: formData.orderStatus,
        productDetailsId: productDetails.id,
      },
      include: {
        productDetails: true,
      },
    });
    return { success: true, invoice };
  } catch (error) {
    console.error("Failed to create invoice:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getSellers() {
  try {
    const staff = await prisma.staff.findMany({
      select: { id: true, name: true },
    });

    return { success: true, staff };
  } catch (error) {
    console.error("Failed to get sellers:", error);
    return { success: false, error: (error as Error).message };
  }
}
