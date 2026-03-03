import { streamText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `You are an assistant for the Chan Htaw (ချမ်းထော) office management system, supporting staff and managers with internal operations.
You assist with general questions, calculations, date/time info, and access to internal data like product and invoice records.
Do not use sales language or try to sell products—reply as an office assistant would.
Respond in the same language as the user. If the user writes in Burmese, respond in Burmese. If user start the chat with INV-***
also respond in Burmese.
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
        description: `Fetch invoice(ဘောက်ချာ) details by Invoice ID (ဘောက်ချာ ID) for internal ref
          erence—includes order status, totals, or purchase history. Not for sales or offers. 
          Output should be format like this : 
          ဘောက်ချာ - invoiceId
          အမည် - customer_Name
          ဖုန်းနံပါတ် - mobile_Number
          တန်ဖိုး - total_Amount ကျပ်
          အမျိုးအစား - productType (true=အော်ဒါပစ္စည်း OR false=အရောင်းပစ္စည်း) this value based on isOrder value (ပေးပြီး OR မပေးရသေးပါ) this value based on isOrder value if false hide this if true and isOrderTaken value
          ပစ္စည်းအမည် - productName
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
              error: "Please provide either an Invoice ID or a customer name",
            };
          } catch (error) {
            console.error("Error fetching invoice details:", error);
            return { error: "Failed to fetch invoice details from database" };
          }
        },
      }),

      // Get the latest 15 order invoices
      getOrderInvoice: tool({
        description: `Fetch up to 15 latest invoices where the associated product is an order (ProductDetails.isOrder = true). Use when the user asks for order, အော်ဒါဘောက်ချာ, or invoices that are orders.        `,
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
              orderBy: { createdAt: "desc" },
              take: 15,
            });
            return invoices.length > 0
              ? invoices
              : { message: "No order invoices found", invoices: [] };
          } catch (error) {
            console.error("Error fetching order invoices:", error);
            return { error: "Failed to fetch order invoices from database" };
          }
        },
      }),

      // Get all product types with each type's name and the count of ProductDetails (products) under that type
      getAllProductTypeDetails: tool({
        description: `Fetch all product types with each type's name and the count of ProductDetails (products) under that type. Use when the user asks for all product types, product type list, or summary of categories with counts. Not for sales.
        /**
         * Show line by line like this:
         * Example format:
         Electronics -  15 ခု            
         Furniture - 8  ခု              
         */
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
