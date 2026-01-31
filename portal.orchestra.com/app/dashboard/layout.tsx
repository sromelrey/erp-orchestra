'use client';

import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { Header } from "@/components/layout/Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col flex-1 overflow-hidden min-h-screen">
          {/* Header */}
          <Header />

          {/* Dynamic Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50 p-8">
            <div className="mx-auto w-full max-w-7xl">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {children}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
