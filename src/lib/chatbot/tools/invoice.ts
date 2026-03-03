import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { parseDate, toUTCStartOfDay, toUTCEndOfDay } from "./utils/date";

const invoiceSelect = {
  invoiceId: true,
  customer_Name: true,
  mobile_Number: true,
  purchase_date: true,
  total_Amount: true,
  seller: true,
  productDetails: {
    select: {
      productName: true,
      productType: true,
      isOrder: true,
      isOrderTaken: true,
    },
  },
} as const;

const invoiceSelectWithAppointment = {
  ...invoiceSelect,
  appointment_Date: true,
} as const;

const invoiceSelectForDateRange = {
  invoiceId: true,
  customer_Name: true,
  mobile_Number: true,
  purchase_date: true,
  total_Amount: true,
  seller: true,
  productDetails: {
    select: {
      productName: true,
      productType: true,
    },
  },
} as const;

export const getInvoiceDetails = tool({
  description: `
Fetch invoice (ဘောက်ချာ) by Invoice ID (e.g. INV-123). Reply in the Burmese language.

Present as a simple 2-column Markdown table and top show with h3 tag:
- Tag : ဘောက်ချာအသေးစိတ်
- Table columns: | အကြောင်းအရာ | အသေးစိတ် |
- Row order: ဘောက်ချာ, အမည်, ဖုန်း, ရက်စွဲ (purchase_date), တန်ဖိုး, ရောင်းသူ. Use DD-MM-YYYY for dates.
- For productDetails: add one row per product: ပစ္စည်းအမည်, အမျိုးအစား; if that product has isOrder true, add a row Status with value ပေးပြီး or မပေးရသေး from isOrderTaken.
  `,
  inputSchema: z.object({
    invoiceId: z
      .string()
      .optional()
      .describe("The unique Invoice ID (ဘောက်ချာ ID) (e.g., INV-123)"),
  }),
  execute: async ({ invoiceId }) => {
    try {
      if (invoiceId) {
        const invoice = await prisma.invoice.findUnique({
          where: { invoiceId },
          select: invoiceSelect,
        });
        return invoice || { error: "Invoice not found" };
      }
      return {
        error:
          "ဘောက်ချာနံပါတ် (Invoice ID) မှန်ကန်မှသာ ရရှိလိမ့်မည်။ ကျေးဇူးပြု၍ သေချာပြန်စစ်ပါ။",
      };
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      return { error: "Failed to fetch invoice details from database" };
    }
  },
});

export const getOrderInvoice = tool({
  description: `Fetch up to 10 latest invoices where product is an order (isOrder = true). Use for 
အော်ဒါဘောက်ချာ or order list; do NOT use for single invoice lookup by ID. Reply in the user's language.
at first show with3 tag:  နောက်ဆုံး အော်ဒါ {number of invoices} ခု
Present as a Markdown table. Columns: ဘောက်ချာ, အမည်, ဖုန်း, တန်ဖိုး, အမျိုးအစား, ပစ္စည်းအမည်, Status (ပေးပြီး/မပေးရသေး from isOrderTaken). Format dates YYYY-MM-DD.`,
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const invoices = await prisma.invoice.findMany({
        where: {
          productDetails: {
            isOrder: true,
          },
        },
        select: invoiceSelectWithAppointment,
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      return invoices.length > 0
        ? invoices
        : {
            message: "အော်ဒါ ဘောက်ချာတွေ မရှိသေးပါဘူး။",
            invoices: [],
          };
    } catch (error) {
      console.error("Error fetching order invoices:", error);
      return { error: "Failed to fetch order invoices from database" };
    }
  },
});

export const getInvoiceDetailsWithDateRange = tool({
  description: `Fetch invoices by purchase date range. Use when the user asks for invoices within a date range (e.g. "ရက်စွဲ ... မှ ... အထိ ဘောက်ချာများ").
Reply in Burmese. First show: ဘောက်ချာများ
Then one Markdown table with columns: ဘောက်ချာ, အမည်, ဖုန်း, တန်ဖိုး, အမျိုးအစား, ပစ္စည်းအမည်, ရက်စွဲ. Format dates DD-MM-YYYY.`,
  inputSchema: z.object({
    startDate: z
      .string()
      .optional()
      .describe("Start of date range (DD-MM-YYYY)"),
    endDate: z.string().optional().describe("End of date range (DD-MM-YYYY)"),
  }),
  execute: async ({ startDate, endDate }) => {
    try {
      if (!startDate && !endDate) {
        return {
          error:
            "ရက်စွဲ စမှတ် သို့မဟုတ် ဆုံးမှတ် ထည့်ပေးပါ။ (Provide start date and/or end date, e.g. DD-MM-YYYY)",
        };
      }
      const start = startDate ? parseDate(startDate) : undefined;
      const end = endDate ? parseDate(endDate) : undefined;
      if (startDate && !start) {
        return {
          error: "စမှတ် ရက်စွဲ မမှန်ပါ။ (Invalid start date, use DD-MM-YYYY)",
        };
      }
      if (endDate && !end) {
        return {
          error: "ဆုံးမှတ် ရက်စွဲ မမှန်ပါ။ (Invalid end date, use DD-MM-YYYY)",
        };
      }
      const startUTC = start ? toUTCStartOfDay(start) : undefined;
      const endUTC = end ? toUTCEndOfDay(end) : undefined;
      if (startUTC && isNaN(startUTC.getTime())) {
        return { error: "စမှတ် ရက်စွဲ မမှန်ပါ။ (Invalid start date)" };
      }
      if (endUTC && isNaN(endUTC.getTime())) {
        return { error: "ဆုံးမှတ် ရက်စွဲ မမှန်ပါ။ (Invalid end date)" };
      }
      const invoices = await prisma.invoice.findMany({
        where: {
          purchase_date: {
            ...(startUTC && { gte: startUTC }),
            ...(endUTC && { lte: endUTC }),
          },
        },
        select: invoiceSelectForDateRange,
        orderBy: { purchase_date: "desc" },
        take: 50,
      });
      if (invoices.length === 0) {
        return {
          message: "ထို ရက်စွဲအတွင်း ဘောက်ချာ မရှိပါ။",
          invoices: [],
        };
      }
      return {
        message: `ရက်စွဲအတွင်း ဘောက်ချာ ${invoices.length} ခု ရှိပါသည်။`,
        invoices,
      };
    } catch (error) {
      console.error("Error fetching invoices by date range:", error);
      return { error: "Failed to fetch invoices by date range" };
    }
  },
});
