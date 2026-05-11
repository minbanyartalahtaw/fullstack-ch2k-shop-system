"use client";

import { usePathname } from "next/navigation";

const TITLES: { match: (path: string) => boolean; label: string }[] = [
  { match: (p) => p === "/office/manager/dashboard", label: "စရင်းဇယား" },
  { match: (p) => p.startsWith("/office/manager/manage-staff"), label: "ဝန်ထမ်းဆိုင်ရာ" },
  { match: (p) => p.startsWith("/office/manager/productType"), label: "ပစ္စည်းအမျိုးအစား" },
  { match: (p) => p.startsWith("/office/manager/chatbot"), label: "Ai Assistant" },
  { match: (p) => p === "/office/staff/invoice/new", label: "ဘောက်ချာအသစ်" },
  { match: (p) => p === "/office/staff/invoice/history", label: "ဘောက်ချာအဟောင်းများ" },
  { match: (p) => p.startsWith("/office/staff/order"), label: "အော်ဒါများ" },
];

export function PageTitle() {
  const pathname = usePathname();
  const title = TITLES.find(({ match }) => match(pathname))?.label ?? "";
  return <span className="truncate">{title}</span>;
}
