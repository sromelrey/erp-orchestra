import { 
  LayoutDashboard, 
} from "lucide-react";
import { MenuItem } from "./sidebar.types";

export const CUSTOMER_PORTAL_MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your account activity",
    menu_code: 'CP-01'
  },
];
