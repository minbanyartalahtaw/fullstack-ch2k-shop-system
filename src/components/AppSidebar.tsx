<<<<<<< HEAD
"use client"

import { usePathname } from "next/navigation";
=======
"use client";

>>>>>>> 19ef8e4 (add light mode & dark mode)
import { AppIcon } from "./app-icons";

import {
  Sidebar,
  SidebarContent,
<<<<<<< HEAD
  SidebarFooter,
=======
>>>>>>> 19ef8e4 (add light mode & dark mode)
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
<<<<<<< HEAD

=======
import { usePathname } from "next/navigation";
>>>>>>> 19ef8e4 (add light mode & dark mode)

interface Prop {
  role: string;
}

<<<<<<< HEAD
=======
function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

>>>>>>> 19ef8e4 (add light mode & dark mode)
export function AppSidebar({ role }: Prop) {
  const pathname = usePathname();

  return (
<<<<<<< HEAD
    <Sidebar>
=======
    <Sidebar variant="floating" className="pt-12">
>>>>>>> 19ef8e4 (add light mode & dark mode)
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
<<<<<<< HEAD
                        <SidebarMenuButton asChild isActive={pathname === "/office/staff/invoice/new"}>
=======
                        <SidebarMenuButton
                          asChild
                          isActive={isActivePath(
                            pathname,
                            "/office/staff/invoice/new",
                          )}>
>>>>>>> 19ef8e4 (add light mode & dark mode)
                          <Link href="/office/staff/invoice/new">
                            <div>
                              <AppIcon name="newInvoice" className="h-4 w-4" />
                            </div>
                            <span>အသစ်လုပ်ရန်</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
<<<<<<< HEAD
                        <SidebarMenuButton asChild isActive={pathname === "/office/staff/invoice/history"}>
=======
                        <SidebarMenuButton
                          asChild
                          isActive={isActivePath(
                            pathname,
                            "/office/staff/invoice/history",
                          )}>
>>>>>>> 19ef8e4 (add light mode & dark mode)
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
<<<<<<< HEAD
                        <SidebarMenuButton asChild isActive={pathname === "/office/staff/invoice/search"}>
=======
                        <SidebarMenuButton
                          asChild
                          isActive={isActivePath(
                            pathname,
                            "/office/staff/invoice/search",
                          )}>
>>>>>>> 19ef8e4 (add light mode & dark mode)
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
<<<<<<< HEAD
                <SidebarMenuButton asChild isActive={pathname === "/office/staff/order"}>
                  <a href="/office/staff/order">
=======
                <SidebarMenuButton
                  asChild
                  isActive={isActivePath(pathname, "/office/staff/order")}>
                  <Link href="/office/staff/order">
>>>>>>> 19ef8e4 (add light mode & dark mode)
                    <div>
                      <AppIcon name="order" className="h-4 w-4" />
                    </div>
                    <span>အော်ဒါများ</span>
<<<<<<< HEAD
                  </a>
=======
                  </Link>
>>>>>>> 19ef8e4 (add light mode & dark mode)
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
<<<<<<< HEAD
                  <SidebarMenuButton asChild isActive={pathname === "/office/manager/dashboard"}>
                    <a href="/office/manager/dashboard">
=======
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/dashboard",
                    )}>
                    <Link href="/office/manager/dashboard">
>>>>>>> 19ef8e4 (add light mode & dark mode)
                      <div>
                        <AppIcon name="chart" className="h-4 w-4" />
                      </div>
                      <span>စရင်းဇယား</span>
<<<<<<< HEAD
                    </a>
=======
                    </Link>
>>>>>>> 19ef8e4 (add light mode & dark mode)
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
<<<<<<< HEAD
                  <SidebarMenuButton asChild isActive={pathname === "/office/manager/manage-staff"}>
                    <a href="/office/manager/manage-staff">
=======
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/manage-staff",
                    )}>
                    <Link href="/office/manager/manage-staff">
>>>>>>> 19ef8e4 (add light mode & dark mode)
                      <div>
                        <AppIcon name="staff" className="h-4 w-4" />
                      </div>
                      <span>ဝန်ထမ်းဆိုင်ရာ</span>
<<<<<<< HEAD
                    </a>
=======
                    </Link>
>>>>>>> 19ef8e4 (add light mode & dark mode)
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
<<<<<<< HEAD
                  <SidebarMenuButton asChild isActive={pathname === "/office/manager/productType"}>
                    <a href="/office/manager/productType">
=======
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(
                      pathname,
                      "/office/manager/productType",
                    )}>
                    <Link href="/office/manager/productType">
>>>>>>> 19ef8e4 (add light mode & dark mode)
                      <div>
                        <AppIcon name="productTypeNew" className="h-4 w-4" />
                      </div>
                      <span>ပစ္စည်းအမျိုးအစား</span>
<<<<<<< HEAD
                    </a>
=======
                    </Link>
>>>>>>> 19ef8e4 (add light mode & dark mode)
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      {/*             <SidebarFooter>

                <SidebarMenuButton asChild>
                    <Button>
                        <div>
                            <AppIcon name="view" className="h-4 w-4" />
                        </div>
                        <span>Logout</span>
                    </Button>
                </SidebarMenuButton>

            </SidebarFooter> */}
    </Sidebar>
  );
}
