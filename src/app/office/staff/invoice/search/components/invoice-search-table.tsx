"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import { getInvoices, type InvoiceWithDetails } from "../action";
import { InvoiceHistorySkeleton } from "./invoice-search-skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types
interface InvoiceHistoryTableProps {
  initialFilters: {
    search: string;
    startDate?: Date;
    endDate?: Date;
    isOrder?: boolean;
  };
  onLoadingChange?: (isLoading: boolean) => void;
}

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

// Constants
const COLUMNS: ColumnConfig[] = [
  { id: "invoiceId", label: "စဥ်", visible: true },
  { id: "invoiceNumber", label: "ဘောက်ချာနံပါတ်", visible: true },
  { id: "customerName", label: "အမည်", visible: true },
  { id: "mobile", label: "ဖုန်းနံပါတ်", visible: true },
  { id: "purchaseDate", label: "ရက်စွဲ", visible: true },
  { id: "productType", label: "ပစ္စည်းအမျိုးအစား", visible: true },
  { id: "totalAmount", label: "တန်ဖိုး", visible: true },
  { id: "receivedAmount", label: "စရံငွေ", visible: false },
  { id: "remainingAmount", label: "ကျန်ငွေ", visible: false },
  { id: "orderType", label: "အော်ဒါ/အရောင်း", visible: true },
  { id: "actions", label: "အသေးစိတ်", visible: true },
];

// Utility functions
const formatDate = (date: Date) => new Date(date).toLocaleDateString();
const formatCurrency = (amount: number | null) =>
  amount === null ? "-" : amount.toLocaleString();

export function InvoiceHistoryTable({
  initialFilters,
  onLoadingChange,
}: InvoiceHistoryTableProps) {
  // State
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const [searchParams, setSearchParams] = useState(initialFilters);
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS.map((col) => [col.id, col.visible]))
  );

  // Handlers
  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  const fetchInvoices = async () => {
    setLoading(true);
    onLoadingChange?.(true);

    try {
      const result = await getInvoices({
        page: pagination.page,
        limit: pagination.limit,
        ...searchParams,
      });
      setInvoices(result.invoices);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  // Effects
  useEffect(() => {
    setSearchParams(initialFilters);
  }, [initialFilters]);

  useEffect(() => {
    // Only fetch if search is not empty
    if (searchParams.search.trim() !== "") {
      const debounceTimer = setTimeout(fetchInvoices, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      // Clear invoices when search is empty
      setInvoices([]);
      setPagination({ total: 0, page: 1, limit: 10, totalPages: 0 });
      setLoading(false);
      onLoadingChange?.(false);
    }
  }, [pagination.page, pagination.limit, searchParams]);

  // Render helpers
  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        {COLUMNS.map(
          (column) =>
            columnVisibility[column.id] && (
              <TableHead key={column.id}>
                <Button variant="ghost" className="flex items-center gap-1">
                  {column.label}
                </Button>
              </TableHead>
            )
        )}
      </TableRow>
    </TableHeader>
  );

  const renderTableBody = () => {
    if (loading)
      return (
        <TableRow>
          <TableCell colSpan={10}>
            <InvoiceHistorySkeleton />
          </TableCell>
        </TableRow>
      );
    if (!invoices.length) {
      return (
        <TableRow>
          <TableCell colSpan={10} className="text-center py-8">
            <p className="text-lg font-medium text-muted-foreground">
              ဘောက်ချာမှတ်တမ်းမရှိပါ
            </p>
          </TableCell>
        </TableRow>
      );
    }

    return invoices.map((invoice) => (
      <TableRow key={invoice.id}>
        {columnVisibility.invoiceId && <TableCell>{invoice.id}</TableCell>}
        {columnVisibility.invoiceNumber && (
          <TableCell className="border">{invoice.invoiceId}</TableCell>
        )}
        {columnVisibility.customerName && (
          <TableCell className="border">{invoice.customer_Name}</TableCell>
        )}
        {columnVisibility.mobile && (
          <TableCell className="border">{invoice.mobile_Number}</TableCell>
        )}
        {columnVisibility.purchaseDate && (
          <TableCell className="border">
            {formatDate(invoice.purchase_date)}
          </TableCell>
        )}
        {columnVisibility.productType && (
          <TableCell className="border">
            {invoice.productDetails.productType}
          </TableCell>
        )}
        {columnVisibility.totalAmount && (
          <TableCell className="border">
            {formatCurrency(invoice.total_Amount)}
          </TableCell>
        )}
        {columnVisibility.receivedAmount && (
          <TableCell className="border">
            {formatCurrency(invoice.reject_Amount)}
          </TableCell>
        )}
        {columnVisibility.remainingAmount && (
          <TableCell className="border">
            {formatCurrency(invoice.remaining_Amount)}
          </TableCell>
        )}
        {columnVisibility.orderType && (
          <TableCell className="min-w-[62px] border">
            <span
              className={`inline-flex text-center items-center rounded-full px-2 py-1 text-xs font-medium ${
                invoice.productDetails.isOrder
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}>
              {invoice.productDetails.isOrder ? "အော်ဒါ" : "အရောင်း"}
            </span>
          </TableCell>
        )}
        {columnVisibility.actions && (
          <TableCell>
            <a href={`/office/staff/invoice/${invoice.invoiceId}`}>
              <AppIcon name="squareArrow" className="h-4 w-4" />
              <span className="sr-only">View</span>
            </a>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={fetchInvoices}
          disabled={loading}>
          <AppIcon name="reset" className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <AppIcon name="view" className="h-4 w-4" />
              View
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <h4 className="font-medium">ကော်လံများရွေးချယ်ရန်</h4>
              <div className="space-y-2">
                {COLUMNS.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.id}`}
                      checked={columnVisibility[column.id]}
                      onCheckedChange={() => toggleColumnVisibility(column.id)}
                    />
                    <Label htmlFor={`column-${column.id}`}>
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            {renderTableHeader()}

            <TableBody>
              {searchParams.search.trim() === "" ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <p className="text-lg font-medium text-muted-foreground">
                      ရှာဖွေရန် စာသားရိုက်ထည့်ပါ
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                renderTableBody()
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-end px-3 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}>
            <AppIcon name="arrowLeft" className="h-4 w-4" />
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={pagination.page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: i + 1 }))
              }>
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.totalPages}>
            <AppIcon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
