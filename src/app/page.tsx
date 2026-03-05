"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "./action";
import { checkHasUsers } from "./action";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkHasUsers().then((hasUsers) => {
      if (!hasUsers) {
        router.replace("/welcome");
      } else {
        setReady(true);
      }
    });
  }, [router]);

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
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="mb-8 space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              မင်္ဂလာပါ
            </h1>
            <p className="text-sm text-muted-foreground">
              အကောင့်ဝင်ရန် ဖုန်းနံပါတ်နှင့် စကားဝှက်များကို ဖြည့်သွင်းပါ
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                {/*                 <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-foreground">
                  Phone Number
                </Label> */}
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="h-11 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
                  placeholder="09-XXX-XXX-XXX"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {/*                   <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground">
                    Password
                  </Label> */}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-11 bg-background border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-shadow"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors shadow-sm">
              အကောင့်ဝင်ရန်
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
