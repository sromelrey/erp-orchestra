'use client';

import React from 'react';
import { TimeClock } from '@/components/hris/attendance/TimeClock';
import { useGetAttendanceStatusQuery, useGetAttendanceLogsQuery } from '@/store/api/attendanceApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, LogIn, LogOut, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function AttendancePage() {
  const { data: logs = [], isLoading: isLoadingLogs } = useGetAttendanceLogsQuery();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground text-lg">Manage your daily time logs and attendance history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TimeClock />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 p-1">
              <TabsTrigger value="history">Attendance Logs</TabsTrigger>
              <TabsTrigger value="summary">Monthly Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingLogs ? (
                    <div className="p-8 text-center text-muted-foreground flex items-center justify-center">
                      <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full flex-shrink-0" />
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="h-6 w-6 opacity-20" />
                      </div>
                      <p>No attendance logs found for this period.</p>
                      <p className="text-xs">Your clock-in and clock-out events will appear here.</p>
                    </div>
                  ) : (
                    <div className="divide-y max-h-[400px] overflow-y-auto">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${log.type === 'CLOCK_IN' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                              {log.type === 'CLOCK_IN' ? <LogIn className="h-5 w-5" /> : <LogOut className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{log.type === 'CLOCK_IN' ? 'Clocked In' : 'Clocked Out'}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(log.timestamp), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{format(new Date(log.timestamp), 'h:mm a')}</p>
                            {log.location && (
                              <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                <MapPin className="h-3 w-3" />
                                Location recorded
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="summary">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Present Days</div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-500/5 text-center">
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Late Arrivals</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/5 text-center">
                      <div className="text-2xl font-bold">0h</div>
                      <div className="text-xs text-muted-foreground">Total Hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Helper icons
const Clock = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
