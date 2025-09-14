"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Staff } from "../action";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

export default function StaffEditForm({ staffData }: { staffData: Staff[] }) {

  const columns: ColumnConfig[] = [
    { id: "name", label: "အမည်", visible: true },
    // { id: "email", label: "Email", visible: true },
    { id: "phone", label: "ဖုန်းနံပါတ်", visible: true },
    // { id: "address", label: "Address", visible: true },

    { id: "role", label: "ရာထူး", visible: true },
    // { id: "createdAt", label: "Created At", visible: true },

    { id: "isFire", label: "Is Fire", visible: true },
    { id: "Action", label: "", visible: true },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="rounded-md border overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>စဥ်</TableHead>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody >
            {staffData.map((data) => (
              <TableRow key={data.id}>
                <TableCell >{data.id}</TableCell>
                <TableCell >{data.name}</TableCell>

                <TableCell >{data.phone}</TableCell>

                <TableCell ><Badge variant={data.role === "STAFF" ? "staff" : "manager"}>{data.role}</Badge></TableCell>

                <TableCell ><Badge variant={data.isFire ? "isStaffIsNotWorking" : "isStaffIsWorking"}>{data.isFire ? "Yes" : "No"}</Badge></TableCell>
                <TableCell >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <AppIcon name="edit" className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogTitle className="text-lg font-medium mb-4">Staff Details</DialogTitle>
                      <div className="grid gap-4">
                        {[
                          { label: "အမည်", value: data.name },
                          { label: "Email", value: data.email || "-" },
                          { label: "ဖုန်းနံပါတ်", value: data.phone },
                          { label: "လိပ်စာ", value: data.address },
                          { label: "ရာထူး", value: <Badge variant={data.role === "STAFF" ? "staff" : "manager"}>{data.role}</Badge> },
                          { label: "အလုပ်", value: <Badge variant={data.isFire ? "isStaffIsNotWorking" : "isStaffIsWorking"}>{data.isFire ? "Yes" : "No"}</Badge> },
                          { label: "since", value: data.createdAt.toLocaleString() },
                          { label: "Last Update", value: data.updatedAt.toLocaleString() },
                        ].map(({ label, value }) => (
                          <div key={label} className="grid grid-cols-3 items-center">
                            <Label className="font-medium">{label}</Label>
                            <div className="col-span-2 text-sm text-gray-600">{value}</div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}