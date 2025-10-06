"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createStaff, StaffFormData } from "./action";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "MANAGER",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  return (
    <div className="mt-10">
      <Card className="max-w-xl mx-auto">
        <CardTitle className="text-center">Hello a First User </CardTitle>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
