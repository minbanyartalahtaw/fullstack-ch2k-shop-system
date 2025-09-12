"use server"
import prisma from "@/lib/prisma";

export async function addProductType(formData: FormData) {
    const productName = formData.get('productName') as string;
    if (!productName) {
        throw new Error("Product name is required");
    }
    const productType = await prisma.productType.create({
        data: {
            name: productName as string,
        },
        select: {
            name: true,
        }
    })
    return { message: `${productType.name} added successfully` }
}

export async function getProductTypes() {
    return prisma.productType.findMany();
}