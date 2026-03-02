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
import { addProductType, getProductTypes, toggleProductType } from "./action";
import { toast } from "sonner";
import { ProductType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { InvoiceHistorySkeleton } from "../../staff/order/components/invoice-history-skeleton";

export default function NewProductType() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      setIsDialogOpen(false);
      fetchProductTypes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add product type");
    }
  };

  const handleToggle = async (id: number) => {
    setTogglingIds((prev) => new Set(prev).add(id));
    try {
      const { status, message } = await toggleProductType(id);
      if (!status) return toast.error(message);
      toast.success(message);
      fetchProductTypes();
    } catch {
      toast.error("Failed to update product type");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  return (
    <div className=" pt-4 pb-20">
      <Card>
        <CardHeader>
          <CardTitle>ပစ္စည်းအမျိုးအစား</CardTitle>
        </CardHeader>
        <div className="pl-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-fit">
                အသစ်လုပ်ရန်
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
                <TableHeader>
                  <TableRow>
                    <TableHead>စဥ်</TableHead>
                    <TableHead>ပစ္စည်းအမျိုးအစား</TableHead>
                    <TableHead>ရက်စွဲ</TableHead>
                    <TableHead></TableHead>
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
                          <div className="flex items-center gap-2.5">
                            <Switch
                              checked={productType.isAvailable}
                              onCheckedChange={() =>
                                handleToggle(productType.id)
                              }
                              disabled={togglingIds.has(productType.id)}
                            />
                            <span
                              className={`text-xs font-medium ${
                                productType.isAvailable
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                              }`}>
                              {productType.isAvailable ? "Active" : "Inactive"}
                            </span>
                          </div>
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
