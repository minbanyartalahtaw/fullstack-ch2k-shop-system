"use client";

import { AppIcon } from "./app-icons";

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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Prop {
  role: string;
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppSidebar({ role }: Prop) {
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

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isActivePath(
                            pathname,
                            "/office/staff/invoice/search",
                          )}>
                          <Link href="/office/staff/invoice/search">
                            <div>
                              <AppIcon
                                name="searchInvoice"
                                className="h-4 w-4"
                              />
                            </div>
                            <span>ရှာဖွေရန်</span>
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
