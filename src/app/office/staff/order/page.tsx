"use client";

import { InvoiceHistoryTable } from "./components/invoice-order-table";

export default function InvoiceHistory() {
  return (
    <div className="flex-1 min-w-0 p-3 md:p-4">
      <InvoiceHistoryTable />
    </div>
  );
}
