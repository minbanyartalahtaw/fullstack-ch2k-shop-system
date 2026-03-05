import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { parseDate, toUTCStartOfDay, toUTCEndOfDay } from "./utils/date";
import { OrderStatus } from "@prisma/client";

const fmt = (d: Date) => {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getUTCFullYear()}`;
};

// Single invoice by ID — compact JSON output
export const getInvoiceDetails = tool({
  description: `Fetch one invoice by ID.
Return compact JSON:
- Success: { d: { i,n,p,dt,a,s,it:{n,t,o,k} } }
- Error: { e: "not_found" | "error" }
Keys: i=invoiceId, n=name, p=phone, dt=date, a=amount, s=seller, it=item, t=type, o=isOrder, k=orderStatus.
Reply in Burmese and present as 2-column Markdown table.`,
  inputSchema: z.object({
    invoiceId: z.string().describe("Invoice ID (e.g. INV-123)"),
  }),
  execute: async ({ invoiceId }) => {
    try {
      const inv = await prisma.invoice.findUnique({
        where: { invoiceId },
        select: {
          invoiceId: true,
          customer_Name: true,
          mobile_Number: true,
          purchase_date: true,
          total_Amount: true,
          seller: true,
          isOrder: true,
          orderStatus: true,
          productDetails: {
            select: {
              productName: true,
              productType: true,
            },
          },
        },
      });
      if (!inv) return { e: "not_found" };
      const p = inv.productDetails;
      return {
        d: {
          i: inv.invoiceId,
          n: inv.customer_Name,
          p: inv.mobile_Number ?? "",
          dt: fmt(inv.purchase_date),
          a: inv.total_Amount ?? 0,
          s: inv.seller,
          it: {
            n: p.productName,
            t: p.productType,
            o: inv.isOrder,
            k: inv.orderStatus === OrderStatus.ORDER_COMPLETED,
          },
        },
      };
    } catch {
      return { e: "error" };
    }
  },
});

// Latest 10 orders — compact JSON output
export const getOrderInvoice = tool({
  description: `Fetch latest 10 order invoices (isOrder=true).
Return compact JSON:
- Success: { d: [{ i,n,p,dt,ad,a,it:{n,t,k} }] }
- Error: { e: "no_orders" | "error" }
Keys: i=invoiceId, n=name, p=phone, d=appointmentDate, a=amount, it=item, t=type, k=*Leave blank for table header,
 fill with "ပစ္စည်းပေးပြီး" if orderStatus is ORDER_COMPLETED, "ပစ္စည်းမပေးရသေးပါ" otherwise.
Reply in Burmese and present as Markdown table.`,
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const rows = await prisma.invoice.findMany({
        where: { isOrder: true },
        select: {
          invoiceId: true,
          customer_Name: true,
          mobile_Number: true,
          appointment_Date: true,
          total_Amount: true,
          orderStatus: true,
          productDetails: {
            select: {
              productName: true,
              productType: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      if (!rows.length) return { e: "no_orders" };
      return {
        d: rows.map((r) => ({
          i: r.invoiceId,
          n: r.customer_Name,
          p: r.mobile_Number ?? "",
          d: r.appointment_Date ? fmt(r.appointment_Date) : "",
          a: r.total_Amount ?? 0,
          it: {
            n: r.productDetails.productName,
            t: r.productDetails.productType,
            k: r.orderStatus === OrderStatus.ORDER_COMPLETED,
          },
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});

// Invoices by date range — compact JSON output
export const getInvoiceDetailsWithDateRange = tool({
  description: `Fetch invoices in date range.
Return compact JSON:
- Success: { d: [{ i,n,p,a,dt,s }] }
- Error: { e: "need_date" | "bad_start" | "bad_end" | "no_invoices" | "error" }
Keys: i=invoiceId, n=name, p=phone, a=amount, dt=date, s=seller.
Reply in Burmese and present as Markdown table (DD-MM-YYYY).`,
  inputSchema: z.object({
    startDate: z.string().optional().describe("DD-MM-YYYY"),
    endDate: z.string().optional().describe("DD-MM-YYYY"),
  }),
  execute: async ({ startDate, endDate }) => {
    try {
      if (!startDate && !endDate) return { e: "need_date" };
      const start = startDate ? parseDate(startDate) : undefined;
      const end = endDate ? parseDate(endDate) : undefined;
      if (startDate && !start) return { e: "bad_start" };
      if (endDate && !end) return { e: "bad_end" };
      const startUTC = start ? toUTCStartOfDay(start) : undefined;
      const endUTC = end ? toUTCEndOfDay(end) : undefined;
      const rows = await prisma.invoice.findMany({
        where: {
          purchase_date: {
            ...(startUTC && { gte: startUTC }),
            ...(endUTC && { lte: endUTC }),
          },
        },
        select: {
          invoiceId: true,
          customer_Name: true,
          mobile_Number: true,
          total_Amount: true,
          purchase_date: true,
          seller: true,
        },
        orderBy: { purchase_date: "desc" },
        take: 50,
      });
      if (!rows.length) return { e: "no_invoices" };
      return {
        d: rows.map((r) => ({
          i: r.invoiceId,
          n: r.customer_Name,
          p: r.mobile_Number ?? "",
          a: r.total_Amount ?? 0,
          dt: fmt(r.purchase_date),
          s: r.seller,
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});
