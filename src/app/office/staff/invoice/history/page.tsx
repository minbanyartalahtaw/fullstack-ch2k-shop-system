'use client'

import { Suspense } from 'react'

import { InvoiceHistoryTable } from './components/invoice-history-table'

import { InvoiceHistorySkeleton } from './components/invoice-history-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppIcon } from '@/components/app-icons'


export default function InvoiceHistory() {

    return (
        <div className="w-full h-full overflow-auto  px-1">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AppIcon name="invoiceHistory" className="h-5 w-5" />
                        ဘောက်ချာအဟောင်းများ                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<InvoiceHistorySkeleton />}>
                        <InvoiceHistoryTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}