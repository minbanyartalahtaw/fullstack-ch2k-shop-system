"use server"

import prisma from "@/lib/prisma"

interface ProductDetailsInput {
    product_Type: string;
    product_Name: string;
    purity_16?: number | null;
    purity_15?: number | null;
    purity_14?: number | null;
    purity_14_2?: number | null;
    weight: {
        row1: number[];
        row2: number[];
        row3: number[];
        row4: number[];
        row5: number[];
        row6: number[];
    };
    handWidth: string;
    length: string;
    isOrder: boolean;
    isOrderTaken: boolean;
}

interface InvoiceDataInput {
    invoiceId?: string;
    customer_Name: string;
    mobile_Number: string;
    address: string;
    purchase_date: Date;
    product_Details: ProductDetailsInput;
    total_Amount?: number | null;
    reject_Amount?: number | null;
    remaining_Amount?: number | null;
    appointment_Date?: Date | null;
    seller: string;
}

export async function createInvoice(formData: InvoiceDataInput) {
    try {
        const productDetails = await prisma.productDetails.create({
            data: {
                product_Type: formData.product_Details.product_Type,
                product_Name: formData.product_Details.product_Name,
                // Ensure null for optional fields if they are undefined
                purity_16: formData.product_Details.purity_16 ?? null,
                purity_15: formData.product_Details.purity_15 ?? null,
                purity_14: formData.product_Details.purity_14 ?? null,
                purity_14_2: formData.product_Details.purity_14_2 ?? null,
                // Explicitly provide the object for weight. The `as any` is typically fine.
                weight: formData.product_Details.weight, // Prisma should handle serialization to JSONB
                handWidth: formData.product_Details.handWidth,
                length: formData.product_Details.length,
                isOrder: formData.product_Details.isOrder,
                isOrderTaken: formData.product_Details.isOrderTaken,
            },
        })

        const invoice = await prisma.invoice.create({
            data: {
                invoiceId: `INV-${Date.now().toString().slice(0, 4)}-${Date.now().toString().slice(4, 8)}-${Date.now().toString().slice(8, 12)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                customer_Name: formData.customer_Name,
                mobile_Number: formData.mobile_Number,
                address: formData.address,
                purchase_date: formData.purchase_date,
                total_Amount: formData.total_Amount ?? null, // Ensure null for optional numbers
                reject_Amount: formData.reject_Amount ?? null,
                remaining_Amount: formData.remaining_Amount ?? null,
                appointment_Date: formData.appointment_Date ?? null,
                seller: formData.seller,
                productDetailsId: productDetails.id,
            },
            include: {
                productDetails: true,
            }
        })

        console.log("Invoice created successfully:", invoice);
        return { success: true, invoice };
    } catch (error) {
        console.error("Failed to create invoice:", error);
        return { success: false, error: (error as Error).message };
    }
}