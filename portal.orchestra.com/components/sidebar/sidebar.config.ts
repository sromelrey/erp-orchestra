import { 
  LayoutDashboard,
  Users,
  Shield,
  UserCog,
  Monitor,
  KeyRound,
} from "lucide-react";
import { MenuItem } from "./sidebar.types";
import { 
  Building2, 
  Briefcase, 
  MapPin, 
  Network,
  Clock,
  Calendar,
  CheckCircle2,
  Settings
} from "lucide-react";

export const CUSTOMER_PORTAL_MENU_ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/system/system/dashboard",
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
        href: "/system/users",
        icon: Users,
        description: "Manage tenant users",
        menu_code: 'CP-02-01',
        permission: "system.user.view"
      },
      {
        label: "Roles",
        href: "/system/roles",
        icon: Shield,
        description: "Manage user roles and permissions",
        menu_code: 'CP-02-02',
        permission: "system.role.view"
      },
      {
        label: "Active Sessions",
        href: "/system/sessions",
        icon: KeyRound,
        description: "View and manage all active sessions",
        menu_code: 'CP-02-03',
        permission: "system.session.view"
      },
    ]
  },
  {
    label: "My Sessions",
    href: "/system/my-sessions",
    icon: Monitor,
    description: "View and manage your active sessions",
    menu_code: 'CP-03'
  },
  {
    label: "Organization",
    icon: Network,
    description: "Manage company structure",
    menu_code: 'CP-04',
    children: [
      {
        label: "Departments",
        href: "/hris/departments",
        icon: Building2,
        description: "Manage organizational departments",
        menu_code: 'CP-04-01',
        permission: "hris.department.view"
      },
      {
        label: "Designations",
        href: "/hris/designations",
        icon: Briefcase,
        description: "Manage job titles and ranks",
        menu_code: 'CP-04-02',
        permission: "hris.designation.view"
      },
      {
        label: "Branches",
        href: "/hris/branches",
        icon: MapPin,
        description: "Manage physical or logical locations",
        menu_code: 'CP-04-03',
        permission: "hris.branch.view"
      },
      {
        label: "Employees",
        href: "/hris/employees",
        icon: Users,
        description: "Manage organization staff and user accounts",
        menu_code: 'CP-04-04',
        permission: "hris.employee.view"
      },
    ]
  },
  {
    label: "HR Management",
    icon: Briefcase,
    description: "Attendance and Leave Management",
    menu_code: 'CP-05',
    children: [
      {
        label: "Overview",
        href: "/hris",
        icon: LayoutDashboard,
        description: "HRIS summary and quick actions",
        menu_code: 'CP-05-01',
      },
      {
        label: "Attendance",
        href: "/hris/attendance",
        icon: Clock,
        description: "Daily time logs and clock-in",
        menu_code: 'CP-05-02',
        permission: "hris.attendance.log"
      },
      {
        label: "My Leaves",
        href: "/hris/my-leaves",
        icon: Calendar,
        description: "Apply for and track leaves",
        menu_code: 'CP-05-03',
        permission: "hris.leave.request"
      },
      {
        label: "Leave Approval",
        href: "/hris/leave-requests",
        icon: CheckCircle2,
        description: "Review leave applications",
        menu_code: 'CP-05-04',
        permission: "hris.leave.manage"
      },
      {
        label: "Leave Types",
        href: "/hris/leave-types",
        icon: Settings,
        description: "Configure leave policies",
        menu_code: 'CP-05-05',
        permission: "hris.leave_type.manage"
      },
    ]
  },
];
