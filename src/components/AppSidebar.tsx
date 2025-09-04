
import { AppIcon } from "./app-icons"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,

} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

export function AppSidebar() {
    return (
        <Sidebar variant="floating" className="pt-12">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/office/">
                                        <div>
                                            <AppIcon name="home" className="h-4 w-4" />
                                        </div>
                                        <span>Home</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/office/dashboard">
                                        <div>
                                            <AppIcon name="chart" className="h-4 w-4" />
                                        </div>
                                        <span>Dashboard</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <Collapsible defaultOpen className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton className="flex justify-between items-center gap-2">
                                            <div className="flex items-center gap-2 ">
                                                <AppIcon name="invoice" className="h-4 w-4" />
                                                <span>Invoice</span>
                                            </div>
                                            <div className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180">
                                                <AppIcon name="chevronDown" className="h-4 w-4" />
                                            </div>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild>
                                                    <a href="/office/invoice/new">
                                                        <div>
                                                            <AppIcon name="newInvoice" className="h-4 w-4" />
                                                        </div>
                                                        <span>New Invoice</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>

                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild>
                                                    <a href="/office/invoice/search">
                                                        <div>
                                                            <AppIcon name="searchInvoice" className="h-4 w-4" />
                                                        </div>
                                                        <span>Search</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>

                                            <SidebarMenuItem>
                                                <SidebarMenuButton asChild>
                                                    <a href="/office/invoice/history">
                                                        <div>
                                                            <AppIcon name="invoiceHistory" className="h-4 w-4" />
                                                        </div>
                                                        <span>History</span>
                                                    </a>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>

                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/office/order">
                                        <div>
                                            <AppIcon name="order" className="h-4 w-4" />
                                        </div>
                                        <span>Order</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/office/customer">
                                        <div>
                                            <AppIcon name="user" className="h-4 w-4" />
                                        </div>
                                        <span>Customer</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}