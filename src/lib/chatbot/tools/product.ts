import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const getAllProductTypeDetails = tool({
  description: `Fetch all product types with each type's name and the count of ProductDetails (products) under that type. Use when the user asks for all product types, product type list, Not for sales.
Show with Markdown table and at first show with h3 tag: ### ပစ္စည်းအမျိုးအစားများ
Table format: | အမျိုးအစား | အရေအတွက် |`,
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
        count: pt._count.productDetails,
      }));
    } catch (error) {
      console.error("Error fetching product types:", error);
      return { error: "Failed to fetch product types from database" };
    }
  },
});

export const analyzeProductSales = tool({
  description: `Analyze product type sales data to identify the most sold product.
  Return the product name and the count of sales.
  Return in Burmese and present as Markdown table.`,
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const productSales = await prisma.productDetails.findMany({
        select: { productName: true, _count: { select: { invoices: true } } },
      });
      return productSales.map((ps) => ({
        productName: ps.productName,
        count: ps._count.invoices,
      }));
    } catch (error) {
      console.error("Error analyzing product sales:", error);
      return { error: "Failed to analyze product sales from database" };
    }
  },
});
