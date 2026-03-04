import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { parseDate, toUTCEndOfDay, toUTCStartOfDay } from "./utils/date";

export const getTotalPriceAndInvoiceCountWithDate = tool({
  description: `Get total sales amount for an exact date. Use when user asks daily total sales amount (e.g.
     'ဒီနေ့ဘယ်လောက်ရောင်းရလဲ', '01-03-2026 (DD-MM-YYYY) ရဲ့စုစုပေါင်းတန်ဖိုး' ). Reply in Burmese and show date with total amount.
     Reply with this format :
     if there is no invoice, reply with "{currentDate DD-MM-YYYY MyanmarNumber} တွင် ဘောက်ချာများ မရှိပါ။"
     {currentDate DD-MM-YYYY MyanmarNumber} တွင် ဘောက်ချာ {invoiceCount MyanmarNumber} ခု ရောင်းရပါသည်။ စုစုပေါင်းတန်ဖိုးမှာ {totalAmount MyanmarNumber with comma} ကျပ်ဖစ်ပါတယ်။
     `,
  inputSchema: z.object({
    date: z
      .string()
      .describe("Target date in DD-MM-YYYY (also accepts YYYY-MM-DD)"),
  }),
  execute: async ({ date }) => {
    try {
      const parsed = parseDate(date);
      if (!parsed) {
        return { error: "ရက်စွဲ format မမှန်ပါ။ DD-MM-YYYY ဖြင့်ထည့်ပါ။" };
      }

      const startUTC = toUTCStartOfDay(parsed);
      const endUTC = toUTCEndOfDay(parsed);

      const [result, count] = await Promise.all([
        prisma.invoice.aggregate({
          where: {
            purchase_date: {
              gte: startUTC,
              lte: endUTC,
            },
          },
          _sum: {
            total_Amount: true,
          },
        }),
        prisma.invoice.count({
          where: {
            purchase_date: {
              gte: startUTC,
              lte: endUTC,
            },
          },
        }),
      ]);

      return {
        date,
        count: count,
        total: result._sum.total_Amount ?? 0,
      };
    } catch (error) {
      console.error("Error fetching total price with date:", error);
      return { error: "နေ့စဉ်စုစုပေါင်းတန်ဖိုး ရယူရာတွင် ပြဿနာရှိပါတယ်။" };
    }
  },
});
