import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "ch2k office",
    description: "Chan Htaw Back Office",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="overflow-hidden">
            <AppSidebar />
            <main>
                <SidebarTrigger />
                <div className="p-2  mx-auto w-[99vw]">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
