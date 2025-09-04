import type { LucideIcon } from "lucide-react";
import {
    Home,
    Search,
    Settings,
    User,
    Calendar,
    ShoppingCart,
    FileText,
    ChevronDown,
    FilePlus2,
    FileSearch,
    FileClock,
    Package,
    DollarSign,
    ChartLine,
} from "lucide-react";

// Pick ONLY the icons your app should use.
// Add/remove here to control what's allowed.
export const ICONS = {
    home: Home,
    search: Search,
    settings: Settings,
    user: User,
    calendar: Calendar,
    order: ShoppingCart,
    invoice: FileText,
    chevronDown: ChevronDown,
    newInvoice: FilePlus2,
    searchInvoice: FileSearch,
    invoiceHistory: FileClock,
    product: Package,
    price: DollarSign,
    chart: ChartLine
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
