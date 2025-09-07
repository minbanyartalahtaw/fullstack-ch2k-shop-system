"use server"
import prisma from "@/lib/prisma";

export type InvoiceWithDetails = {
    id: number
    invoiceId: string
    customer_Name: string
    mobile_Number: string | null
    address: string | null
    purchase_date: Date
    total_Amount: number | null
    reject_Amount: number | null
    remaining_Amount: number | null
    appointment_Date: Date | null
    seller: string
    productDetails: {
        id: number
        product_Type: string
        product_Name: string
        purity_16: number | null
        purity_15: number | null
        purity_14: number | null
        purity_14_2: number | null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        weight: any
        handWidth: string | null
        length: string | null
        isOrder: boolean
        isOrderTaken: boolean
        createdAt: Date
        updatedAt: Date
    }
}

export async function getInvoice(invoiceId: string): Promise<InvoiceWithDetails | null> {
    const invoice: InvoiceWithDetails | null = await prisma.invoice.findUnique({
        where: {
            invoiceId,
        },
        include: {
            productDetails: true,
        }
    })
    return invoice;
}