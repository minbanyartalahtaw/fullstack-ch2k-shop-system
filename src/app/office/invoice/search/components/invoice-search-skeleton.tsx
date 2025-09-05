'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function InvoiceHistorySkeleton() {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full md:w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Table header skeleton */}
      <div className="rounded-md border">
        <div className="flex items-center h-12 px-4 border-b bg-muted/50">
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6 ml-4" />
          <Skeleton className="h-4 w-1/6 ml-4" />
          <Skeleton className="h-4 w-1/6 ml-4" />
          <Skeleton className="h-4 w-1/6 ml-4" />
          <Skeleton className="h-4 w-1/6 ml-4" />
        </div>

        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center h-16 px-4 border-b">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/6 ml-4" />
            <Skeleton className="h-4 w-1/6 ml-4" />
            <Skeleton className="h-4 w-1/6 ml-4" />
            <Skeleton className="h-4 w-1/6 ml-4" />
            <Skeleton className="h-4 w-1/6 ml-4" />
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between py-4">
        <Skeleton className="h-8 w-[100px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  )
}