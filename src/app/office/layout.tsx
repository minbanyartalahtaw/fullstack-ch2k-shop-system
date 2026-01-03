import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Metadata } from "next";

import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";

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
    <SidebarProvider className="overflow-hidden">
      <AppSidebar role={role} />
      <main className="flex flex-col w-full h-full ">
        <SidebarTrigger />
        {/* <Separator orientation="vertical" /> */}
        <div className="flex-1 p-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
