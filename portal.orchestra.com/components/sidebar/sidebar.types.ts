import { LucideIcon } from "lucide-react";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: any;
  description?: string;
  menu_code: string;
  permission?: string;
  feature?: string;
  children?: MenuItem[];
  role?: string;
}