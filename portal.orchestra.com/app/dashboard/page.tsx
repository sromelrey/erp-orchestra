'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { 
  Users, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';

const stats = [
  {
    label: 'Total Employees',
    value: '1,284',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Active Projects',
    value: '42',
    change: '+4.2%',
    trend: 'up',
    icon: Briefcase,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    label: 'Pending Approvals',
    value: '18',
    change: '-2.4%',
    trend: 'down',
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Revenue (YTD)',
    value: '$2.4M',
    change: '+18.2%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

const activities = [
  {
    user: 'Sarah Smith',
    action: 'created a new project',
    target: 'Website Redesign',
    time: '2 hours ago',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    user: 'John Doe',
    action: 'submitted a timesheet',
    target: 'Week 42',
    time: '4 hours ago',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    user: 'System',
    action: 'backend backup completed',
    target: 'Database',
    time: '6 hours ago',
    avatar: '',
    initial: 'S',
  },
  {
    user: 'Emily Davis',
    action: 'updated company policy',
    target: 'HR Manual',
    time: '1 day ago',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
  },
];

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const currentTime = new Date().getHours();
  const greeting = currentTime < 12 ? 'Good morning' : currentTime < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {greeting}, {user?.firstName || 'Guest'}
        </h1>
        <p className="text-gray-500">
          Here is what's happening in your workspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              {stat.trend === 'up' ? (
                <div className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </div>
              ) : (
                <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                  <ArrowDownRight className="h-3 w-3" />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            {/* Decorative background shape */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 transition-transform group-hover:scale-110" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="relative flex-none">
                   {activity.avatar ? (
                      <img
                        src={activity.avatar}
                        alt={activity.user}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                      />
                   ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold ring-2 ring-white">
                        {activity.initial}
                      </div>
                   )}
                  <span className="absolute -bottom-1 -right-1 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-bold">{activity.user}</span> {activity.action}{' '}
                    <span className="font-semibold text-indigo-600">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Getting Started */}
        <div className="rounded-xl bg-indigo-600 p-6 text-white shadow-lg lg:col-span-1 relative overflow-hidden">
             
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-2">Unlock Premium Features</h2>
            <p className="text-indigo-100 text-sm mb-6">
              Upgrade your plan to access advanced analytics and unlimited projects.
            </p>
            <button className="w-full rounded-lg bg-white py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm">
              Upgrade Now
            </button>
            
            <div className="mt-8 pt-6 border-t border-indigo-500/30">
                 <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
                 <div className="space-y-2">
                    <button className="block w-full text-left text-sm text-indigo-100 hover:text-white hover:underline">
                        → Create New User
                    </button>
                    <button className="block w-full text-left text-sm text-indigo-100 hover:text-white hover:underline">
                        → View System Logs
                    </button>
                    <button className="block w-full text-left text-sm text-indigo-100 hover:text-white hover:underline">
                        → Manage Roles
                    </button>
                 </div>
            </div>
          </div>
          
           {/* Background Decor */}
           <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}