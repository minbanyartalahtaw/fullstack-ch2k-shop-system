"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { AppIcon } from "@/components/app-icons"
import { createInvoice } from "./action"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface ProductDetails {
    product_Type: string
    product_Name: string
    purity_16?: number
    purity_15?: number
    purity_14?: number
    purity_14_2?: number
    weight: {
        row1: number[]
        row2: number[]
        row3: number[]
        row4: number[]
        row5: number[]
        row6: number[]
    }
    handWidth: string
    length: string
    isOrder: boolean
    isOrderTaken: boolean
}

interface InvoiceData {
    id: number
    invoiceId: string
    customer_Name: string
    mobile_Number: string
    address: string
    purchase_date: Date
    product_Details: ProductDetails
    // <-- numeric amounts (undefined until user types) -->
    total_Amount?: number;
    reject_Amount?: number;
    remaining_Amount?: number;
    appointment_Date?: Date
    seller: string
}

export function NewInvoiceForm() {
    const [formData, setFormData] = useState<InvoiceData>({
        id: 0,
        invoiceId: `INV-${Date.now()}`,
        customer_Name: "",
        mobile_Number: "",
        address: "",
        purchase_date: new Date(Date.now()),
        product_Details: {
            product_Type: "",
            product_Name: "",
            purity_16: undefined,
            purity_15: undefined,
            purity_14: undefined,
            purity_14_2: undefined,
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
            isOrder: false,
            isOrderTaken: false,
        },
        total_Amount: undefined,
        reject_Amount: 0,
        remaining_Amount: undefined,
        appointment_Date: undefined,
        seller: "",
    })

    useEffect(() => {
        const total = formData.total_Amount;
        const reject = formData.reject_Amount;
        if (typeof total === "number" && typeof reject === "number") {
            // keep two decimals if you need them:
            // If reject_amount is 0, set remaining_amount to 0 since full payment was made
            if (formData.reject_Amount === 0) {
                setFormData((prev) => ({ ...prev, remaining_Amount: 0 }));
                return;
            }
            const remaining = total - reject;
            setFormData((prev) => ({ ...prev, remaining_Amount: Number(remaining.toFixed(2)) }));
        } else {
            setFormData((prev) => ({ ...prev, remaining_Amount: undefined }));
        }
        // only run when total or reject change
    }, [formData.total_Amount, formData.reject_Amount]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFormData = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProductDetails = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            product_Details: {
                ...prev.product_Details,
                [field]: value,
            },
        }))
    }

    const updateWeightRow = (rowName: string, index: number, value: number) => {
        setFormData((prev) => ({
            ...prev,
            product_Details: {
                ...prev.product_Details,
                weight: {
                    ...prev.product_Details.weight,
                    [rowName]: prev.product_Details.weight[rowName as keyof typeof prev.product_Details.weight].map((val, i) =>
                        i === index ? value : val,
                    ),
                },
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await createInvoice(formData)
    }



    return (
        <form onSubmit={handleSubmit} className="space-y-6 mx-auto max-w-4xl">
            {/* Customer Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AppIcon name="user" className="h-5 w-5" />
                        Customer Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Input
                                id="customer_name"
                                value={formData.customer_Name}
                                onChange={(e) => updateFormData("customer_Name", e.target.value)}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                placeholder="customer အမည်"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="mobile_number"
                                value={formData.mobile_Number}
                                onChange={(e) => updateFormData("mobile_Number", e.target.value)}
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                placeholder="Customer ဖုန်းနံပါတ်"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            className="bg-white"
                            id="address"
                            value={formData.address}
                            onChange={(e) => updateFormData("address", e.target.value)}
                            placeholder="Customer လိပ်စာ"
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="purchase_date">ရက်စွဲ</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}

                                >
                                    <AppIcon name="calendar" className="mr-2 h-4 w-4" />
                                    {formData.purchase_date ? new Date(formData.purchase_date).toLocaleDateString() : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    required
                                    mode="single"
                                    selected={formData.purchase_date ? new Date(formData.purchase_date) : undefined}
                                    onSelect={(date) => updateFormData("purchase_date", date)}

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
                    {/* ... other fields unchanged ... */}
                    <div className="space-y-2 flex justify-center items-center">
                        <Label htmlFor="product_name" className="w-1/3 md:w-1/6">ပစ္စည်းအမည်</Label>
                        <Input
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            type="text"
                            id="product_name"
                            value={formData.product_Details.product_Name ?? ""}
                            onChange={(e) => updateProductDetails("product_Name", e.target.value === "" ? undefined : e.target.value)}

                            required
                        />
                    </div>

                    <div className="space-y-2 flex  items-center">
                        <Label htmlFor="product_name" className="w-1/3 md:w-1/7">ပစ္စည်းအမျိုးအစား</Label>

                        <Select onValueChange={(value) => updateFormData("seller", value)} required>
                            <SelectTrigger>
                                <SelectValue placeholder="ပစ္စည်းအမျိုးအစားရွေးရန်" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="item1">item1</SelectItem>
                                <SelectItem value="item2">item2</SelectItem>
                                <SelectItem value="item3">item3</SelectItem>
                                <SelectItem value="item4">item4</SelectItem>
                                <SelectItem value="item5">item5</SelectItem>
                                <SelectItem value="item6">item6</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <CardTitle className="flex items-center gap-2">
                        ရွှေစျေး
                    </CardTitle>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <div className="space-y-2">

                            <Input
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                type="number"
                                id="purity_16"
                                value={formData.product_Details.purity_16 ?? ""}
                                onChange={(e) => updateProductDetails("purity_16", e.target.value === "" ? undefined : Number(e.target.value))}
                                placeholder="၁၆ ပဲရည်"
                            />
                        </div>
                        {/* purity_15, purity_14, purity_14_2 similar — convert to number or undefined */}
                        <div className="space-y-2">

                            <Input
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                type="number"
                                id="purity_15"
                                value={formData.product_Details.purity_15 ?? ""}
                                onChange={(e) => updateProductDetails("purity_15", e.target.value === "" ? undefined : Number(e.target.value))}
                                placeholder="၁၅ ပဲရည်"
                            />
                        </div>
                        <div className="space-y-2">

                            <Input
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                type="number"
                                id="purity_14"
                                value={formData.product_Details.purity_14 ?? ""}
                                onChange={(e) => updateProductDetails("purity_14", e.target.value === "" ? undefined : Number(e.target.value))}
                                placeholder="၁၄ ပဲရည်"
                            />
                        </div>
                        <div className="space-y-2">

                            <Input
                                onClick={(e) => (e.target as HTMLInputElement).select()}
                                type="number"
                                id="purity_14_2"
                                value={formData.product_Details.purity_14_2 ?? ""}
                                onChange={(e) => updateProductDetails("purity_14_2", e.target.value === "" ? undefined : Number(e.target.value))}
                                placeholder="၁၄ ပဲ ၂ ပြား"
                            />
                        </div>
                    </div>

                    {/* Weight Matrix (unchanged except value mapping) */}
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
                                    {Object.entries(formData.product_Details.weight).map(([rowName, values]) => (
                                        <tr key={rowName}>
                                            <td className="border border-border p-2 text-xs">
                                                {rowName === "row1" ? "ပေးရွှေချိန်" : rowName === "row2" ? "စိုက်ရွှေချိန်" : rowName === "row3" ? "ရွှေချိန်" : rowName === "row4" ? "ကျောက်ချိန်" : rowName === "row5" ? "အလျော့တွက်" : rowName === "row6" ? "လက်ခ" : rowName}
                                            </td>
                                            {values.map((value, index) => (
                                                <td key={index} className="border border-border p-1">
                                                    <Input
                                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                                        type="number"
                                                        value={value}
                                                        onChange={(e) => updateWeightRow(rowName, index, Number.parseFloat(e.target.value) || 0)}
                                                        className="w-full"
                                                        step="1"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ... dimensions unchanged ... */}

                    {/* total / reject / remaining — use numeric state, map undefined -> "" for inputs */}
                    <div className="space-y-2 flex justify-center items-center">
                        <Label htmlFor="total_amount" className="w-1/2 md:w-1/7">စုစုပေါင်းတန်ဖိုး</Label>
                        <Input
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            id="total_amount"
                            type="number"
                            value={formData.total_Amount ?? ""}
                            onChange={(e) => updateFormData("total_Amount", e.target.value === "" ? undefined : Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="space-y-2 flex justify-center items-center">
                        <Label htmlFor="total_amount" className="w-1/2 md:w-1/7">လက်တိုင်း</Label>
                        <Input
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            id="total_amount"
                            type="number"
                            value={formData.product_Details.handWidth ?? ""}
                            onChange={(e) => updateProductDetails("handWidth", e.target.value === "" ? undefined : Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="space-y-2 flex justify-center items-center">
                        <Label htmlFor="total_amount" className="w-1/2 md:w-1/7">ကြိုးအရှည်</Label>
                        <Input
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                            id="total_amount"
                            type="number"
                            value={formData.product_Details.length ?? ""}
                            onChange={(e) => updateProductDetails("length", e.target.value === "" ? undefined : Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                className="bg-white w-5 h-5"
                                id="is_order"
                                checked={formData.product_Details.isOrder}
                                onCheckedChange={(checked) => updateProductDetails("isOrder", checked)}
                            />
                            <Label htmlFor="is_order">အော်ဒါပစ္စည်း</Label>
                        </div>
                        {formData.product_Details.isOrder && (
                            <div className="flex flex-col md:flex-row items-start justify-between space-x-0 md:space-x-2 space-y-2 md:space-y-0 md:items-end">
                                <div className="flex-1 ">
                                    <Label htmlFor="reject_amount" className="text-xs">စရံငွေ</Label>
                                    <Input
                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                        id="reject_amount"
                                        type="number"
                                        value={formData.reject_Amount ?? ""}
                                        onChange={(e) => updateFormData("reject_Amount", e.target.value === "" ? undefined : Number(e.target.value))}


                                    />
                                </div>

                                <div className="flex-1 ">
                                    <Label htmlFor="total_amount" className="text-xs">ကျန်ငွေ</Label>
                                    <Input
                                        id="remaining_amount"
                                        type="number"
                                        value={formData.remaining_Amount ?? ""}
                                        readOnly
                                        className="bg-muted"

                                    />
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="total_amount" className="text-xs">ရက်ချိန်း</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className="w-full">
                                                <AppIcon name="calendar" className={`mr-2 h-4 w-4 ${!formData.appointment_Date ? 'text-red-500' : ''}`} />
                                                {formData.appointment_Date ? new Date(formData.appointment_Date).toLocaleDateString() : <span className={`${!formData.appointment_Date ? 'text-red-500' : ''}`}>ရက်ချိန်းရွှေးရန်</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 ">
                                            <Calendar
                                                mode="single"
                                                selected={formData.appointment_Date ? new Date(formData.appointment_Date) : undefined}
                                                onSelect={(date) => updateFormData("appointment_Date", date)}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>


            {/* Additional Information */}
            <Card>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="invoice_id">ဘောက်ချာနံပါတ်</Label>
                            <Input
                                id="invoice_id"
                                value={formData.invoiceId}
                                onChange={(e) => updateFormData("invoiceId", e.target.value)}
                                placeholder="Invoice ID"
                                readOnly
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="product_type">အရောင်းဝန်ထမ်း</Label>
                            <Select onValueChange={(value) => updateFormData("seller", value)} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="ရွေးရန်" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user1">user1</SelectItem>
                                    <SelectItem value="user2">user2</SelectItem>
                                    <SelectItem value="user3">user3</SelectItem>
                                    <SelectItem value="user4">user4</SelectItem>
                                    <SelectItem value="user5">user5</SelectItem>
                                    <SelectItem value="user6">user6</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">

                <Button type="submit" className="flex items-center gap-2">
                    ဘောက်ချာထုတ်ရန်
                </Button>
            </div>
        </form>
    )
}
