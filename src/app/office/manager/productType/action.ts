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
      message: `${productName} is taken. You can't create a new one.`,
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
  return prisma.productType.findMany();
}
