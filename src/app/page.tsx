"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./action";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    toast.promise(loginAction(formData), {
      loading: "ခနစောင့်ပါ...",
      success: (data: { success: boolean; message: string }) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        router.push("/office/manager/dashboard");
        return "Login successful";
      },
      error: (err) => {
        return err.message;
      },
    });
    return;
  };
  return (
    <Card className="flex h-screen w-full items-center justify-center bg-white">
      <CardContent className="w-full max-w-sm space-y-6 p-8">
        <CardTitle className="text-xl font-medium text-gray-900 text-center">
          Welcome Back
        </CardTitle>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-sm text-gray-600">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                required
                className="mt-2 w-full border-gray-200 bg-gray-50/50 focus:border-gray-300 focus:ring-0"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-gray-600">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-2 w-full border-gray-200 bg-gray-50/50 focus:border-gray-300 focus:ring-0"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 transition-colors">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
