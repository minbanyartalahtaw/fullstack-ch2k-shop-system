"use server"

import prisma from "@/lib/prisma"

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
  createdAt: Date
  updatedAt: Date
  productDetailsId: number
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

type GetInvoicesParams = {
  page?: number
  limit?: number
  search?: string

  startDate?: Date
  endDate?: Date
  isOrder?: boolean
}

export async function getInvoices(params: GetInvoicesParams = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    startDate,
    endDate,
    isOrder,
  } = params

  const skip = (page - 1) * limit

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {}

  if (search) {
    where.OR = [
      { invoiceId: { contains: search, mode: 'insensitive' } },
      { customer_Name: { contains: search, mode: 'insensitive' } },
      { mobile_Number: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (startDate && endDate) {
    where.purchase_date = {
      gte: startDate,
      lte: endDate,
    }
  } else if (startDate) {
    where.purchase_date = {
      gte: startDate,
    }
  } else if (endDate) {
    where.purchase_date = {
      lte: endDate,
    }
  }

  if (isOrder !== undefined) {
    where.productDetails = {
      isOrder,
    }
  }

  try {
    // Get total count for pagination
    const total = await prisma.invoice.count({ where })

    // Get invoices with pagination, sorting, and filtering
    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        productDetails: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    // Simulate 2 second delay
    // await new Promise(resolve => setTimeout(resolve, 500))

    return {
      invoices,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    throw new Error('Failed to fetch invoices')
  }
}

