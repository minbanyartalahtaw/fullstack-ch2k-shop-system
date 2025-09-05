import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "sonner"

export const metadata: Metadata = {
    title: "ch2k office",
    description: "Chan Htaw Back Office",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="overflow-hidden">
            <AppSidebar />
            <main className="relative">
                <div className="h-9 w-full bg-muted/10 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 shadow-sm flex
                items-center">
                    <SidebarTrigger />
                    <Separator orientation="vertical" />
                </div>
                <div className="pt-12  mx-auto w-[100vw] ">
                    <Toaster richColors position="top-right" /> {/* ✅ place here */}
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
