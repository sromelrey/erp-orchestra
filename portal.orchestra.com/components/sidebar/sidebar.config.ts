import { 
  LayoutDashboard,
  Users,
  Shield,
  UserCog,
  Monitor,
  KeyRound,
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
        menu_code: 'CP-02-01',
        permission: "system.user.view"
      },
      {
        label: "Roles",
        href: "/roles",
        icon: Shield,
        description: "Manage user roles and permissions",
        menu_code: 'CP-02-02',
        permission: "system.role.view"
      },
      {
        label: "Active Sessions",
        href: "/sessions",
        icon: KeyRound,
        description: "View and manage all active sessions",
        menu_code: 'CP-02-03',
        permission: "system.session.view"
      },
    ]
  },
  {
    label: "My Sessions",
    href: "/my-sessions",
    icon: Monitor,
    description: "View and manage your active sessions",
    menu_code: 'CP-03'
  },
];
