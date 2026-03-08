import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Metadata } from "next";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "ch2k office",
  description: "Chan Htaw Back Office",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("staff-token")?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  if (!payload) return null;
  const name = payload.name as string;
  const role = payload.role as string;
  return (
    <ThemeProvider>
      <SidebarProvider className="overflow-hidden">
        <AppSidebar role={role} name={name} />
        <SidebarInset>
          <div className="h-9 w-full bg-background/60 backdrop-blur-md fixed top-0 left-0 right-0 z-40 shadow-sm flex items-center justify-between flex-row p-2">
            <SidebarTrigger />

            <ThemeToggle />
          </div>
          <div className="flex justify-end p-4 "></div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
