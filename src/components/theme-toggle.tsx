"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { AppIcon } from "./app-icons";
import {
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
        <AppIcon
          name={isDark ? "moon" : "sun"}
          className="h-4 w-4"
        />
        <span>Theme</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
            !isDark && "bg-sidebar-accent text-sidebar-accent-foreground",
          )}>
          <AppIcon name="sun" className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
            isDark && "bg-sidebar-accent text-sidebar-accent-foreground",
          )}>
          <AppIcon name="moon" className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
