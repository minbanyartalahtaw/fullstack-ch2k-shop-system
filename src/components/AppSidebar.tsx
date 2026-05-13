"use client";

import { AppIcon } from "./app-icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./theme-toggle";

interface Prop {
  role: string;
  name: string;
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar({ role, name }: Prop) {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ဝန်ထမ်း</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="flex items-center gap-2">
                  <AppIcon name="invoice" className="h-4 w-4" />
                  <span>ဘောက်ချာ</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActivePath(
                        pathname,
                        "/office/staff/invoice/new",
                      )}>
                      <Link href="/office/staff/invoice/new">
                        <div>
                          <AppIcon name="newInvoice" className="h-4 w-4" />
                        </div>
                        <span>အသစ်လုပ်ရန်</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActivePath(
                        pathname,
                        "/office/staff/invoice/history",
                      )}>
                      <Link href="/office/staff/invoice/history">
                        <div>
                          <AppIcon
                            name="invoiceHistory"
                            className="h-4 w-4"
                          />
                        </div>
                        <span>အဟောင်းများ</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenuSub>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActivePath(pathname, "/office/staff/order")}>
                  <Link href="/office/staff/order">
                    <div>
                      <AppIcon name="order" className="h-4 w-4" />
                    </div>
                    <span>အော်ဒါများ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/*                             <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/office/staff/customer">
                                        <div>
                                            <AppIcon name="customer" className="h-4 w-4" />
                                        </div>
                                        <span>Customer</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {role === "MANAGER" && (
          <SidebarGroup>
            <SidebarGroupLabel>မန်နေဂျာ</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/dashboard",
                    )}>
                    <Link href="/office/manager/dashboard">
                      <div>
                        <AppIcon name="chart" className="h-4 w-4" />
                      </div>
                      <span>စရင်းဇယား</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/manage-staff",
                    )}>
                    <Link href="/office/manager/manage-staff">
                      <div>
                        <AppIcon name="staff" className="h-4 w-4" />
                      </div>
                      <span>ဝန်ထမ်းဆိုင်ရာ</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/productType",
                    )}>
                    <Link href="/office/manager/productType">
                      <div>
                        <AppIcon name="productTypeNew" className="h-4 w-4" />
                      </div>
                      <span>ပစ္စည်းအမျိုးအစား</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/chatbot",
                    )}>
                    <Link href="/office/manager/chatbot">
                      <div>
                        <AppIcon name="bot" className="h-4 w-4" />
                      </div>
                      <span>AI Assistant</span>
                      <Badge variant="outline">beta</Badge>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="shrink-0 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="border border-sidebar-border cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full justify-between">
                  <div className="flex items-center gap-2">
                    <AppIcon name="customer" className="h-4 w-4 shrink-0" />
                    <span className="truncate">{name}</span>
                  </div>
                  <Badge variant={role === "MANAGER" ? "manager" : "staff"}>
                    {role}
                  </Badge>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <ThemeToggle />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={logoutAction}>
                  <AppIcon name="logout" className="h-4 w-4" />
                  <span>ထွက်ရန်</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
