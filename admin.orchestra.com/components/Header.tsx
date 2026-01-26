"use client";

import React from "react";
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/slices/authSlice";
import { useLogout } from "../hooks/useLogout";
import { SidebarTrigger } from "./ui/sidebar";

export function Header() {
  const { logout } = useLogout();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white px-8 shadow-sm">
      <div className="flex w-1/3 items-center gap-4">
        <SidebarTrigger />
        <div className="relative w-full max-w-md group">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all"
            placeholder="Search dashboard..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="group relative flex items-center gap-3 cursor-pointer">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-gray-900 leading-none">
              {user?.name || "System Admin"}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
              {user?.role || "Super Admin"}
            </span>
          </div>
          
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 shadow-sm transition-transform active:scale-95">
            <User size={20} className="fill-indigo-700/20" />
          </div>

          <ChevronDown size={16} className="text-gray-400 transition-transform group-hover:rotate-180" />

          {/* User Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-56 origin-top-right translate-y-2 opacity-0 invisible group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out z-20">
            <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
              <div className="px-3 py-2 border-b border-gray-50 mb-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Account</p>
              </div>
              
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                <Settings size={16} />
                Profile Settings
              </button>
              
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                <HelpCircle size={16} />
                Support Center
              </button>
              
              <div className="my-1 border-t border-gray-50" />
              
              <button 
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
