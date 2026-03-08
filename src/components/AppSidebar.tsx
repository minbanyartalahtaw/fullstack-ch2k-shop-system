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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

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
    <Sidebar variant="floating" className="pt-12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ဝန်ထမ်း</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2 ">
                        <AppIcon name="invoice" className="h-4 w-4" />
                        <span>ဘောက်ချာ</span>
                      </div>
                      <div className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180">
                        <AppIcon name="chevronDown" className="h-4 w-4" />
                      </div>
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
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
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

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
                align="start"
                className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild variant="destructive">
                    <button
                      onClick={logoutAction}
                      className="flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none">
                      <AppIcon name="logout" className="h-4 w-4" />
                      <span>ထွက်ရန်</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
