"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { AppIcon } from "@/components/app-icons";
import {
  createInvoice,
  getProductTypes,
  getSellers,
  type InvoiceDataInput,
} from "./action";
import {
  ORDER_STATUS,
  type OrderStatusValue,
} from "@/lib/constants/order-status";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";

interface ProductType {
  id: number;
  name: string;
}

/** Form state shape (aligned with InvoiceDataInput + ProductDetails)
 *  Lastest updated at 2026-03-05
 */
interface ProductDetailsForm {
  productTypeId: number;
  productType: string;
  productName: string;
  purity_16?: number | null;
  purity_15?: number | null;
  purity_14?: number | null;
  purity_14_2?: number | null;
  weight: {
    row1: number[];
    row2: number[];
    row3: number[];
    row4: number[];
    row5: number[];
    row6: number[];
  };
  handWidth: string;
  length: string;
}

interface InvoiceFormData {
  customer_Name: string;
  mobile_Number: string;
  address: string;
  purchase_date: Date;
  product_Details: ProductDetailsForm;
  total_Amount: number | null;
  reject_Amount: number | null;
  remaining_Amount: number | null;
  appointment_Date: Date | null;
  seller: string;
  isOrder: boolean;
  orderStatus: OrderStatusValue;
}

interface Seller {
  id: string;
  name: string;
}

const INITIAL_PRODUCT_DETAILS: ProductDetailsForm = {
  productTypeId: undefined as unknown as number,
  productType: "",
  productName: "",
  purity_16: null,
  purity_15: null,
  purity_14: null,
  purity_14_2: null,
  weight: {
    row1: [0, 0, 0, 0],
    row2: [0, 0, 0, 0],
    row3: [0, 0, 0, 0],
    row4: [0, 0, 0, 0],
    row5: [0, 0, 0, 0],
    row6: [0, 0, 0, 0],
  },
  handWidth: "",
  length: "",
};

const getInitialFormData = (): InvoiceFormData => ({
  customer_Name: "",
  mobile_Number: "",
  address: "",
  purchase_date: new Date(),
  product_Details: { ...INITIAL_PRODUCT_DETAILS },
  total_Amount: null,
  reject_Amount: null,
  remaining_Amount: null,
  appointment_Date: null,
  seller: "",
  isOrder: false,
  orderStatus: ORDER_STATUS.NOT_ORDER,
});

