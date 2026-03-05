"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { hasUsers, createFirstUser } from "./action";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function WelcomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    hasUsers().then((exists) => {
      if (exists) {
        router.replace("/");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await createFirstUser(formData);
      if (result.success) {
        toast.success(`${result.staff?.name} အကောင့်ဖွင့်ပြီးပါပြီ`);
        router.replace("/");
      } else {
        toast.error(result.error || "အမှားတစ်ခုဖြစ်ပေါ်ခဲ့သည်");
      }
    } catch {
      toast.error("မမျှော်လင့်ထားသောအမှားတစ်ခုဖြစ်ပေါ်ခဲ့သည်");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary/5 px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-xl items-center justify-center">
        <Card className="w-full border-primary/20 bg-white shadow-xl">
          <CardContent className="p-4 sm:p-7">
            <div className="mb-5 space-y-2">
              <h2 className="text-md font-semibold tracking-tight text-foreground sm:text-xl">
                ပထမဦးဆုံး Manager အကောင့်တစ်ခု ဖွင့်ပါ။
              </h2>

              <p className="rounded-md mt-5 border border-primary/25 bg-primary/10 px-3 py-2 text-xs text-primary leading-relaxed">
                မှတ်ချက် - ဤစာမျက်နှာသည် ပထမဆုံးအကြိမ် အကောင့်ဖွင့်ရန်အတွက်သာ
                ဖြစ်ပါသည်။
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">
                    အမည်
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Manager အမည်"
                    className="h-10"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">
                    ဖုန်းနံပါတ်
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="09-XXX-XXX-XXX"
                    className="h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs">
                  လိပ်စာ
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="လိပ်စာ"
                  className="min-h-20 resize-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">
                  စကားဝှက်
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="အနည်းဆုံး ၆ လုံး"
                  className="h-10"
                  required
                />
              </div>

              <Button
                type="submit"
                className="mt-1 h-10 w-full"
                disabled={isSubmitting}>
                {isSubmitting ? "ခနစောင့်ပါ..." : "အကောင့်ဖွင့်ရန်"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
