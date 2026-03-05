import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getSingleInvoice, type InvoiceWithDetails } from "./action";
import { BackButton } from "./BackButton";

const WEIGHT_LABELS: Record<string, string> = {
  row1: "ပေးရွှေချိန်",
  row2: "စိုက်ရွှေချိန်",
  row3: "ရွှေချိန်",
  row4: "ကျောက်ချိန်",
  row5: "အလျော့တွက်",
  row6: "လက်ခ",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  NOT_ORDER: "အရောင်း",
  ORDER_PENDING: "ပစ္စည်းမပေးရသေးပါ",
  ORDER_COMPLETED: "ပစ္စည်းပေးပြီး",
};

const fmt = (v: string | number | null | undefined) =>
  v == null || v === "" ? "-" : String(v);
const fmtDate = (d: Date | null | undefined) =>
  d ? new Date(d).toLocaleDateString() : "-";
const fmtCurrency = (n: number | null | undefined) =>
  n != null ? n.toLocaleString() : "-";

interface Props {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoicePage({ params }: Props) {
  const { invoiceId } = await params;
  const invoice: InvoiceWithDetails | null = await getSingleInvoice(invoiceId);

  if (!invoice) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        ဘောက်ချာမတွေ့ပါ
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-4 pb-8 pt-4">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>

      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{invoice.invoiceId}</CardTitle>
          <Badge variant={invoice.isOrder ? "default" : "secondary"}>
            {invoice.isOrder ? "အော်ဒါ" : "အရောင်း"}
          </Badge>
        </CardHeader>
      </Card>

      {/* Customer */}
      <Card>
        <CardHeader>
          <CardTitle>ဝယ်သူအကြောင်းအရာ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">အမည်</TableCell>
                <TableCell>{invoice.customer_Name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ဖုန်းနံပါတ်</TableCell>
                <TableCell>{fmt(invoice.mobile_Number)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">လိပ်စာ</TableCell>
                <TableCell>{fmt(invoice.address)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ရက်စွဲ</TableCell>
                <TableCell>{fmtDate(invoice.purchase_date)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">အရောင်းဝန်ထမ်း</TableCell>
                <TableCell>{invoice.seller}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Amounts */}
      <Card>
        <CardHeader>
          <CardTitle>ငွေကြေးအသေးစိတ်</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">
                  စုစုပေါင်းတန်ဖိုး
                </TableCell>
                <TableCell>{fmtCurrency(invoice.total_Amount)}</TableCell>
                <TableCell className="w-16">ကျပ်</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">စရံငွေ</TableCell>
                <TableCell>{fmtCurrency(invoice.reject_Amount)}</TableCell>
                <TableCell>ကျပ်</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ကျန်ငွေ</TableCell>
                <TableCell>{fmtCurrency(invoice.remaining_Amount)}</TableCell>
                <TableCell>ကျပ်</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle>ပစ္စည်းအသေးစိတ်</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">ပစ္စည်းအမည်</TableCell>
                <TableCell>{invoice.productDetails.productName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ပစ္စည်းအမျိုးအစား</TableCell>
                <TableCell>{invoice.productDetails.productType}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">လက်တိုင်း</TableCell>
                <TableCell>{fmt(invoice.productDetails.handWidth)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ကြိုးအရှည်</TableCell>
                <TableCell>{fmt(invoice.productDetails.length)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div>
            <CardTitle className="text-base mb-2">ရွှေစျေး</CardTitle>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-1/3">၁၆ ပဲရည်</TableCell>
                  <TableCell>{fmt(invoice.productDetails.purity_16)}</TableCell>
                  <TableCell className="w-16">ကျပ်</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">၁၅ ပဲရည်</TableCell>
                  <TableCell>{fmt(invoice.productDetails.purity_15)}</TableCell>
                  <TableCell>ကျပ်</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">၁၄ ပဲရည်</TableCell>
                  <TableCell>{fmt(invoice.productDetails.purity_14)}</TableCell>
                  <TableCell>ကျပ်</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">၁၄ ပဲ ၂ ပြား</TableCell>
                  <TableCell>
                    {fmt(invoice.productDetails.purity_14_2)}
                  </TableCell>
                  <TableCell>ကျပ်</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <CardTitle className="text-base mb-2">အလေးချိန်</CardTitle>
            <Table>
              <thead>
                <tr>
                  <TableCell className="bg-muted font-medium"></TableCell>
                  <TableCell className="bg-muted">ကျပ်</TableCell>
                  <TableCell className="bg-muted">ပဲ</TableCell>
                  <TableCell className="bg-muted">ရွှေး</TableCell>
                  <TableCell className="bg-muted">ခြမ်း</TableCell>
                </tr>
              </thead>
              <TableBody>
                {Object.entries(
                  (invoice.productDetails.weight || {}) as Record<
                    string,
                    number[]
                  >,
                ).map(([rowName, values]) => (
                  <TableRow key={rowName}>
                    <TableCell className="text-xs font-medium">
                      {WEIGHT_LABELS[rowName] ?? rowName}
                    </TableCell>
                    {values.map((v, i) => (
                      <TableCell key={i} className="border">
                        {v}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {invoice.isOrder && (
            <Card className="bg-muted/50 p-4">
              <CardTitle className="text-base mb-4">အော်ဒါအသေးစိတ်</CardTitle>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-1/3">
                      ရက်ချိန်း
                    </TableCell>
                    <TableCell>{fmtDate(invoice.appointment_Date)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">အခြေအနေ</TableCell>
                    <TableCell
                      className={
                        invoice.orderStatus === "ORDER_COMPLETED"
                          ? "text-green-600 font-medium"
                          : "text-amber-600"
                      }>
                      {ORDER_STATUS_LABELS[invoice.orderStatus] ??
                        invoice.orderStatus}
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
