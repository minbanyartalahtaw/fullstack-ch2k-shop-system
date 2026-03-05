"use server";

import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

/** Matches columns in order invoice-history-table */
export type InvoiceWithDetails = {
  id: number;
  invoiceId: string;
  customer_Name: string;
  mobile_Number: string | null;
  purchase_date: Date;
  appointment_Date: Date | null;
  total_Amount: number | null;
  reject_Amount: number | null;
  remaining_Amount: number | null;
  orderStatus: OrderStatus;
  productDetails: {
    productType: string;
    productName: string;
    handWidth: string | null;
    length: string | null;
  };
};

type GetInvoicesParams = {
  page?: number;
  limit?: number;
  search?: string;

  startDate?: Date;
  endDate?: Date;
};

export async function getInvoices(params: GetInvoicesParams = {}) {
  const { page = 1, limit = 8, search = "", startDate, endDate } = params;

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

  where.isOrder = true;

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
        appointment_Date: true,
        total_Amount: true,
        reject_Amount: true,
        remaining_Amount: true,
        orderStatus: true,
        productDetails: {
          select: {
            productType: true,
            productName: true,
            handWidth: true,
            length: true,
          },
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

export async function updateInvoiceIsOrderTaken(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.update({
      where: { invoiceId },
      data: { orderStatus: OrderStatus.ORDER_COMPLETED },
      include: { productDetails: true },
    });
    return { success: true, invoice: invoice.invoiceId };
  } catch (error) {
    console.error("Failed to update invoice:", error);
    throw new Error("Failed to update invoice");
  }
}

export async function undoUpdateOrderTaken(invoiceId: string) {
  try {
    const invoice = await prisma.invoice.update({
      where: { invoiceId },
      data: { orderStatus: OrderStatus.ORDER_PENDING },
      include: { productDetails: true },
    });
    return { success: true, invoice: invoice.invoiceId };
  } catch (error) {
    console.error("Failed to update invoice:", error);
    throw new Error("Failed to update invoice");
  }
}
