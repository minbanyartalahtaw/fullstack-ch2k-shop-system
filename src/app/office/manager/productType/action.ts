"use server";
import prisma from "@/lib/prisma";

export async function addProductType(formData: FormData) {
  const productName = formData.get("productName") as string;
  if (!productName) {
    throw new Error("Product name is required");
  }
  const isProductNameIsTaken = await prisma.productType.findFirst({
    where: {
      name: productName as string,
    },
  });

  if (isProductNameIsTaken) {
    return {
      status: false,
      message: `${productName} ကိုထပ်ပြုလုပ်၍မရပါ။`,
    };
  }
  const productType = await prisma.productType.create({
    data: {
      name: productName as string,
    },
    select: {
      name: true,
    },
  });
  return { status: true, message: `${productType.name} added successfully` };
}

export async function getProductTypes() {
  return prisma.productType.findMany({ orderBy: { id: "asc" } });
}

export async function toggleProductType(id: number) {
  const productType = await prisma.productType.findUnique({ where: { id } });
  if (!productType) {
    return { status: false, message: "Product type not found" };
  }

  const updated = await prisma.productType.update({
    where: { id },
    data: { isAvailable: !productType.isAvailable },
    select: { name: true, isAvailable: true },
  });

  return {
    status: true,
    message: `${updated.name} ${updated.isAvailable ? "enabled" : "disabled"}`,
  };
}
