import { 
  LayoutDashboard,
  Users,
  Shield,
  UserCog,
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
  {
    label: "User Management",
    icon: UserCog,
    description: "Manage users and roles",
    menu_code: 'CP-02',
    children: [
      {
        label: "Users",
        href: "/users",
        icon: Users,
        description: "Manage tenant users",
        menu_code: 'CP-02-01'
      },
      {
        label: "Roles",
        href: "/roles",
        icon: Shield,
        description: "Manage user roles and permissions",
        menu_code: 'CP-02-02'
      },
    ]
  },
];
