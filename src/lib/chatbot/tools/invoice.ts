import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { parseDate, toUTCStartOfDay, toUTCEndOfDay } from "./utils/date";
import { OrderStatus } from "@prisma/client";
import { formatDate } from "@/lib/constants/date_format";

const MAX_INVOICES = 25;

// Single invoice by ID — compact JSON output
export const getInvoiceDetails = tool({
  description: `Fetch one invoice by ID.
Return compact JSON:
- Success: { d: { i,n,p,dt,a,s,it:{n,t,o,k} } }
- Error: { e: "not_found" | "error" }
Keys: i=invoiceId, n=name, p=phone, dt=date, a=amount, s=seller, it=item, t=type, o=isOrder(ဘောက်ချာအမျိုးအစား), k=orderStatus string.
If o=true: show a clear label that this is an ORDER invoice, then show k as order status:
  "ORDER_PENDING" → "ပစ္စည်းမပေးရသေးပါ", "ORDER_COMPLETED" → "ပစ္စည်းပေးပြီး".
If o=false: show that this is a normal sale (k will be "NOT_ORDER", display as "အရောင်းဘောက်ချာ").
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
          seller: { select: { name: true } },
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
          dt: formatDate(inv.purchase_date),
          a: inv.total_Amount ?? 0,
          s: inv.seller.name,
          it: {
            n: p.productName,
            t: p.productType,
            o: inv.isOrder,
            k: inv.orderStatus,
          },
        },
      };
    } catch {
      return { e: "error" };
    }
  },
});

// Invoices by date range — compact JSON output
export const getInvoiceWithDateRange = tool({
  description: `Fetch invoices in date range max-50 invoices.
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
          seller: { select: { name: true } },
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
          dt: formatDate(r.purchase_date),
          s: r.seller.name,
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});

