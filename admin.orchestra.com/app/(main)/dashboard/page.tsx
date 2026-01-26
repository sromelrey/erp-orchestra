"use client";

import React from "react";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Activity, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  ChevronRight
} from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "$128,430",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Active Tenants",
    value: "2,431",
    change: "+18.2%",
    trend: "up",
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Admin Users",
    value: "156",
    change: "+4.1%",
    trend: "up",
    icon: Users,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    label: "System Status",
    value: "99.98%",
    change: "-0.01%",
    trend: "down",
    icon: Activity,
    color: "bg-amber-100 text-amber-600",
  },
];

const recentTenants = [
  { name: "Acme Corp", plan: "Enterprise", status: "Active", date: "2 mins ago" },
  { name: "Global Logistics", plan: "Business", status: "Provisioning", date: "15 mins ago" },
  { name: "TechNova Solutions", plan: "Startup", status: "Active", date: "1 hour ago" },
  { name: "Swift Retail", plan: "Enterprise", status: "Active", date: "3 hours ago" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back. Here's a snapshot of your global operations.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]">
            Download Report
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
            Add New Client
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 hover:shadow-indigo-100/30 transition-all duration-300">
            <div className="flex items-center justify-between transition-transform group-hover:-translate-y-1 duration-300">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} shadow-inner`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            
            <div className="mt-6 flex flex-col">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</span>
              <span className="mt-1 text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Chart Area (Placeholder) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-1 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-lg font-bold text-gray-900">Tenant Growth Analysis</h3>
              <button className="text-gray-400 hover:text-gray-600"><MoreVertical size={18} /></button>
            </div>
            
            {/* Visual Placeholder for Chart */}
            <div className="h-80 w-full relative group">
                <div className="absolute inset-x-8 bottom-8 top-4 flex items-end gap-2 group-hover:gap-3 transition-all duration-500">
                    {[35, 60, 45, 80, 55, 90, 75, 100, 85, 95, 110, 120].map((height, i) => (
                        <div 
                            key={i} 
                            style={{ height: `${height}%` }} 
                            className="flex-1 rounded-t-lg bg-indigo-50 border-b-4 border-indigo-600/30 group-hover:bg-indigo-100 transition-colors duration-300 cursor-pointer relative"
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all pointer-events-none">
                                {height * 10}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Grid Lines */}
                <div className="absolute inset-x-8 bottom-8 top-4 border-b border-gray-100 flex flex-col justify-between py-2 pointer-events-none opacity-50">
                    <div className="border-t border-gray-100 w-full h-px" />
                    <div className="border-t border-gray-100 w-full h-px" />
                    <div className="border-t border-gray-100 w-full h-px" />
                </div>
            </div>
            <div className="flex justify-between px-10 pb-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Recent Provisions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Tenants</h3>
              <a href="#" className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1">
                View All <ChevronRight size={14} />
              </a>
            </div>
            
            <div className="space-y-6">
              {recentTenants.map((tenant, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
                    <Building2 size={24} />
                  </div>
                  <div className="flex flex-1 flex-col truncate">
                    <span className="font-bold text-gray-900 truncate tracking-tight">{tenant.name}</span>
                    <span className="text-xs text-gray-400 font-medium">Provisioned {tenant.date}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-full ${
                      tenant.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}>
                      {tenant.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{tenant.plan}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-10 w-full rounded-xl border-2 border-dashed border-gray-100 py-4 text-xs font-bold text-gray-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300">
                + Provision New Infrastructure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
