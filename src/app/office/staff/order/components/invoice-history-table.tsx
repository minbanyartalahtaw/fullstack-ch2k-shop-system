"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import {
  getInvoices,
  undoUpdateOrderTaken,
  updateInvoiceIsOrderTaken,
  type InvoiceWithDetails,
} from "../action";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ORDER_STATUS } from "@/lib/constants/order-status";
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
import { useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDate } from "@/lib/constants/date_format";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";

// Types
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

// Constants
const COLUMNS: ColumnConfig[] = [
  { id: "invoiceId", label: "စဥ်", visible: false },
  { id: "invoiceNumber", label: "ဘောက်ချာနံပါတ်", visible: true },
  { id: "customerName", label: "အမည်", visible: true },
  { id: "mobile", label: "ဖုန်းနံပါတ်", visible: true },
  { id: "purchaseDate", label: "ရက်စွဲ", visible: true },
  { id: "appointmentDate", label: "ရက်ချိန်း", visible: true },
  { id: "productType", label: "ပစ္စည်းအမျိုးအစား", visible: true },
  { id: "productName", label: "ပစ္စည်းအမည်", visible: true },
  { id: "totalAmount", label: "တန်ဖိုး", visible: true },
  { id: "receivedAmount", label: "စရံငွေ", visible: false },
  { id: "remainingAmount", label: "ကျန်ငွေ", visible: false },
  { id: "length", label: "အရှည်", visible: false },
  { id: "handWidth", label: "လက်တိုင်း", visible: false },
  { id: "isOrderTaken", label: "ပစ္စည်းပေးရန်", visible: true },
  { id: "actions", label: "အသေးစိတ်", visible: true },
];

// Utility functions

const formatCurrency = (amount: number | null) =>
  amount === null ? "-" : amount.toLocaleString();

export function InvoiceHistoryTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const initialPage =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  // State
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialPage,
    limit: 10,
    totalPages: 0,
  });

  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS.map((col) => [col.id, col.visible])),
  );

  // Handlers

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const fetchInvoices = async () => {
    setLoading(true);

    try {
      const result = await getInvoices({
        page: pagination.page,
        limit: pagination.limit,
      });
      setInvoices(result.invoices);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIsOrderTakenClick = async (invoiceId: string, name: string) => {
    try {
      // Show success toast with undo button
      // First update the order status
      await updateInvoiceIsOrderTaken(invoiceId);
      await fetchInvoices(); // Refresh table with updated data

      toast.success(
        `${name} အော်ဒါပစ္စည်းပေးပြီး 
        `,
        {
          action: {
            label: "cancel",
            onClick: async () => {
              try {
                await undoUpdateOrderTaken(invoiceId); // Toggle back the status
                await fetchInvoices(); // Refresh with reverted data
                toast.info(`Cancel ${name} အော်ဒါပစ္စည်း`);
              } catch (error) {
                toast.error("Failed to undo the action");
                console.log(error);
              }
            },
          },
        },
      );
    } catch (error) {
      toast.error("Server Error.", {
        description: "Please try again later",
      });
      throw error;
    }
  };

  // Effects
  useEffect(() => {
    const current = Number(searchParams.get("page") || "1");
    const nextPage = Number.isFinite(current) && current > 0 ? current : 1;
    if (nextPage !== pagination.page) {
      setPagination((prev) => ({ ...prev, page: nextPage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  // Render helpers
  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        {COLUMNS.map(
          (column) =>
            columnVisibility[column.id] && (
              <TableHead key={column.id}>{column.label}</TableHead>
            ),
        )}
      </TableRow>
    </TableHeader>
  );

  const renderTableBody = () => {
    if (loading)
      return (
        <TableRow>
          <TableCell colSpan={11}>
            <TableSkeleton />
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
        {columnVisibility.appointmentDate && (
          <TableCell className="border">
            {invoice.appointment_Date
              ? formatDate(invoice.appointment_Date)
              : "-"}
          </TableCell>
        )}
        {columnVisibility.productType && (
          <TableCell className="border">
            {invoice.productDetails.productType}
          </TableCell>
        )}
        {columnVisibility.productName && (
          <TableCell className="border">
            {invoice.productDetails.productName}
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
        {columnVisibility.length && (
          <TableCell className="border">
            {invoice.productDetails.length ?? "-"}
          </TableCell>
        )}
        {columnVisibility.handWidth && (
          <TableCell className="border">
            {invoice.productDetails.handWidth ?? "-"}
          </TableCell>
        )}
        {columnVisibility.isOrderTaken && (
          <TableCell className="border">
            <Dialog>
              <DialogTrigger
                disabled={invoice.orderStatus === ORDER_STATUS.ORDER_COMPLETED}
                asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  {invoice.orderStatus === ORDER_STATUS.ORDER_COMPLETED
                    ? "ပစ္စည်းပေးပြီး"
                    : "ပစ္စည်းပေးရန်"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>အတည်ပြုရန်</DialogTitle>

                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-semibold">
                        ဘောက်ချာနံပါတ်
                      </TableCell>
                      <TableCell>{invoice.invoiceId}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">အမည်</TableCell>
                      <TableCell>{invoice.customer_Name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold">
                        ပစ္စည်းအမျိုးအစား
                      </TableCell>
                      <TableCell>
                        {invoice.productDetails.productType}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <DialogFooter>
                  <Button
                    className="cursor-pointer"
                    variant="destructive"
                    onClick={() =>
                      handleIsOrderTakenClick(
                        invoice.invoiceId,
                        invoice.customer_Name,
                      )
                    }>
                    ပစ္စည်းပေးရန်
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination className="flex items-center justify-end  space-x-2">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(pagination.page - 1)}
                className={
                  pagination.page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {(() => {
              const { page, totalPages } = pagination;
              const pages: (number | "...")[] = [];
              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push("...");
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (page < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }
              return pages.map((p, idx) =>
                p === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => setPage(p)}
                      className="cursor-pointer">
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              );
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(pagination.page + 1)}
                className={
                  pagination.page === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
