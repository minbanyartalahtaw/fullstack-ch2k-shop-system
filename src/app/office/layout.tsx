import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";


export const metadata: Metadata = {
  title: "ch2k office",
  description: "Chan Htaw Back Office",
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("staff-token")?.value;
  if (!token) return null
  const payload = await verifyJwt(token);
  if (!payload) return null
  const role = payload.role as string;
  return (
    <SidebarProvider className="overflow-hidden">
      <AppSidebar role={role} />
      <main className="relative">
        <div
          className="h-9 w-full bg-muted/10 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-sm flex
                items-center">
          <SidebarTrigger />
          <Separator orientation="vertical" />
        </div>
        <div className="pt-12  mx-auto w-[100vw] ">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
