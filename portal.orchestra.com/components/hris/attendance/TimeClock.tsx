'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  useGetAttendanceStatusQuery,
  useClockInMutation,
  useClockOutMutation,
} from '@/store/api/attendanceApi';
import { Loader2, MapPin, Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getErrorMessage } from '@/types';

export const TimeClock = () => {
  const { data: status, isLoading } = useGetAttendanceStatusQuery();
  const [clockIn, { isLoading: isClockingIn }] = useClockInMutation();
  const [clockOut, { isLoading: isClockingOut }] = useClockOutMutation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockAction = async (action: 'IN' | 'OUT') => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Basic location capture (optional but good practice)
      let location = undefined;
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
            });
          });
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
        } catch (e) {
          console.warn('Geolocation failed or denied', e);
        }
      }

      if (action === 'IN') {
        await clockIn({ location, deviceInfo: navigator.userAgent }).unwrap();
        toast.success('Successfully clocked in!');
      } else {
        await clockOut({ location, deviceInfo: navigator.userAgent }).unwrap();
        toast.success('Successfully clocked out!');
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err) || 'Failed to record attendance');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  const isClockedIn = status?.status === 'CLOCKED_IN';

  return (
    <Card className="w-full overflow-hidden border-none shadow-xl bg-linear-to-br from-background to-accent/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              Time Clock
            </CardTitle>
            <CardDescription>{format(currentTime, 'EEEE, MMMM do, yyyy')}</CardDescription>
          </div>
          <Badge variant={isClockedIn ? 'default' : 'secondary'} className="px-3 py-1">
            {isClockedIn ? 'Clocked In' : 'Clocked Out'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4 pb-8 space-y-6">
        <div className="flex flex-col items-center justify-center py-6 border-y border-border/50 bg-background/40 backdrop-blur-sm rounded-xl">
          <span className="text-5xl font-black tracking-tighter text-primary">
            {format(currentTime, 'pp')}
          </span>
          {isClockedIn && status.clockedInAt && (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              Clocked in at {format(new Date(status.clockedInAt), 'p')}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            size="lg"
            variant={isClockedIn ? 'outline' : 'default'}
            className="h-16 text-lg font-semibold group relative overflow-hidden transition-all hover:scale-[1.02]"
            disabled={isClockedIn || isClockingIn || isProcessing}
            onClick={() => handleClockAction('IN')}
          >
            {isClockingIn || (isProcessing && !isClockedIn) ? (
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
            ) : (
              <LogIn className="h-6 w-6 mr-2 transition-transform group-hover:translate-x-1" />
            )}
            Clock In
            {!isClockedIn && (
              <span className="absolute inset-0 bg-primary/10 animate-pulse-slow pointer-events-none" />
            )}
          </Button>

          <Button
            size="lg"
            variant={isClockedIn ? 'destructive' : 'outline'}
            className="h-16 text-lg font-semibold group transition-all hover:scale-[1.02]"
            disabled={!isClockedIn || isClockingOut || isProcessing}
            onClick={() => handleClockAction('OUT')}
          >
            {isClockingOut || (isProcessing && isClockedIn) ? (
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
            ) : (
              <LogOut className="h-6 w-6 mr-2 transition-transform group-hover:translate-x-1" />
            )}
            Clock Out
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center italic">
          <MapPin className="h-3 w-3" />
          Location services enabled for accuracy
        </div>
      </CardContent>
    </Card>
  );
};
