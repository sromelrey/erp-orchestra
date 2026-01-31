'use client';

import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
  const user = useSelector(selectCurrentUser);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm sticky top-0 z-10 w-full">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {/* Search Bar */}
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 w-96">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Search items, orders, or employees..."
            className="bg-transparent outline-none w-full placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l pl-6">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-indigo-600 font-medium">
              {user?.tenantId ? `Tenant #${user.tenantId}` : 'System Admin'}
            </p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
             {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="User" className="h-full w-full object-cover" />
             ) : (
                <User className="h-5 w-5" />
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