export function NewInvoiceForm() {
  const router = useRouter();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  const [formData, setFormData] = useState<InvoiceFormData>(getInitialFormData);

  const fetchSellers = async () => {
    const { success, staff } = await getSellers();
    if (success && staff) {
      setSellers(
        staff.map((item) => ({ id: item.id.toString(), name: item.name })),
      );
    }
  };
  const fetchProductTypes = async () => {
    const { success, productTypes } = await getProductTypes();
    if (success && productTypes) {
      setProductTypes(productTypes);
    }
  };

  useEffect(() => {
    fetchSellers();
    fetchProductTypes();
  }, []);

  useEffect(() => {
    if (!formData.isOrder) return;
    const total = formData.total_Amount;
    const reject = formData.reject_Amount;
    if (typeof total === "number" && typeof reject === "number") {
      const remaining = total - reject;
      setFormData((prev) => ({
        ...prev,
        remaining_Amount: Number(remaining.toFixed(2)),
      }));
    } else {
      setFormData((prev) => ({ ...prev, remaining_Amount: null }));
    }
  }, [formData.isOrder, formData.total_Amount, formData.reject_Amount]);

  const updateFormData = <K extends keyof InvoiceFormData>(
    field: K,
    value: InvoiceFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateProductDetails = <K extends keyof ProductDetailsForm>(
    field: K,
    value: ProductDetailsForm[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      product_Details: {
        ...prev.product_Details,
        [field]: value,
      },
    }));
  };

  const updateWeightRow = (
    rowName: keyof ProductDetailsForm["weight"],
    index: number,
    value: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      product_Details: {
        ...prev.product_Details,
        weight: {
          ...prev.product_Details.weight,
          [rowName]: prev.product_Details.weight[rowName].map((val, i) =>
            i === index ? value : val,
          ),
        },
      },
    }));
  };

  const buildInvoicePayload = (): InvoiceDataInput => {
    const total =
      typeof formData.total_Amount === "number" ? formData.total_Amount : 0;
    return {
      customer_Name: formData.customer_Name,
      mobile_Number: formData.mobile_Number || null,
      address: formData.address || null,
      purchase_date: formData.purchase_date,
      product_Details: formData.product_Details,
      total_Amount: total,
      reject_Amount: formData.isOrder ? (formData.reject_Amount ?? null) : null,
      remaining_Amount: formData.isOrder
        ? (formData.remaining_Amount ?? null)
        : null,
      appointment_Date: formData.appointment_Date ?? null,
      seller: formData.seller,
      isOrder: formData.isOrder,
      orderStatus: formData.orderStatus,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      typeof formData.total_Amount !== "number" ||
      formData.total_Amount < 0
    ) {
      toast.error("စုစုပေါင်းတန်ဖိုးထည့်ရန်");
      return;
    }

    const payload = buildInvoicePayload();
    const promise = createInvoice(payload).then((result) => {
      if (result.success) {
        setFormData(getInitialFormData());
        return result;
      }
      throw new Error(result.error || "Failed to create invoice");
    });

    toast.promise(promise, {
      loading: "Saving invoice ...",
      success: `${(await promise).invoice?.customer_Name} ဘောက်ချာသိမ်းပြီး `,
      error: (err) => `Error: ${err.message || "Failed to save data!"}`,
      action: {
        label: "ကြည့်ရန်",
        onClick: async () => {
          router.push(
            `/office/staff/invoice/${(await promise).invoice?.invoiceId}`,
          );
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mx-auto max-w-4xl">
      <Card className="bg-muted border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ဘောက်ချာအသစ်လုပ်ရန်
          </CardTitle>
        </CardHeader>
      </Card>
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppIcon name="customer" className="h-5 w-5" />
            ဝယ်သူအကြောင်းအရာ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                id="customer_name"
                value={formData.customer_Name}
                onChange={(e) =>
                  updateFormData("customer_Name", e.target.value)
                }
                onClick={(e) => (e.target as HTMLInputElement).select()}
                placeholder="အမည်"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                id="mobile_number"
                value={formData.mobile_Number}
                onChange={(e) =>
                  updateFormData("mobile_Number", e.target.value)
                }
                onClick={(e) => (e.target as HTMLInputElement).select()}
                placeholder="ဖုန်းနံပါတ်"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Textarea
              className="bg-white"
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData("address", e.target.value)}
              placeholder="လိပ်စာ"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchase_date">ရက်စွဲ</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  type="button" // Prevent form submission
                >
                  <AppIcon name="calendar" className="mr-2 h-4 w-4" />
                  {formData.purchase_date ? (
                    formData.purchase_date.toLocaleDateString()
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.purchase_date}
                  onSelect={(date) =>
                    date && updateFormData("purchase_date", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Product Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppIcon name="product" className="h-5 w-5" />
            ပစ္စည်းအသေးစိတ်
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 flex justify-center items-center">
            <Label htmlFor="product_name" className="w-1/3 md:w-1/5">
              ပစ္စည်းအမည်
            </Label>
            <Input
              onClick={(e) => (e.target as HTMLInputElement).select()}
              type="text"
              id="product_name"
              value={formData.product_Details.productName}
              onChange={(e) =>
                updateProductDetails("productName", e.target.value)
              }
              required
            />
          </div>

          <div className="space-y-2 flex  items-center">
            <Label htmlFor="product_type_select" className="w-1/3 md:w-1/5">
              အမျိုးအစား
            </Label>
            <Select
              value={
                formData.product_Details.productTypeId
                  ? formData.product_Details.productTypeId.toString()
                  : ""
              }
              onValueChange={(value) => {
                const selectedType = productTypes.find(
                  (t) => t.id.toString() === value,
                );
                if (selectedType) {
                  setFormData((prev) => ({
                    ...prev,
                    product_Details: {
                      ...prev.product_Details,
                      productTypeId: selectedType.id,
                      productType: selectedType.name,
                    },
                  }));
                }
              }}
              required>
              <SelectTrigger id="product_type_select">
                <SelectValue placeholder="ပစ္စည်းအမျိုးအစားရွေးရန်" />
              </SelectTrigger>

              <SelectContent>
                {productTypes.length === 0 ? (
                  <SelectItem
                    value="no-types"
                    disabled
                    className="text-red-600">
                    ပစ္စည်းအမျိုးအစားမရှိသေးပါ။
                  </SelectItem>
                ) : (
                  productTypes.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <CardTitle className="flex items-center gap-2">ရွှေစျေး</CardTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Input
                onClick={(e) => (e.target as HTMLInputElement).select()}
                type="number"
                id="purity_16"
                value={formData.product_Details.purity_16 ?? ""}
                onChange={(e) =>
                  updateProductDetails(
                    "purity_16",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="၁၆ ပဲရည်"
              />
            </div>
            <div className="space-y-2">
              <Input
                onClick={(e) => (e.target as HTMLInputElement).select()}
                type="number"
                id="purity_15"
                value={formData.product_Details.purity_15 ?? ""}
                onChange={(e) =>
                  updateProductDetails(
                    "purity_15",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="၁၅ ပဲရည်"
              />
            </div>
            <div className="space-y-2">
              <Input
                onClick={(e) => (e.target as HTMLInputElement).select()}
                type="number"
                id="purity_14"
                value={formData.product_Details.purity_14 ?? ""}
                onChange={(e) =>
                  updateProductDetails(
                    "purity_14",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="၁၄ ပဲရည်"
              />
            </div>
            <div className="space-y-2">
              <Input
                onClick={(e) => (e.target as HTMLInputElement).select()}
                type="number"
                id="purity_14_2"
                value={formData.product_Details.purity_14_2 ?? ""}
                onChange={(e) =>
                  updateProductDetails(
                    "purity_14_2",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
                placeholder="၁၄ ပဲ ၂ ပြား"
              />
            </div>
          </div>

          {/* Weight Matrix */}
          <div className="space-y-4">
            <CardTitle className="flex items-center gap-2">အလေးချိန်</CardTitle>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-border p-2 bg-muted"></th>
                    <th className="border border-border p-2 bg-muted">ကျပ်</th>
                    <th className="border border-border p-2 bg-muted">ပဲ</th>
                    <th className="border border-border p-2 bg-muted">ရွှေး</th>
                    <th className="border border-border p-2 bg-muted">ခြမ်း</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formData.product_Details.weight).map(
                    ([rowName, values]) => (
                      <tr key={rowName}>
                        <td className="border border-border p-2 text-xs">
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
                        </td>
                        {values.map((value, index) => (
                          <td key={index} className="border border-border p-1">
                            <Input
                              onClick={(e) =>
                                (e.target as HTMLInputElement).select()
                              }
                              type="number"
                              value={value}
                              onChange={(e) =>
                                updateWeightRow(
                                  rowName as keyof ProductDetailsForm["weight"],
                                  index,
                                  Number.parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-full"
                              step="any" // Allow decimal input
                            />
                          </td>
                        ))}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2 flex justify-center items-center">
            <Label htmlFor="total_amount" className="w-1/2 md:w-1/6">
              စုစုပေါင်းတန်ဖိုး
            </Label>
            <Input
              onClick={(e) => (e.target as HTMLInputElement).select()}
              id="total_amount"
              type="number"
              value={formData.total_Amount ?? ""}
              onChange={(e) =>
                updateFormData(
                  "total_Amount",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              required
            />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                className="bg-white w-5 h-5"
                id="is_order"
                checked={formData.isOrder}
                onCheckedChange={(checked: boolean) => {
                  setFormData((prev) => ({
                    ...prev,
                    isOrder: checked,
                    orderStatus: checked
                      ? ORDER_STATUS.ORDER_PENDING
                      : ORDER_STATUS.NOT_ORDER,
                    reject_Amount: checked ? prev.reject_Amount : null,
                    remaining_Amount: checked ? prev.remaining_Amount : null,
                  }));
                }}
              />
              <Label htmlFor="is_order">အော်ဒါပစ္စည်း</Label>
            </div>
            {formData.isOrder && (
              <div className="flex flex-col space-y-4">
                {/* Measurements */}
                <div className="space-y-2 flex justify-center items-center">
                  <Label htmlFor="hand_width_input" className="w-1/2 md:w-1/6">
                    လက်တိုင်း
                  </Label>
                  <Input
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    id="hand_width_input"
                    type="text"
                    value={formData.product_Details.handWidth}
                    onChange={(e) =>
                      updateProductDetails("handWidth", e.target.value)
                    }
                    placeholder="လက်တိုင်း"
                  />
                </div>

                <div className="space-y-2 flex justify-center items-center">
                  <Label htmlFor="length_input" className="w-1/2 md:w-1/6">
                    ကြိုးအရှည်
                  </Label>
                  <Input
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    id="length_input"
                    type="text"
                    value={formData.product_Details.length}
                    onChange={(e) =>
                      updateProductDetails("length", e.target.value)
                    }
                    placeholder="ကြိုးအရှည်"
                  />
                </div>

                {/* Payment Details */}
                <div className="space-y-2 flex justify-center items-center">
                  <Label htmlFor="reject_amount" className="w-1/2 md:w-1/6">
                    စရံငွေ
                  </Label>
                  <Input
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                    id="reject_amount"
                    type="number"
                    value={formData.reject_Amount ?? ""}
                    onChange={(e) =>
                      updateFormData(
                        "reject_Amount",
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                    placeholder="စရံငွေ"
                  />
                </div>

                <div className="space-y-2 flex justify-center items-center">
                  <Label htmlFor="remaining_amount" className="w-1/2 md:w-1/6">
                    ကျန်ငွေ
                  </Label>
                  <Input
                    id="remaining_amount"
                    type="number"
                    value={formData.remaining_Amount ?? ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* Appointment Date */}
                <div className="space-y-2 ">
                  <Label htmlFor="appointment_date_input">ရက်ချိန်း</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start"
                        type="button">
                        <AppIcon
                          name="calendar"
                          className={`mr-2 h-4 w-4 ${!formData.appointment_Date ? "text-red-500" : ""}`}
                        />
                        {formData.appointment_Date ? (
                          formData.appointment_Date.toLocaleDateString()
                        ) : (
                          <span className="text-red-500">
                            ရက်ချိန်းရွှေးရန်
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.appointment_Date ?? undefined}
                        onSelect={(date) =>
                          updateFormData("appointment_Date", date || null)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4 px-2">
        <div className="space-y-2">
          <Select
            value={formData.seller} // Controlled component
            onValueChange={(value) => updateFormData("seller", value)}
            required>
            <SelectTrigger id="seller_select">
              <SelectValue placeholder="အရောင်းဝန်ထမ်းရွေးရန်" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.name}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="flex items-center gap-2"
          disabled={!formData.seller}>
          ဘောက်ချာထုတ်ရန်
        </Button>
      </div>
    </form>
  );
}
