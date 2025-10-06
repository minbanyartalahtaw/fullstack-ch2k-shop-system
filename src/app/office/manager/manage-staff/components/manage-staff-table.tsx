"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createStaff, getStaff, Staff, StaffFormData } from "../action";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ManageStaffSkeleton } from "./manage-staff-skeleton";

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

export default function ManageStaffTable() {
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const columns: ColumnConfig[] = [
    { id: "id", label: "ID", visible: true },
    { id: "name", label: "အမည်", visible: true },
    { id: "phone", label: "ဖုန်းနံပါတ်", visible: true },
    { id: "role", label: "ရာထူး", visible: true },
    { id: "isFire", label: "Is Fire", visible: true },
    { id: "action", label: "", visible: true },
  ];

  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "STAFF",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateFormData = (field: keyof StaffFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createStaff(formData);

      if (result.success) {
        toast.success(`${result.staff?.name} အကောင့်ဖွင့်ပြီးပါပြီ`);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          role: "STAFF",
        });
        setIsDialogOpen(false);
        await fetchStaff();
      } else {
        toast.error(
          result.error || "ဝန်ထမ်းထည့်သွင်းရာတွင်အမှားတစ်ခုဖြစ်ပေါ်ခဲ့သည်"
        );
      }
    } catch (error) {
      console.error("Staff creation error:", error);
      toast.error("မမျှော်လင့်ထားသောအမှားတစ်ခုဖြစ်ပေါ်ခဲ့သည်");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const data = await getStaff();
      setStaffData(data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Failed to fetch staff data");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const renderTableHeader = () => {
    return (
      <TableRow>
        {columns
          .filter((col) => col.visible)
          .map((col) => (
            <TableHead key={col.id}>{col.label}</TableHead>
          ))}
      </TableRow>
    );
  };

  const renderTableBody = () => {
    return (
      <>
        {staffData.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.id}</TableCell>
            <TableCell>{data.name}</TableCell>
            <TableCell>{data.phone}</TableCell>
            <TableCell>
              <Badge variant={data.role === "STAFF" ? "staff" : "manager"}>
                {data.role}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  data.isFire ? "isStaffIsNotWorking" : "isStaffIsWorking"
                }>
                {data.isFire ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <AppIcon name="edit" className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogTitle className="text-lg font-medium mb-4">
                    Staff Details
                  </DialogTitle>
                  <div className="grid gap-4">
                    {[
                      { label: "အမည်", value: data.name },
                      { label: "Email", value: data.email || "-" },
                      { label: "ဖုန်းနံပါတ်", value: data.phone },
                      { label: "လိပ်စာ", value: data.address },
                      {
                        label: "ရာထူး",
                        value: (
                          <Badge
                            variant={
                              data.role === "STAFF" ? "staff" : "manager"
                            }>
                            {data.role}
                          </Badge>
                        ),
                      },
                      {
                        label: "အလုပ်",
                        value: (
                          <Badge
                            variant={
                              data.isFire
                                ? "isStaffIsNotWorking"
                                : "isStaffIsWorking"
                            }>
                            {data.isFire ? "Yes" : "No"}
                          </Badge>
                        ),
                      },
                      {
                        label: "since",
                        value: data.createdAt.toLocaleString(),
                      },
                      {
                        label: "Last Update",
                        value: data.updatedAt.toLocaleString(),
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="grid grid-cols-3 items-center">
                        <Label className="font-medium">{label}</Label>
                        <div className="col-span-2 text-sm text-gray-600">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild className="mb-5">
          <Button variant="outline" size="sm" className="w-fit">
            Add New Staff
          </Button>
        </DialogTrigger>
        <DialogTitle hidden></DialogTitle>
        <DialogContent className="w-full">
          <div className="flex items-center gap-2 mb-1">
            <AppIcon name="staffAdd" className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">ဝန်ထမ်းအသစ်လုပ်ရန်</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm">
                  ဝန်ထမ်းအမည်
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter staff name"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm">
                  ဖုန်းနံပါတ်
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-sm">
                  လိပ်စာ
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="Enter address"
                  className="mt-1.5 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  placeholder="Enter password"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-sm">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => updateFormData("role", value)}>
                  <SelectTrigger id="role" className="mt-1.5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STAFF">Staff</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Staff"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="rounded-md border overflow-hidden">
            <TableHeader>{renderTableHeader()}</TableHeader>

            <TableBody>
              {/*                     {staffData.map((data) => (
                        <TableRow key={data.id}>
                            <TableCell>{data.id}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>{data.phone}</TableCell>
                            <TableCell>
                                <Badge variant={data.role === "STAFF" ? "staff" : "manager"}>
                                    {data.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={data.isFire ? "isStaffIsNotWorking" : "isStaffIsWorking"}>
                                    {data.isFire ? "Yes" : "No"}
                                </Badge>
                            </TableCell>
                            <TableCell>
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
                    ))} */}
              {staffData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <ManageStaffSkeleton />
                  </TableCell>
                </TableRow>
              ) : (
                renderTableBody()
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
