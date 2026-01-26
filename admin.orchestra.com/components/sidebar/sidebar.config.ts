import { 
  LayoutDashboard, 
  Users, 
  Banknote, 
  ShieldCheck, 
  BarChart, 
  Settings,
  Building2Icon,
  CreditCard,
  UserCircle,
} from "lucide-react";
// Define navigation items with icons
export const SUPER_ADMIN_MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of system health, active clients, revenue, usage metrics",
    menu_code:'SA-01'
  },

  {
    label: "Clients",
    icon: Users,
    menu_code:'SA-02',
    children: [
      {
        label: "All Clients",
        href: "/clients",
        description: "View and manage client companies/tenants",
        menu_code:'SA-02-01'
      },
      {
        label: "Add Client",
        href: "/clients/new",
        description: "Create a new client company account",
        menu_code:'SA-02-02'
      },
      {
        label: "Client Settings",
        href: "/clients/settings",
        description: "Manage client-specific settings (branding, domain, locale)",
        menu_code:'SA-02-03'
      },
    ],
  },

  {
    label: "Tenant Management",
    icon: Building2Icon,
    menu_code:'SA-03',
    href: "/tenants",
  },

  {
    label: "Plans & Modules",
    icon: Banknote,
    menu_code:'SA-04',
    children: [
      {
        label: "Plans",
        href: "/plans",
        description: "Create pricing plans (Free, Basic, Pro, Enterprise)",
        menu_code:'SA-04-01'
      },
      {
        label: "Modules",
        href: "/modules",
        description: "Define modules available (HRIS, AIS, CRM, PMS)",
        menu_code:'SA-04-02'
      },
      {
        label: "Assign Modules",
        href: "/plans/assign",
        description: "Link modules to plans and control access",
        menu_code:'SA-04-03'
      },
    ],
  },

  {
    label: "Billing & Subscriptions",
    icon: CreditCard,
    menu_code:'SA-05',
    children: [
      {
        label: "Subscriptions",
        href: "/subscriptions",
        description: "Manage client subscriptions, upgrades, downgrades",
        menu_code:'SA-05-01'
      },
      {
        label: "Invoices",
        href: "/billing/invoices",
        description: "View invoices, status, due dates, payment history",
        menu_code:'SA-05-02'
      },
      {
        label: "Payments",
        href: "/billing/payments",
        description: "Track payments and failed transactions",
        menu_code:'SA-05-03'
      },
    ],
  },

  {
    label: "Admin Users",
    icon: UserCircle,
    menu_code:'SA-06',
    children: [
      {
        label: "Users",
        href: "/users",
        description: "Manage internal admin users and support staff",
        menu_code:'SA-06-01'
      },
      {
        label: "Roles",
        href: "/roles",
        description: "Create and manage roles for admin-level access",
        menu_code:'SA-06-02'
      },
      {
        label: "Permissions",
        href: "/permissions",
        description: "Define granular permissions and access rules",
        menu_code:'SA-06-03'
      },
    ],
  },

  {
    label: "Security",
    icon: ShieldCheck,
    menu_code:'SA-07',
    children: [
      {
        label: "Audit Logs",
        href: "/logs",
        description: "Track all system changes and actions for compliance",
        menu_code:'SA-07-01'
      },
      {
        label: "Sessions",
        href: "/sessions",
        description: "View active sessions, revoke access, manage security",
        menu_code:'SA-07-02'
    },
    ],
  },

  {
    label: "Reports",
    icon: BarChart,
    menu_code:'SA-08',
    children: [
      {
        label: "System Reports",
        href: "/reports/system",
        description: "Usage reports, performance reports, client activity",
        menu_code:'SA-08-01'
      },
      {
        label: "Revenue Reports",
        href: "/reports/revenue",
        description: "Revenue, subscription growth, churn, billing stats",
        menu_code:'SA-08-02'
      },
    ],
  },

  {
    label: "Settings",
    icon: Settings,
    menu_code:'SA-09',
    children: [
      {
        label: "General Settings",
        href: "/settings/general",
        description: "System-wide settings, branding, email templates",
        menu_code:'SA-09-01'
      },
      {
        label: "Integrations",
        href: "/settings/integrations",
        description: "Connect payment gateways, email providers, webhooks",
        menu_code:'SA-09-02'
      },
    ],
  },
];
