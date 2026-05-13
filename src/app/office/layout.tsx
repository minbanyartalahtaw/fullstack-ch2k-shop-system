import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Metadata } from "next";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { ThemeProvider } from "@/components/theme-provider";
import { TopBar } from "@/components/top-bar";


export const metadata: Metadata = {
  title: "Chan Htaw Office",
  description: "Chan Htaw Back Office",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("staff-token")?.value;
  if (!token) return null;
  const payload = await verifyJwt(token);
  if (!payload) return null;
  const name = payload.name as string;
  const role = payload.role as string;
  const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";
  return (
    <ThemeProvider>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <AppSidebar role={role} name={name} />
        <SidebarInset>
          <TopBar role={role} />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
