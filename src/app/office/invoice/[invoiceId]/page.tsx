"use server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { getInvoice, InvoiceWithDetails } from "./action";

interface Props {
  params: Promise<{
    invoiceId: string;
  }>;
}

export default async function InvoicePage({ params }: Props) {
  const { invoiceId } = await params;
  const invoice: InvoiceWithDetails | null = await getInvoice(invoiceId);
  if (!invoice) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-gray-500">
        No invoice found
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 space-y-2 pb-5">
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ဘောက်ချာနံပါတ် : {invoice.invoiceId}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="px-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Customer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableBody>

              <TableRow>
                <TableCell className="font-medium">အမည်</TableCell>
                <TableCell>{invoice.customer_Name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ဖုန်းနံပါတ်</TableCell>
                <TableCell>{invoice.mobile_Number}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">လိပ်စာ</TableCell>
                <TableCell>{invoice.address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ရက်စွဲ</TableCell>
                <TableCell>
                  {invoice.purchase_date?.toLocaleDateString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ပစ္စည်းအသေးစိတ်
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Table className="mt-0">
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ပစ္စည်းအမည်</TableCell>
                <TableCell>{invoice.productDetails.product_Name}</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ပစ္စည်းအမျိုးအစား</TableCell>
                <TableCell>{invoice.productDetails.product_Type}</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">စုစုပေါင်းတန်ဖိုး</TableCell>
                <TableCell>{invoice.total_Amount}</TableCell>
                <TableCell className="font-medium">ကျပ်</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">လက်တိုင်း</TableCell>
                <TableCell>{invoice.productDetails.handWidth || "-"}</TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ကြိုးအရှည်</TableCell>
                <TableCell>{invoice.productDetails.length || "-"}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <CardTitle className="flex items-center gap-2">ရွှေစျေး</CardTitle>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">၁၆ ပဲရည်</TableCell>
                <TableCell>{invoice.productDetails.purity_16 || "-"}</TableCell>
                <TableCell>ကျပ်</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">၁၅ ပဲရည်</TableCell>
                <TableCell>{invoice.productDetails.purity_15 || "-"}</TableCell>
                <TableCell>ကျပ်</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">၁၄ ပဲရည်</TableCell>
                <TableCell>{invoice.productDetails.purity_14 || "-"}</TableCell>
                <TableCell>ကျပ်</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">၁၄ ပဲ ၂ ပြား</TableCell>
                <TableCell>
                  {invoice.productDetails.purity_14_2 || "-"}
                </TableCell>
                <TableCell>ကျပ်</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Weight Matrix */}
          <div className="space-y-4">
            <CardTitle className="flex items-center gap-2">အလေးချိန်</CardTitle>
            <Table>
              <thead>
                <tr>
                  <TableCell className="bg-muted"></TableCell>
                  <TableCell className="bg-muted">ကျပ်</TableCell>
                  <TableCell className="bg-muted">ပဲ</TableCell>
                  <TableCell className="bg-muted">ရွှေး</TableCell>
                  <TableCell className="bg-muted">ခြမ်း</TableCell>
                </tr>
              </thead>
              <TableBody>
                {Object.entries(
                  invoice.productDetails.weight as Record<string, number[]>
                ).map(([rowName, values]) => (
                  <TableRow key={rowName}>
                    <TableCell className="text-xs border">
                      {rowName === "row1"
                        ? "ပေးရွှေချိန်"
                        : rowName === "row2"
                          ? "စိုက်ရွှေချိန်"
                          : rowName === "row3"
                            ? "ရွှေချိန်"
                            : rowName === "row4"
                              ? "ကျောက်ချိန်"
                              : rowName === "row5"
                                ? "အလျော့တွက်"
                                : rowName === "row6"
                                  ? "လက်ခ"
                                  : rowName}
                    </TableCell>
                    {values.map((value, index) => (
                      <TableCell key={index} className="border">
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {invoice.productDetails.isOrder && (
            <Card className="space-y-4 bg-muted p-4">
              <div className="flex items-center">
                <Label>အော်ဒါပစ္စည်း</Label>
              </div>
              <Table>
                <TableBody>
                  <TableRow className="hover:bg-white">
                    <TableCell className="font-medium">စရံငွေ</TableCell>
                    <TableCell>{invoice.reject_Amount}</TableCell>
                    <TableCell>ကျပ်</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-white">
                    <TableCell className="font-medium">ကျန်ငွေ</TableCell>
                    <TableCell>{invoice.remaining_Amount}</TableCell>
                    <TableCell>ကျပ်</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-white">
                    <TableCell className="font-medium">ရက်ချိန်း</TableCell>
                    <TableCell>
                      {invoice.appointment_Date?.toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={
                        invoice.productDetails.isOrderTaken
                          ? "text-green-500"
                          : "text-red-500"
                      }>
                      {invoice.productDetails.isOrderTaken
                        ? "အော်ဒါပေးပြီး"
                        : "အော်ဒါမပေးရသေးပါ"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
