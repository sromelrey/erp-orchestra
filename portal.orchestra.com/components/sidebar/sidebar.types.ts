import React from "react";

export interface MenuItem {
  label: string;
  href?: string;
  icon?: React.ElementType;
  description?: string;
  menu_code: string;
  permission?: string;
  feature?: string;
  children?: MenuItem[];
  role?: string;
}