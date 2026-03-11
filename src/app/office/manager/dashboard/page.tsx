import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AppIcon } from "@/components/app-icons";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import DoughnutChart from "./components/DoughnutChart";
import LineChart from "./components/LineChart";
import ProductTypeSalesChart from "./components/ProductTypeSalesChart";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/skeleton/dashboard-skeleton";

async function getInvoiceStats() {
  const totalInvoices = await prisma.invoice.count();

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

  return { totalInvoices, lineChartData };
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

async function DashboardContent() {
  const { totalInvoices, lineChartData } = await getInvoiceStats();
  const { orderedProducts, takenProducts, donutChartData } =
    await getProductStats();
  const { rows: salesRows, types: salesTypes } = await getProductTypeSales();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
            <CardDescription>
              ပစ္စည်းများ၏ အမျိုးအစားအလိုက် ခွဲခြမ်းမှု
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {donutChartData.length > 0 ? (
              <DoughnutChart data={donutChartData} />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  ပစ္စည်းအမျိုးအစား မရှိသေးပါ
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
            <CardDescription>
              ၆ လအတွင်းရောင်းရသောပစ္စည်းအမျိုးအစားများ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {salesRows.length > 0 && salesTypes.length > 0 ? (
              <ProductTypeSalesChart data={salesRows} types={salesTypes} />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <p className="text-sm text-muted-foreground">ဒေတာမရှိသေးပါ</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ဘောက်ချာအရေအတွက်</CardTitle>
          <CardDescription>၆ လအတွင်း ဘောက်ချာများ</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChart data={lineChartData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">ဘောက်ချာ</CardTitle>
            <AppIcon name="invoice" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    စုစုပေါင်းဘောက်ချာ
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold">{totalInvoices}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ခု
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    အော်ဒါဘောက်ချာ
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold">{orderedProducts}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ခု
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    အရောင်းဘောက်ချာ
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold">
                      {totalInvoices - orderedProducts}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ခု
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">
              အော်ဒါပစ္စည်းများ
            </CardTitle>
            <AppIcon name="order" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    အော်ဒါပစ္စည်း
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold">{orderedProducts}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ခု
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    ပစ္စည်းပေးပြီး
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold">{takenProducts}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ခု
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm text-muted-foreground">
                    ကျန်အော်ဒါ
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold">
                      {orderedProducts - takenProducts}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    ခု
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Link href="/office/staff/order">
              <Button variant="ghost" className="w-full">
                အသေးစိတ်ကြည့်ရန်
              </Button>
            </Link>
          </CardFooter>
        </Card>
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
