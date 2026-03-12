"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppIcon } from "@/components/app-icons";
import { getInvoices, type InvoiceWithDetails } from "../action";

import { useRouter, useSearchParams } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Link from "next/link";
import { formatDate } from "@/lib/constants/date_format";
import { TableSkeleton } from "@/components/skeleton/table-skeleton";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

const COLUMNS: ColumnConfig[] = [
  { id: "invoiceId", label: "ဘောက်ချာနံပါတ်", visible: false },
  { id: "customerName", label: "အမည်", visible: true },
  { id: "mobile", label: "ဖုန်းနံပါတ်", visible: true },
  { id: "purchaseDate", label: "ရက်စွဲ", visible: true },
  { id: "productType", label: "ပစ္စည်းအမျိုးအစား", visible: true },
  { id: "productName", label: "ပစ္စည်းအမည်", visible: true },
  { id: "totalAmount", label: "တန်ဖိုး", visible: true },
  { id: "orderType", label: "အော်ဒါ/အရောင်း", visible: true },
  { id: "actions", label: "အသေးစိတ်", visible: true },
];

const formatCurrency = (amount: number | null) =>
  amount === null ? "-" : amount.toLocaleString();

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-500 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function InvoiceHistoryTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page") || "1");
  const initialPage =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;

  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialPage,
    limit: 10,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOrder, setIsOrder] = useState<boolean | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(COLUMNS.map((col) => [col.id, col.visible])),
  );

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev) => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  const setPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const resetToPage1 = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    router.replace("?page=1", { scroll: false });
  }, [router]);

  // Debounce search input — skip initial mount to avoid double-fetch
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      resetToPage1();
    }, 400);
    return () => clearTimeout(timer);
  }, [search, resetToPage1]);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getInvoices({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch || undefined,
        isOrder,
      });
      setInvoices(result.invoices);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, isOrder]);

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
  }, [fetchInvoices]);

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
          <TableCell colSpan={10}>
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
        {columnVisibility.invoiceId && (
          <TableCell>
            <Highlight text={invoice.invoiceId} query={debouncedSearch} />
          </TableCell>
        )}
        {columnVisibility.customerName && (
          <TableCell className="border">
            <Highlight text={invoice.customer_Name} query={debouncedSearch} />
          </TableCell>
        )}
        {columnVisibility.mobile && (
          <TableCell className="border">
            <Highlight
              text={invoice.mobile_Number ?? ""}
              query={debouncedSearch}
            />
          </TableCell>
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
        {columnVisibility.orderType && (
          <TableCell className="min-w-[62px] border">
            <Badge variant={invoice.isOrder ? "default" : "secondary"}>
              {invoice.isOrder ? "အော်ဒါ" : "အရောင်း"}
            </Badge>
          </TableCell>
        )}
        {columnVisibility.actions && (
          <TableCell>
            <Link href={`/office/staff/invoice/${invoice.invoiceId}`}>
              <AppIcon name="squareArrow" className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Link>
          </TableCell>
        )}
      </TableRow>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: Search + Filter + Refresh + View — all in one row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <AppIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          />
          <Input
            placeholder="ဘောက်ချာနံပါတ်၊ ဝယ်သူအမည်၊ ဖုန်းနံပါတ်"
            className="pl-10 w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative shrink-0">
              <AppIcon name="filter" className="h-4 w-4" />
              {isOrder !== undefined && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  1
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52" align="end">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Filter</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="history-order-true"
                    checked={isOrder === true}
                    onCheckedChange={(checked) => {
                      setIsOrder(checked ? true : undefined);
                      resetToPage1();
                    }}
                  />
                  <Label
                    htmlFor="history-order-true"
                    className={`text-sm ${isOrder === true ? "font-medium text-primary" : ""}`}>
                    အော်ဒါပစ္စည်းများ
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="history-order-false"
                    checked={isOrder === false}
                    onCheckedChange={(checked) => {
                      setIsOrder(checked ? false : undefined);
                      resetToPage1();
                    }}
                  />
                  <Label
                    htmlFor="history-order-false"
                    className={`text-sm ${isOrder === false ? "font-medium text-primary" : ""}`}>
                    အရောင်းပစ္စည်းများ
                  </Label>
                </div>
              </div>
              {isOrder !== undefined && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsOrder(undefined);
                    resetToPage1();
                  }}>
                  <AppIcon name="reset" className="h-4 w-4 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={fetchInvoices}
          disabled={loading}>
          <AppIcon name="reset" className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <AppIcon name="view" className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">ကော်လံများရွေးချယ်ရန်</h4>
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
