'use client';

import React from 'react';
import { TimeClock } from '@/components/hris/attendance/TimeClock';
import { useGetAttendanceLogsQuery } from '@/store/api/attendanceApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export default function AttendancePage() {
  const { data: logs = [], isLoading: isLoadingLogs } = useGetAttendanceLogsQuery();

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-gray-900">Attendance Tracker</h1>
        <p className="text-muted-foreground text-lg italic">
          Monitor your presence and track time logs efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <TimeClock />

          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex items-start gap-3 shadow-inner">
            <div className="h-8 w-8 bg-white shadow-sm ring-1 ring-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-105">
              <MapPin className="h-4 w-4" />
            </div>
            <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
              Your location and device information are automatically recorded upon every clock-in
              and clock-out event for verification.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/30 p-1.5 rounded-2xl ring-1 ring-border/50 shadow-inner">
              <TabsTrigger
                value="history"
                className="rounded-xl font-bold data-[state=active]:shadow-lg data-[state=active]:bg-white"
              >
                Attendance Logs
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="rounded-xl font-bold data-[state=active]:shadow-lg data-[state=active]:bg-white"
              >
                Monthly Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="history"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <div className="space-y-4">
                <DataTable
                  columns={columns}
                  data={logs}
                  keyExtractor={(row) => row.id}
                  emptyMessage="No time events recorded yet."
                />
              </div>
            </TabsContent>

            <TabsContent
              value="summary"
              className="focus-visible:ring-0 focus-visible:outline-none"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    label: 'Present Days',
                    value: '0',
                    color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
                    icon: Calendar,
                  },
                  {
                    label: 'Late Arrivals',
                    value: '0',
                    color: 'text-amber-700 bg-amber-50 border-amber-100',
                    icon: Clock,
                  },
                  {
                    label: 'Worked Hours',
                    value: '0h',
                    color: 'text-blue-700 bg-blue-50 border-blue-100',
                    icon: TrendingUp,
                  },
                ].map((stat, i) => (
                  <Card
                    key={i}
                    className={`border-none shadow-sm shadow-gray-200/50 p-6 flex flex-col items-center gap-3 ring-1 ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5 opacity-60" />
                    <div className="text-3xl font-black">{stat.value}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {stat.label}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Stats helper
const TrendingUp = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);
