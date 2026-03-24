"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface WarehouseBreadcrumbProps {
  warehouseName: string;
}

export function WarehouseBreadcrumb({ warehouseName }: WarehouseBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
      <Link 
        href="/operations" 
        className="hover:text-foreground transition-colors"
      >
        Operations
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link 
        href="/operations/warehouses" 
        className="hover:text-foreground transition-colors"
      >
        Warehouses
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{warehouseName}</span>
    </nav>
  );
}
