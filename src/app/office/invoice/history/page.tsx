'use client'

import { Suspense } from 'react'

import { InvoiceHistoryTable } from './components/invoice-history-table'

import { InvoiceHistorySkeleton } from './components/invoice-history-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppIcon } from '@/components/app-icons'
import { useIsMobile } from '@/hooks/use-mobile'

export default function InvoiceHistory() {
    const isMobile = useIsMobile();
    return (
        <div className="w-full h-full overflow-auto  px-2">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AppIcon name="invoiceHistory" className="h-5 w-5" />
                        ဘောက်ချာအဟောင်းများ                    </CardTitle>
                </CardHeader>
                <CardContent className={`${isMobile ? 'p-1' : ''}`} >
                    <Suspense fallback={<InvoiceHistorySkeleton />}>
                        <InvoiceHistoryTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    )
}