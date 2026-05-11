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
  title: "Chan Htaw Office",
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
      <SidebarProvider>
        <AppSidebar role={role} name={name} />
        <SidebarInset>
          <div className="h-9 sticky top-0 z-40 bg-background/60 backdrop-blur-md shadow-sm flex items-center justify-between flex-row p-2">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
