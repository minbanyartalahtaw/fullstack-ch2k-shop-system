'use client'

import { Skeleton } from '@/components/ui/skeleton'


export function InvoiceHistorySkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between ">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}