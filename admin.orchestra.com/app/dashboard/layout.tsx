"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
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
    </div>
  );
}