// Latest 10 orders — compact JSON output
export const getAllOrderInvoice = tool({
  description: `Fetch latest ${MAX_INVOICES} order invoices (isOrder=true) and orderStatus=ORDER_PENDING,ORDER_COMPLETED..
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
        take: MAX_INVOICES,
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
      });

      if (!rows.length) return { e: "no_orders" };
      return {
        d: rows.map((r) => ({
          i: r.invoiceId,
          n: r.customer_Name,
          p: r.mobile_Number ?? "",
          d: r.appointment_Date ? formatDate(r.appointment_Date) : "",
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

export const getInvoiceWithOrderPending = tool({
  description: `Fetch invoices with order pending max ${MAX_INVOICES} invoices.
  Return compact JSON:
  - Success: { d: [{ i,n,p,a,dt,ad,s,pName,pType }] }
  - Error: { e: "no_invoices" | "error" }
  Keys: i=invoiceId, n=name, p=phone, a=amount, dt=ဝယ်ရက်, ad=ရက်ချိန်း, s=seller, productName, productType.
  Reply in Burmese and present as Markdown table (DD-MM-YYYY).`,
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const rows = await prisma.invoice.findMany({
        where: { orderStatus: OrderStatus.ORDER_PENDING },
        orderBy: { createdAt: "desc" },
        take: MAX_INVOICES,
        select: {
          invoiceId: true,
          customer_Name: true,
          mobile_Number: true,
          total_Amount: true,
          purchase_date: true,
          appointment_Date: true,
          seller: { select: { name: true } },
          productDetails: {
            select: {
              productName: true,
              productType: true,
            },
          },
        },
      });

      if (!rows.length) return { e: "no_invoices" };
      return {
        d: rows.map((r) => ({
          i: r.invoiceId,
          n: r.customer_Name,
          p: r.mobile_Number ?? "",
          a: r.total_Amount ?? 0,
          dt: formatDate(r.purchase_date),
          ad: r.appointment_Date ? formatDate(r.appointment_Date) : "",
          s: r.seller.name,
          pName: r.productDetails?.productName ?? "",
          pType: r.productDetails?.productType ?? "",
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});

export const getInvoiceWithOrderCompleted = tool({
  description: `Fetch invoices with order completed max ${MAX_INVOICES} invoices.
  Return compact JSON:
  - Success: { d: [{ i,n,p,a,dt,ad,s,pName,pType }] }
  - Error: { e: "no_invoices" | "error" }
  Keys: i=invoiceId, n=name, p=phone, a=amount, dt=ဝယ်ရက်, ad=ရက်ချိန်း, s=seller, productName, productType.
  Reply in Burmese and present as Markdown table (DD-MM-YYYY).`,
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const rows = await prisma.invoice.findMany({
        where: { orderStatus: OrderStatus.ORDER_COMPLETED },
        orderBy: { createdAt: "desc" },
        take: MAX_INVOICES,
        select: {
          invoiceId: true,
          customer_Name: true,
          mobile_Number: true,
          total_Amount: true,
          purchase_date: true,
          appointment_Date: true,
          seller: { select: { name: true } },
          productDetails: {
            select: {
              productName: true,
              productType: true,
            },
          },
        },
      });

      if (!rows.length) return { e: "no_invoices" };
      return {
        d: rows.map((r) => ({
          i: r.invoiceId,
          n: r.customer_Name,
          p: r.mobile_Number ?? "",
          a: r.total_Amount ?? 0,
          dt: formatDate(r.purchase_date),
          ad: r.appointment_Date ? formatDate(r.appointment_Date) : "",
          s: r.seller.name,
          pName: r.productDetails?.productName ?? "",
          pType: r.productDetails?.productType ?? "",
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});

// Rank staff by performance — single-call aggregation, no per-staff loop needed.
export const getStaffSalesRanking = tool({
  description: `Rank staff (sellers) by sales performance. Returns top staff ordered by invoice count or total revenue, optionally within a date range.
Use for questions like "who is the best seller", "which staff sold the most", "top staff by revenue this month".
Return compact JSON:
- Success: { d: [{ r,s,c,a }] }
- Error: { e: "bad_start" | "bad_end" | "no_data" | "error" }
Keys: r=rank (1-based), s=staff name, c=invoice count, a=total revenue (sum of total_Amount, ကျပ်).
Reply in Burmese as a ranked Markdown table with columns: အဆင့်, ဝန်ထမ်း, ဘောက်ချာ, စုစုပေါင်းရငွေ.`,
  inputSchema: z.object({
    startDate: z.string().optional().describe("DD-MM-YYYY (optional)"),
    endDate: z.string().optional().describe("DD-MM-YYYY (optional)"),
    onlySales: z
      .boolean()
      .optional()
      .default(false)
      .describe(
        "If true, exclude order invoices (isOrder=true). Default false = include all invoices.",
      ),
    sortBy: z
      .enum(["count", "revenue"])
      .optional()
      .default("count")
      .describe(
        "count = rank by invoice count desc; revenue = rank by total revenue desc",
      ),
    limit: z.number().int().min(1).max(20).optional().default(10),
  }),
  execute: async ({ startDate, endDate, onlySales, sortBy, limit }) => {
    try {
      const start = startDate ? parseDate(startDate) : undefined;
      const end = endDate ? parseDate(endDate) : undefined;
      if (startDate && !start) return { e: "bad_start" };
      if (endDate && !end) return { e: "bad_end" };
      const startUTC = start ? toUTCStartOfDay(start) : undefined;
      const endUTC = end ? toUTCEndOfDay(end) : undefined;

      const grouped = await prisma.invoice.groupBy({
        by: ["sellerId"],
        where: {
          ...((startUTC || endUTC) && {
            purchase_date: {
              ...(startUTC && { gte: startUTC }),
              ...(endUTC && { lte: endUTC }),
            },
          }),
          ...(onlySales && { isOrder: false }),
        },
        _count: { id: true },
        _sum: { total_Amount: true },
        orderBy:
          sortBy === "revenue"
            ? { _sum: { total_Amount: "desc" } }
            : { _count: { id: "desc" } },
        take: limit,
      });

      if (!grouped.length) return { e: "no_data" };

      const staff = await prisma.staff.findMany({
        where: { id: { in: grouped.map((g) => g.sellerId) } },
        select: { id: true, name: true },
      });
      const byId = new Map(staff.map((s) => [s.id, s.name]));

      return {
        d: grouped.map((g, i) => ({
          r: i + 1,
          s: byId.get(g.sellerId) ?? "Unknown",
          c: g._count.id,
          a: g._sum.total_Amount ?? 0,
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});

export const getSaleInvoiceByStaff = tool({
  description: `Fetch latest ${MAX_INVOICES} sale invoices (isOrder=false) by staff name.
Return compact JSON:
- Success: { d: [{ i,n,p,dt,a }] }
- Error: { e: "no_invoices" | "error" }
Keys: i=invoiceId, n=name, p=phone, dt=date, a=amount.
Reply in Burmese and present as Markdown table (DD-MM-YYYY).`,
  inputSchema: z.object({
    staffName: z.string().describe("Seller staff name"),
  }),
  execute: async ({ staffName }) => {
    try {
      const rows = await prisma.invoice.findMany({
        where: { isOrder: false, seller: { name: staffName } },
        orderBy: { purchase_date: "desc" },
        take: MAX_INVOICES,
        select: {
          invoiceId: true,
          customer_Name: true,
          mobile_Number: true,
          purchase_date: true,
          total_Amount: true,
        },
      });
      if (!rows.length) return { e: "no_invoices" };
      return {
        d: rows.map((r) => ({
          i: r.invoiceId,
          n: r.customer_Name,
          p: r.mobile_Number ?? "",
          dt: formatDate(r.purchase_date),
          a: r.total_Amount ?? 0,
        })),
      };
    } catch {
      return { e: "error" };
    }
  },
});