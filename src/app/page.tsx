"use client"
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
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    toast.promise(loginAction(formData), {
      loading: 'ခနစောင့်ပါ...',
      success: (data: { success: boolean, message: string }) => {
        if (!data.success) {
          throw new Error(data.message);
        }
        router.push("/office/manager/dashboard");
        return 'Login successful';
      },
      error: (err) => {
        return err.message;
      }
    });
    return
  }
  return (
    <Card className="flex h-screen w-full items-center justify-center bg-gray-50">
      <CardContent className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">

        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 text-center">
          Welcome
        </CardTitle>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
          </div>


          <Button
            type="submit"
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
