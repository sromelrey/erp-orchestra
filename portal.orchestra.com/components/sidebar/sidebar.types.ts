import { LucideIcon } from "lucide-react";

export interface MenuItem {
    label: string;
    icon: LucideIcon;
    menu_code: string;
    href: string;
    description?: string;
    children?: MenuItem[];
    role?: string;
}