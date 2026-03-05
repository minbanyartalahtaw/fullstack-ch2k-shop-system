"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

/** Matches columns in invoice-history-table: invoiceId, customerName, mobile, purchaseDate, productType, totalAmount, orderType, actions */
export type InvoiceWithDetails = {
  id: number;
  invoiceId: string;
  customer_Name: string;
  mobile_Number: string | null;
  purchase_date: Date;
  total_Amount: number | null;
  isOrder: boolean;
  orderStatus: OrderStatus;
  productDetails: {
    productType: string;
  };
};

type GetInvoicesParams = {
  page?: number;
  limit?: number;
  search?: string;

  startDate?: Date;
  endDate?: Date;
  isOrder?: boolean;
};

export async function getInvoices(params: GetInvoicesParams = {}) {
  const { page = 1, limit = 10, search = "", startDate, endDate } = params;

  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { invoiceId: { contains: search, mode: "insensitive" } },
      { customer_Name: { contains: search, mode: "insensitive" } },
      { mobile_Number: { contains: search, mode: "insensitive" } },
    ];
  }

  if (startDate && endDate) {
    where.purchase_date = {
      gte: startDate,
      lte: endDate,
    };
  } else if (startDate) {
    where.purchase_date = {
      gte: startDate,
    };
  } else if (endDate) {
    where.purchase_date = {
      lte: endDate,
    };
  }

  try {
    const total = await prisma.invoice.count({ where });

    const invoices = (await prisma.invoice.findMany({
      where,
      select: {
        id: true,
        invoiceId: true,
        customer_Name: true,
        mobile_Number: true,
        purchase_date: true,
        total_Amount: true,
        isOrder: true,
        orderStatus: true,
        productDetails: {
          select: { productType: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    })) as InvoiceWithDetails[];

    return {
      invoices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
}
