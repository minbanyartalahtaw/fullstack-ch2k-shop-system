import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Metadata } from "next";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
>>>>>>> 19ef8e4 (add light mode & dark mode)

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
  const role = payload.role as string;
  return (
<<<<<<< HEAD
    <SidebarProvider className="overflow-hidden">
      <AppSidebar role={role} />
      <main className="flex flex-col w-full h-full ">
        <SidebarTrigger />
        {/* <Separator orientation="vertical" /> */}
        <div className="flex-1 p-2">{children}</div>
      </main>
    </SidebarProvider>
=======
    <ThemeProvider>
      <SidebarProvider className="overflow-hidden">
        <AppSidebar role={role} />
        <SidebarInset>
          <div
            className="h-9 w-full bg-muted/10 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-sm flex
                items-center justify-between flex-row p-2">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          <div className="flex justify-end p-6 "></div>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
>>>>>>> 19ef8e4 (add light mode & dark mode)
  );
}
