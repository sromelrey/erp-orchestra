import { 
  LayoutDashboard, 
  Box,
  Database,
  Factory,
  ShoppingCart,
  ArrowDownCircle,
  ClipboardList,
  ArrowUpCircle,
  Banknote,
  FileText,
  Receipt,
  PieChart,
  Activity,
  Users,
  User,
  Clock,
  DollarSign,
  Briefcase,
  Kanban,
  LineChart,
  Settings,
  Shield,
  Building,
  LogOut
} from "lucide-react";

// Define navigation items with icons
export const SUPER_ADMIN_MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Shortcut to Executive Dashboard",
    menu_code: 'MM-01'
  },
  {
    label: "OPERATIONS",
    icon: Box,
    menu_code: 'OP-00',
    children: [
      {
        label: "Item Master",
        href: "/operations/item-master",
        icon: Database,
        description: "Material Master",
        menu_code: 'OP-01'
      },
      {
        label: "Manufacturing",
        href: "/operations/manufacturing",
        icon: Factory,
        description: "BOM",
        menu_code: 'OP-02'
      },
      {
        label: "Procurement",
        href: "/operations/procurement",
        icon: ShoppingCart,
        description: "Purchasing",
        menu_code: 'OP-03'
      },
      {
        label: "Inbound Stock",
        href: "/operations/inbound-stock",
        icon: ArrowDownCircle,
        description: "GR",
        menu_code: 'OP-04'
      },
      {
        label: "Sales Orders",
        href: "/operations/sales-orders",
        icon: ClipboardList,
        description: "SO",
        menu_code: 'OP-05'
      },
      {
        label: "Outbound Stock",
        href: "/operations/outbound-stock",
        icon: ArrowUpCircle,
        description: "GI",
        menu_code: 'OP-06'
      },
    ]
  },
  {
    label: "FINANCE",
    icon: Banknote,
    menu_code: 'FI-00',
    children: [
      {
        label: "Invoicing",
        href: "/finance/invoicing",
        icon: FileText,
        description: "Sales Invoice",
        menu_code: 'FI-01'
      },
      {
        label: "Expenses",
        href: "/finance/expenses",
        icon: Receipt,
        description: "Accounts Payable",
        menu_code: 'FI-02'
      },
      {
        label: "Financial Reports",
        href: "/finance/reports",
        icon: PieChart,
        description: "Financial Reports",
        menu_code: 'FI-03'
      },
      {
        label: "Cash Flow",
        href: "/finance/cash-flow",
        icon: Activity,
        description: "Cash Flow",
        menu_code: 'FI-04'
      },
    ]
  },
  {
    label: "HR & PAYROLL",
    icon: Users,
    menu_code: 'HR-00',
    children: [
      {
        label: "Employees",
        href: "/hr/employees",
        icon: User,
        description: "Employees",
        menu_code: 'HR-01'
      },
      {
        label: "TimeSheets",
        href: "/hr/timesheets",
        icon: Clock,
        description: "TimeSheets",
        menu_code: 'HR-02'
      },
      {
        label: "Run Payroll",
        href: "/hr/payroll",
        icon: DollarSign,
        description: "Run Payroll",
        menu_code: 'HR-03'
      },
    ]
  },
  {
    label: "STRATEGY",
    icon: Briefcase,
    menu_code: 'ST-00',
    children: [
      {
        label: "Projects",
        href: "/strategy/projects",
        icon: Kanban,
        description: "Projects",
        menu_code: 'ST-01'
      },
      {
        label: "Analytics",
        href: "/strategy/analytics",
        icon: LineChart,
        description: "Executive Dashboard",
        menu_code: 'ST-02'
      },
    ]
  },
  {
    label: "SETTINGS",
    icon: Settings,
    menu_code: 'SE-00',
    children: [
      {
        label: "Users & Roles",
        href: "/settings/users",
        icon: Shield,
        description: "RBAC",
        menu_code: 'SE-01'
      },
      {
        label: "Company Profile",
        href: "/settings/company",
        icon: Building,
        description: "Company Profile",
        menu_code: 'SE-02'
      },
      {
        label: "Log Out",
        href: "/logout",
        icon: LogOut,
        description: "Log Out",
        menu_code: 'SE-03'
      },
    ]
  }
];
