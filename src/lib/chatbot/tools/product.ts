import { tool } from "ai";
import { z } from "zod";
import prisma from "@/lib/prisma";

export const getAllProductTypeDetails = tool({
  description: `Fetch all product types with each type's name and the count of ProductDetails (products) under that type. Use when the user asks for all product types, product type list, or summary of categories with counts, or which product is the most sold product. Not for sales.
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
        productDetailsCount: pt._count.productDetails,
      }));
    } catch (error) {
      console.error("Error fetching product types:", error);
      return { error: "Failed to fetch product types from database" };
    }
  },
});
