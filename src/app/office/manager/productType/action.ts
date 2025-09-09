"use server"
import prisma from "@/lib/prisma";

export async function addProductType(formData: FormData) {
    const productName = formData.get('productName');
    if (!productName) {
        throw new Error("Product name is required");
    }
    await prisma.productType.create({
        data: {
            name: productName as string,
        }
    })
}

export async function getProductTypes() {
    return prisma.productType.findMany();
}