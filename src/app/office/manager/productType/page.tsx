"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addProductType, getProductTypes } from "./action";
import { toast } from "sonner";
import { ProductType } from "@prisma/client";
import { useEffect, useState } from "react";
import { InvoiceHistorySkeleton } from "../../staff/order/components/invoice-history-skeleton";

export default function NewProductType() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const fetchProductTypes = async () => {
    const productTypes = await getProductTypes();
    setProductTypes(productTypes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    try {
      const { status, message } = await addProductType(formData);
      if (!status) {
        return toast.error(message);
      }
      toast.success(message);
      fetchProductTypes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product type");
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return (
    <div className="px-1">
      <Card variant={"noborder"}>
        <CardHeader>
          <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
        </CardHeader>
        <div className="pl-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-fit">
                အသစ်ထည့်ရန်
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle></DialogTitle>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="ပစ္စည်းအမျိုးအစားအမည်"
                    name="productName"
                    required
                  />
                </div>
                <DialogFooter className="flex justify-end gap-2">
                  <Button type="submit">အသစ်လုပ်ရန်</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto max-h-[calc(100vh-270px)]">
              <Table>
                <TableHeader >
                  <TableRow>
                    <TableHead>စဥ်</TableHead>
                    <TableHead>ပစ္စည်းအမျိုးအစား</TableHead>
                    <TableHead>ရက်စွဲ</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productTypes.length === 0 ? (

                    <TableRow>
                      <TableCell colSpan={10}>
                        <InvoiceHistorySkeleton />
                      </TableCell>

                    </TableRow>
                  ) : (
                    productTypes.map((productType) => (
                      <TableRow key={productType.id}>
                        <TableCell>{productType.id}</TableCell>
                        <TableCell>{productType.name}</TableCell>
                        <TableCell>
                          {productType.createdAt.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className={
                              productType.isAvailable
                                ? "text-green-500 border-green-500 hover:bg-green-100 cursor-pointer"
                                : "text-yellow-500 border-yellow-500 hover:bg-yellow-100 cursor-pointer"
                            }>
                            {productType.isAvailable ? "Disable" : "Enable"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
