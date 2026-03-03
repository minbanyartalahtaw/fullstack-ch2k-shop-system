import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { parseDate, toUTCEndOfDay, toUTCStartOfDay } from "./utils/date";

export const getTotalPriceWithDate = tool({
  description: `Get total sales amount for an exact date. Use when user asks daily total sales amount (e.g.
     'ဒီနေ့ဘယ်လောက်ရောင်းရလဲ', '01-03-2026 (DD-MM-YYYY) ရဲ့စုစုပေါင်းတန်ဖိုး' ). Reply in Burmese and show date with total amount.
     Reply with this format :
     ဒီနေ့ {currentDate DD-MM-YYYY MyanmarNumber} စုစုပေါင်းတန်ဖိုး {totalAmount MyanmarNumber with comma} ကျပ်ရောင်းရပါသည်။
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
        invoiceCount: count,
        totalAmount: result._sum.total_Amount ?? 0,
      };
    } catch (error) {
      console.error("Error fetching total price with date:", error);
      return { error: "နေ့စဉ်စုစုပေါင်းတန်ဖိုး ရယူရာတွင် ပြဿနာရှိပါတယ်။" };
    }
  },
});
