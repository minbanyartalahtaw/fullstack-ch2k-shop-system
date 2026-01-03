import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppIcon } from "@/components/app-icons";
import prisma from "@/lib/prisma";
import ChartContainer from "./components/ChartContainer";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getInvoiceStats() {
  const totalInvoices = await prisma.invoice.count();
  const totalAmount = await prisma.invoice.aggregate({
    _sum: {
      total_Amount: true,
    },
  });

  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      productDetails: true,
    },
  });

  // Get monthly invoice data for the line chart (last 6 months)
  const today = new Date();
  const sixMonthsAgo = new Date(today);
  sixMonthsAgo.setMonth(today.getMonth() - 5); // Get 6 months including current month

  // Create array of month names for the last 6 months
  const months = [];
  const monthData = [];

  for (let i = 0; i < 6; i++) {
    const date = new Date(sixMonthsAgo);
    date.setMonth(sixMonthsAgo.getMonth() + i);
    const monthName = date.toLocaleString("my-MM", { month: "long" });
    months.push(monthName);

    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    monthData.push({
      month: monthName,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });
  }

  // Query invoice counts for each month
  const invoiceCountsByMonth = await Promise.all(
    monthData.map(async ({ startDate, endDate }) => {
      return await prisma.invoice.count({
        where: {
          purchase_date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    })
  );

  const orderInvoiceCountsByMonth = await Promise.all(
    monthData.map(async ({ startDate, endDate }) => {
      return await prisma.invoice.count({
        where: {
          purchase_date: {
            gte: startDate,
            lte: endDate,
          },
          productDetails: {
            isOrder: true,
          },
        },
      });
    })
  );

  const sellInvoiceCountsByMonth = await Promise.all(
    monthData.map(async ({ startDate, endDate }) => {
      return await prisma.invoice.count({
        where: {
          purchase_date: {
            gte: startDate,
            lte: endDate,
          },
          productDetails: {
            isOrder: false,
          },
        },
      });
    })
  );

  // Create line chart data

  // Get order vs non-order invoice counts

  const invoiceTrendData = {
    labels: months,
    datasets: [
      {
        label: "စုစုပေါင်းဘောက်ချာ",
        data: invoiceCountsByMonth,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "အော်ဒါဘောက်ချာ",
        data: orderInvoiceCountsByMonth, // Create array with same value for each month
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "အရောင်းဘောက်ချာ",
        data: sellInvoiceCountsByMonth, // Create array with same value for each month
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return {
    totalInvoices,
    totalAmount: totalAmount._sum.total_Amount || 0,
    recentInvoices,
    invoiceTrendData,
  };
}

async function getProductStats() {
  const totalProducts = await prisma.productDetails.count();
  const orderedProducts = await prisma.productDetails.count({
    where: {
      isOrder: true,
    },
  });
  const takenProducts = await prisma.productDetails.count({
    where: {
      isOrderTaken: true,
    },
  });

  // Get product type distribution for chart
  const productTypes = await prisma.productDetails.groupBy({
    by: ["productType"],
    _count: {
      id: true,
    },
  });

  const productTypeData = {
    labels: productTypes.map((type) => type.productType || "Unspecified"),
    counts: productTypes.map((type) => type._count.id),
  };

  return {
    totalProducts,
    orderedProducts,
    takenProducts,
    productTypeData,
  };
}

async function DashboardContent() {
  const { totalInvoices, invoiceTrendData } = await getInvoiceStats();
  const { orderedProducts, takenProducts, productTypeData } =
    await getProductStats();

  return (
    <div className="space-y-6">
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
                    <span className=" font-bold">{totalInvoices}</span>
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
                    <span className=" font-bold">{orderedProducts}</span>
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
                    <span className=" font-bold">
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
                    <span className=" font-bold">{takenProducts}</span>
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
                    <span className=" font-bold">
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
                အသေးစိတ်ကြည့်ရန်
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Type Graph</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full max-w-md h-[300px]">
              {productTypeData.labels.length > 0 ? (
                <ChartContainer data={productTypeData} type="doughnut" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">
                    ပစ္စည်းအမျိုးအစား မရှိသေးပါ
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>လစဉ်ဘောက်ချာအရေအတွက်</CardTitle>
            <CardDescription>
              ပြီးခဲ့သော ၆ လအတွင်း ဘောက်ချာအရေအတွက်ပြဇယား
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[300px]">
              <ChartContainer data={invoiceTrendData} type="line" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex-1 space-y-4  ">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">စရင်းဇယား</h2>
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
            <p>Loading dashboard data...</p>
          </div>
        }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
