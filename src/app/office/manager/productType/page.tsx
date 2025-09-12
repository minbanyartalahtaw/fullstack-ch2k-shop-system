"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { addProductType, getProductTypes } from "./action"
import { toast } from "sonner"
import { ProductType } from "@prisma/client"
import { useEffect, useState } from "react"

export default function NewProductType() {
    const [productTypes, setProductTypes] = useState<ProductType[]>([])

    const fetchProductTypes = async () => {
        const productTypes = await getProductTypes()
        setProductTypes(productTypes)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        try {
            const { message } = await addProductType(formData)
            toast.success(message)
            fetchProductTypes()
        } catch (error) {
            toast.error("Failed to add product type")
        }
    }

    useEffect(() => {
        fetchProductTypes()
    }, [])

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            ပစ္စည်းအမျိုးအစားထည့်ရန်
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogTitle>Add New Product Type</DialogTitle>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Input placeholder="Enter product type name" name="productName" />
                            </div>
                            <DialogFooter className="flex justify-end gap-2">
                                <Button type="submit" >Add</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Types</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>စဥ်</TableHead>
                                <TableHead>ပစ္စည်းအမျိုးအစား</TableHead>
                                <TableHead>createdAt</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productTypes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground py-6">No product types found</TableCell>
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
                                                className={productType.isAvailable ? "text-green-500 border-green-500 hover:bg-green-100 cursor-pointer" : "text-yellow-500 border-yellow-500 hover:bg-yellow-100 cursor-pointer"}
                                            >
                                                {productType.isAvailable ? "Disable" : "Enable"}
                                            </Button>

                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}