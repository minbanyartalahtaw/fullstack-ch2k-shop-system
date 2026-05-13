import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import TotalProductSell from "./components/TotalProductSell";
import LineChart from "./components/LineChart";
import ProductTypeSalesChart from "./components/ProductTypeSalesChart";
import BestSellersCard from "./components/BestSellersCard";
import OrderTrackingCard from "./components/OrderTrackingCard";
import { DashboardSkeleton } from "@/components/skeleton/dashboard-skeleton";

async function getInvoiceStats() {


  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 5);

  const monthData: { month: string; startDate: Date; endDate: Date }[] = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(sixMonthsAgo.getMonth() + i);
    monthData.push({
      month: date.toLocaleString("my-MM", { month: "long" }),
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });
  }

  const [totalByMonth, orderByMonth, sellByMonth] = await Promise.all([
    Promise.all(
      monthData.map(({ startDate, endDate }) =>
        prisma.invoice.count({
          where: { purchase_date: { gte: startDate, lte: endDate } },
        }),
      ),
    ),
    Promise.all(
      monthData.map(({ startDate, endDate }) =>
        prisma.invoice.count({
          where: {
            purchase_date: { gte: startDate, lte: endDate },
            isOrder: true,
          },
        }),
      ),
    ),
    Promise.all(
      monthData.map(({ startDate, endDate }) =>
        prisma.invoice.count({
          where: {
            purchase_date: { gte: startDate, lte: endDate },
            isOrder: false,
          },
        }),
      ),
    ),
  ]);

  const lineChartData = monthData.map((m, i) => ({
    month: m.month,
    total: totalByMonth[i],
    order: orderByMonth[i],
    sell: sellByMonth[i],
  }));

  return { lineChartData };
}

async function getProductStats() {
  const orderedProducts = await prisma.invoice.count({
    where: { isOrder: true },
  });
  const takenProducts = await prisma.invoice.count({
    where: { orderStatus: OrderStatus.ORDER_COMPLETED },
  });

  const productTypes = await prisma.productDetails.groupBy({
    by: ["productType"],
    _count: { id: true },
  });

  const donutChartData = productTypes.map((type) => ({
    name: type.productType || "Unspecified",
    value: type._count.id,
  }));

  return { orderedProducts, takenProducts, donutChartData };
}

async function getProductTypeSales() {
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  const invoices = await prisma.invoice.findMany({
    where: { purchase_date: { gte: sixMonthsAgo } },
    select: {
      purchase_date: true,
      productDetails: { select: { productType: true } },
    },
  });

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - 5 + i, 1);
    return {
      label: d.toLocaleString("my-MM", { month: "long" }),
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });

  const allTypes = [
    ...new Set(
      invoices.map((inv) => inv.productDetails.productType || "Unspecified"),
    ),
  ];

  const rows = months.map(({ label, year, month }) => {
    const row: Record<string, string | number> = { month: label };
    for (const type of allTypes) {
      row[type] = invoices.filter(
        (inv) =>
          inv.purchase_date.getFullYear() === year &&
          inv.purchase_date.getMonth() === month &&
          (inv.productDetails.productType || "Unspecified") === type,
      ).length;
    }
    return row;
  });

  return { rows, types: allTypes };
}

async function getBestSellers() {
  const grouped = await prisma.invoice.groupBy({
    by: ["sellerId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });
  if (grouped.length === 0) return [];
  const staff = await prisma.staff.findMany({
    where: { id: { in: grouped.map((g) => g.sellerId) } },
    select: { id: true, name: true },
  });
  const byId = new Map(staff.map((s) => [s.id, s.name]));
  return grouped.map((g) => ({
    name: byId.get(g.sellerId) ?? "Unknown",
    invoiceCount: g._count.id,
  }));
}

async function DashboardContent() {
  const { lineChartData } = await getInvoiceStats();
  const { orderedProducts, takenProducts, donutChartData } =
    await getProductStats();
  const { rows: salesRows, types: salesTypes } = await getProductTypeSales();
  const bestSellers = await getBestSellers();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <TotalProductSell data={donutChartData} />
        <ProductTypeSalesChart data={salesRows} types={salesTypes} />
      </div>

      <LineChart data={lineChartData} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">


        <OrderTrackingCard
          orderedProducts={orderedProducts}
          takenProducts={takenProducts}
        />

        <BestSellersCard data={bestSellers} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4">
      {/*       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">စရင်းဇယား</h2>
      </div> */}

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
