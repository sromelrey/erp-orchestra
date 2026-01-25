"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SUPER_ADMIN_MENU_ITEMS } from "./sidebar.config";
import { useLogout } from "../../hooks/useLogout";
import { LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 border-r bg-background h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">Orchestra</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {SUPER_ADMIN_MENU_ITEMS.map((item) => {
          if (item.children) {
            return (
              <div key={item.menu_code} className="mb-4">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-muted-foreground">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                <div className="mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.menu_code}
                      href={child.href}
                      className={`flex items-center gap-3 px-3 py-2 pl-10 rounded-md text-sm transition-colors ${
                        pathname === child.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {child.icon && <child.icon className="w-4 h-4" />}
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          }

          if (item.href) {
            return (
              <Link
                key={item.menu_code}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          }

          return null;
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}