"use client";

import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/app-icons";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
      <AppIcon name="arrowLeft" className="h-4 w-4" />
      ပြန်သွားရန်
    </button>
  );
}
