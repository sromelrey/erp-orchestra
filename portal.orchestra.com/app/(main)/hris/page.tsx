'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeClock } from '@/components/hris/attendance/TimeClock';
import { Badge } from '@/components/ui/badge';
import { useGetMyLeaveRequestsQuery } from '@/store/api/leaveApi';
import { useGetEmployeesQuery } from '@/store/api/employeesApi';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

import { DataTable, Column } from '@/components/ui/data-table';

export default function HRISOverviewPage() {
  const { data: myRequests } = useGetMyLeaveRequestsQuery();
  const { data: employees } = useGetEmployeesQuery({});

  const dashboardLeaveColumns: Column<any>[] = [
    {
      header: 'Staff',
      cell: (req) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
            {req.employee?.firstName?.[0]}{req.employee?.lastName?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs truncate max-w-[150px]" title={`${req.employee?.firstName} ${req.employee?.lastName}`}>
              {req.employee?.firstName} {req.employee?.lastName}
            </span>
            <span className="text-[10px] text-muted-foreground truncate max-w-[150px]" title={req.leaveType?.name}>
              {req.leaveType?.name}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Dates',
      cell: (req) => (
        <span className="text-xs font-medium text-gray-500">
          {format(new Date(req.startDate), 'MMM d')} - {format(new Date(req.endDate), 'MMM d')}
        </span>
      )
    },
    {
       header: 'Status',
       className: 'text-right',
       cell: (req) => (
         <Badge 
            variant={req.status === 'PENDING' ? 'secondary' : 'default'}
            className="font-bold text-[10px] px-2 py-0 h-5"
         >
            {req.status}
         </Badge>
       )
    }
  ];

  const stats = [
    { label: 'Total Employees', value: employees?.meta?.nextCursor ? '50+' : (employees?.data?.length || 0), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On Leave Today', value: '4', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg Attendance', value: '94%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Requests', value: myRequests?.filter(r => r.status === 'PENDING').length || 0, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">HRIS Dashboard</h1>
          <p className="text-muted-foreground text-lg mt-1">Personnel management, attendance, and leave tracking summary.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/hris/attendance">
             <Button variant="outline" className="rounded-xl border-2">Attendance Logs</Button>
          </Link>
          <Link href="/hris/my-leaves">
             <Button className="rounded-xl shadow-lg shadow-primary/20">Apply for Leave</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-md hover:shadow-xl transition-all group cursor-default h-32 overflow-hidden relative">
             <div className="absolute -right-4 -bottom-4 opacity-5 transition-transform group-hover:scale-110 group-hover:rotate-12">
                <stat.icon size={120} />
             </div>
             <CardContent className="p-6 flex items-center gap-5 h-full">
                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-inner`}>
                   <stat.icon size={28} />
                </div>
                <div>
                   <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                   <p className="text-xs font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{stat.label}</p>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Time Clock & Quick Info */}
        <div className="lg:col-span-1 space-y-8">
          <TimeClock />
          
          <Card className="border-none shadow-lg bg-slate-900 text-white overflow-hidden">
             <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                   <Briefcase className="h-5 w-5 text-primary-foreground" />
                   Quick Actions
                </CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-2">
                {[
                  { label: 'View My Profile', href: '/profile', icon: Users },
                  { label: 'Company Documents', href: '/docs', icon: FileText },
                  { label: 'Holiday Calendar', href: '/calendar', icon: Calendar },
                ].map((action, i) => (
                  <Link key={i} href={action.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group">
                     <div className="flex items-center gap-3">
                        <action.icon size={18} className="opacity-70" />
                        <span className="text-sm font-medium">{action.label}</span>
                     </div>
                     <ArrowRight size={16} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                  </Link>
                ))}
             </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Lists */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="border-none shadow-xl border border-border/50 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 pb-4">
                 <div>
                    <CardTitle className="text-xl font-bold tracking-tight">Recent Leave Requests</CardTitle>
                    <p className="text-sm text-muted-foreground">The latest applications from your team.</p>
                 </div>
                 <Link href="/hris/leave-requests">
                    <Button variant="ghost" size="sm" className="text-primary font-bold">View All</Button>
                 </Link>
              </CardHeader>
              <CardContent className="p-0">
                 {myRequests && myRequests.length > 0 ? (
                   <DataTable
                      columns={dashboardLeaveColumns}
                      data={myRequests.slice(0, 5)}
                      keyExtractor={(req) => req.id}
                      emptyMessage="No recent leave requests."
                   />
                 ) : (
                   <div className="p-12 text-center flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center">
                         <FileText className="h-8 w-8 text-muted-foreground/20" />
                      </div>
                      <p className="text-muted-foreground italic text-sm">No recent leave requests found.</p>
                   </div>
                 )}
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center gap-2">
                       <AlertCircle className="h-4 w-4 text-indigo-600" />
                       Company Announcements
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100">
                          <p className="text-xs font-black text-indigo-600 mb-1">MARCH 15</p>
                          <p className="text-sm font-bold">Annual General Meeting</p>
                          <p className="text-xs text-muted-foreground mt-1">Required attendance for all departments.</p>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-linear-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10">
                 <CardHeader className="pb-2">
                    <CardTitle className="text-md flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-emerald-600" />
                       Upcoming Holidays
                    </CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm border-b border-emerald-100 pb-2">
                          <span className="font-medium">Maundy Thursday</span>
                          <span className="text-xs text-muted-foreground">Apr 2</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Good Friday</span>
                          <span className="text-xs text-muted-foreground">Apr 3</span>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
