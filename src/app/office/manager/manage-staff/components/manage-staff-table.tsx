"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createStaff,
  getStaff,
  Staff,
  StaffFormData,
  toggleFireStatus,
} from "../action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/app-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { TableSkeleton } from "@/components/skeleton/table-skeleton";
import { formatDate } from "@/lib/constants/date_format";

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
    { id: "action", label: "အသေးစိတ်", visible: true },
    { id: "fire", label: "", visible: true },
  ];

  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "STAFF",
  });

  const [isLoading, setIsLoading] = useState(true);
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
          result.error || "ဝန်ထမ်းထည့်သွင်းရာတွင်အမှားတစ်ခုဖြစ်ပေါ်ခဲ့သည်",
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
    } finally {
      setIsLoading(false);
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
    if (isLoading)
      return (
        <TableRow>
          <TableCell colSpan={columns.length}>
            <TableSkeleton />
          </TableCell>
        </TableRow>
      );

    if (!staffData.length)
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="py-8 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              ဝန်ထမ်းမရှိသေးပါ
            </p>
          </TableCell>
        </TableRow>
      );

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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <AppIcon name="edit" className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogTitle className="text-lg font-medium mb-4">
                    အသေးစိတ်
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
                            }
                          >
                            {data.role}
                          </Badge>
                        ),
                      },
                      /*                         {
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
                        }, */
                      {
                        label: "since",
                        value: formatDate(data.createdAt),
                      },
                      {
                        label: "Last Update",
                        value: formatDate(data.updatedAt),
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="grid grid-cols-3 items-center"
                      >
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

            <TableCell>
              <FireStaffDialog staff={data} onDone={fetchStaff} />
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
          <Button variant="outline" className="w-fit">
            အသစ်လုပ်ရန်
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md sm:max-w-lg max-h-[90dvh] flex flex-col p-0">
          <DialogHeader className="px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle hidden></DialogTitle>
                <DialogDescription>
                  ဝန်ထမ်းအသစ်အတွက် အချက်အလက်များဖြည့်ပါ
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">ဝန်ထမ်းအမည်</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">ဖုန်းနံပါတ်</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    Email{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">လိပ်စာ</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="လိပ်စာထည့်ပါ"
                    className="resize-none"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateFormData("role", value)}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="border-t px-5 py-4 sm:px-6">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                ပြုလုပ်ရန်
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-250px)]">
          <Table className="rounded-md  overflow-hidden">
            <TableHeader>{renderTableHeader()}</TableHeader>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function FireStaffDialog({
  staff,
  onDone,
}: {
  staff: Staff;
  onDone: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isManager = staff.role === "MANAGER";

  const handleConfirm = async () => {
    if (isManager) {
      toast.error("Manager အကောင့်ကိုပိတ်လို့မရပါ");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await toggleFireStatus(staff.id);
      if (result.success) {
        toast.success(
          result.staff?.isFire
            ? `${result.staff.name} အကောင့်ပိတ်ပြီးပါပြီ`
            : `${result.staff?.name} အကောက်ဖွင့်ပြီးပါပြီ`,
        );
        setOpen(false);
        await onDone();
      } else {
        toast.error(result.error || "Failed");
      }
    } catch (error) {
      console.error("Toggle fire status error:", error);
      toast.error("မမျှော်လင့်ထားသောအမှား");
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionLabel = staff.isFire ? "အကောက်ဖွင့်ရန်" : "အကောင့်ပိတ်ရန်";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={staff.isFire ? "ghost" : "destructive"} size="sm" >
          {actionLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle hidden></DialogTitle>
            
  
          <DialogDescription>
            အောက်ပါဝန်ထမ်းကို {actionLabel} သေချာပါသလား?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          {[
            { label: "အမည်", value: staff.name },
            { label: "ဖုန်းနံပါတ်", value: staff.phone },
            { label: "လိပ်စာ", value: staff.address },
          ].map(({ label, value }) => (
            <div key={label} className="grid grid-cols-3 items-center">
              <Label className="font-medium">{label}</Label>
              <div className="col-span-2 text-sm text-muted-foreground">
                {value}
              </div>
            </div>
          ))}
        </div>

        {isManager && (
          <Alert variant="destructive">
            <AppIcon name="info" className="h-4 w-4" />
            <AlertDescription>
            Manager အကောင့်ကိုပိတ်လို့မရပါ
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button
            variant={staff.isFire ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={isSubmitting || isManager}
          >
            {isSubmitting ? "..." : actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
