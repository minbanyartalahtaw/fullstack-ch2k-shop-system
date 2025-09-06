"use client";

import { Suspense } from "react";
import { useState } from "react";
import { InvoiceHistoryTable } from "./components/invoice-search-table";
import { InvoiceHistoryFilters } from "./components/invoice-search-filters";
import { InvoiceHistorySkeleton } from "./components/invoice-search-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppIcon } from "@/components/app-icons";
import { Separator } from "@/components/ui/separator";

export default function InvoiceHistory() {
  const [filters, setFilters] = useState({
    search: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    isOrder: undefined as boolean | undefined,
  });

  return (
    <div className="w-full h-full overflow-auto px-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppIcon name="searchInvoice" className="h-5 w-5" />
            ဘောက်ချာရှာရန်{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<InvoiceHistorySkeleton />}>
            <InvoiceHistoryFilters onFilterChange={(f) => setFilters(f)} />
            <Separator className="my-4" />
            <InvoiceHistoryTable initialFilters={filters} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
