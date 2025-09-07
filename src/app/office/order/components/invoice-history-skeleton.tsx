'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export function InvoiceHistorySkeleton() {
  return (
    <div className="space-y-4">


      {/* Table header skeleton */}
      <div className="rounded-md ">


        {/* Table rows skeleton */}
        <Table>
          <TableBody>
            {Array.from({ length: 12 }).map((_, index) => (
              <TableRow key={index} >
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-full" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>


    </div>
  )
}