import { streamText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are an assistant for the Chan Htaw (ချမ်းထော) office management system, supporting staff and managers with internal operations.
You assist with general questions, calculations, and access to internal data like product and invoice records.
Do not use sales language or try to sell products—reply as an office assistant would.
Respond in the Burmese language.
Be concise, clear, factual, and focused on assisting with office tasks.`,
    messages,
    tools: {
      getCurrentDateTime: tool({
        description:
          "Get the current date and time. Use this to assist staff or managers with time- or date-related queries.",
        inputSchema: z.object({}),
        execute: async () => {
          const now = new Date();
          return {
            iso: now.toISOString(),
            formatted: now.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            }),
          };
        },
      }),
      calculate: tool({
        description:
          "Calculate a basic mathematical operation (+, -, *, /, parentheses, decimals) for internal office tasks.",
        inputSchema: z.object({
          expression: z
            .string()
            .describe('Math expression, e.g. "2 + 3 * 4" or "(100 - 20) / 4"'),
        }),
        execute: async ({ expression }) => {
          const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "");
          if (!sanitized.trim()) return { error: "Invalid expression" };
          try {
            const result = new Function(
              `"use strict"; return (${sanitized})`,
            )();
            return { expression, result: Number(result) };
          } catch {
            return { expression, error: "Could not evaluate expression" };
          }
        },
      }),
      /* getProductDetails: tool({
        description:
          "Retrieve product details (e.g., purity, weight, status) by ID or name for internal review or inventory checks. This is not for customer sales.",
        inputSchema: z.object({
          id: z.number().optional().describe("The numeric ID of the product"),
          name: z
            .string()
            .optional()
            .describe("The name of the product to search for"),
        }),
        execute: async ({ id, name }) => {
          try {
            if (id) {
              const product = await prisma.productDetails.findUnique({
                where: { id },
              });
              return product || { error: "Product not found" };
            }
            if (name) {
              const products = await prisma.productDetails.findMany({
                where: {
                  productName: {
                    contains: name,
                    mode: "insensitive",
                  },
                },
                take: 5,
              });
              return products.length > 0
                ? products
                : { error: "No products found matching that name" };
            }
            return { error: "Please provide either an ID or a name" };
          } catch (error) {
            console.error("Error fetching product details:", error);
            return { error: "Failed to fetch product details from database" };
          }
        },
      }), */
      // Search the invoice details by invoice id
      getInvoiceDetails: tool({
        description: `
        Fetch invoice (ဘောက်ချာ) by Invoice ID (e.g. INV-123). Reply in the Burmese language.

Present as a simple 2-column HTML table and top show with h3 tag:
- Tag : <h3>ဘောက်ချာအသေးစိတ်</h3>
- Then one data row per line: <tr><td>label</td><td>value</td></tr>
- Row order: ဘောက်ချာ → အမည် → ဖုန်း → ရက်စွဲ (purchase_date) → တန်ဖိုး → ရောင်းသူ. Use DD-MM-YYYY for dates.
- For productDetails: add one row per product: ပစ္စည်းအမည်, အမျိုးအစား; if that product has isOrder true, add a row Status with value ပေးပြီး or မပေးရသေး from isOrderTaken.
- Keep labels in the first column and values in the second. No merged cells.
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
                select: {
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
                },
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
      }),

      // Get the latest 15 order invoices
      getOrderInvoice: tool({
        description: `Fetch up to 10 latest invoices where product is an order (isOrder = true). Use for 
        အော်ဒါဘောက်ချာ or order list; do NOT use for single invoice lookup by ID. Reply in the user's language.
       at first show with h3 tag: <h3>နောက်ဆုံး အော်ဒါ {number of invoices} ခု</h3>
        Present as ONE horizontal table: one header row with <th> cells, then one <tr> per invoice with <td> cells. Keep each row on one line (many columns) so the user can scroll left-right. Columns: ဘောက်ချာ, အမည်, ဖုန်း, တန်ဖိုး, အမျိုးအစား, ပစ္စည်းအမည်, Status (ပေးပြီး/မပေးရသေး from isOrderTaken). Format dates YYYY-MM-DD.`,
        inputSchema: z.object({}),
        execute: async () => {
          try {
            console.log("Fetching order invoices...");
            const invoices = await prisma.invoice.findMany({
              where: {
                productDetails: {
                  isOrder: true,
                },
              },
              select: {
                invoiceId: true,
                customer_Name: true,
                mobile_Number: true,
                purchase_date: true,
                appointment_Date: true,
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
              },
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
      }),

      // Get all product types with each type's name and the count of ProductDetails (products) under that type
      getAllProductTypeDetails: tool({
        description: `Fetch all product types with each type's name and the count of ProductDetails (products) under that type. Use when the user asks for all product types, product type list, or summary of categories with counts,or which product 
        is the most sold product.
        . Not for sales.
        Show with html table and at first show with h3 tag: <h3>ပစ္စည်းအမျိုးအစားများ</h3>
        Show with html table: use <table>, first row <tr><th>အမျိုးအစား</th><th>အရေအတွက်</th></tr>, then one <tr><td>label</td><td>value</td></tr> per field (အမျိုးအစား, အရေအတွက်).
        `,
        inputSchema: z.object({}),
        execute: async () => {
          try {
            const productTypes = await prisma.productType.findMany({
              select: {
                name: true,
                _count: { select: { productDetails: true } },
              },
              orderBy: { name: "asc" },
            });
            return productTypes.map((pt) => ({
              name: pt.name,
              productDetailsCount: pt._count.productDetails,
            }));
          } catch (error) {
            console.error("Error fetching product types:", error);
            return { error: "Failed to fetch product types from database" };
          }
        },
      }),
    },
    stopWhen: stepCountIs(5),
  });

  return result.toTextStreamResponse();
}
