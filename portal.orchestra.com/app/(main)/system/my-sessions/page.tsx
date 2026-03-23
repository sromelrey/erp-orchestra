'use client';

import React from 'react';
import { useGetMySessionsQuery, useRevokeMySessionMutation } from '@/store/api/sessionsApi';
import { Monitor, Smartphone, Globe, Trash2, ShieldCheck, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Guess a friendly device name from a user-agent string.
 * Falls back to "Unknown Device" when we cannot determine.
 */
function getDeviceLabel(ua?: string): { label: string; icon: typeof Monitor } {
  if (!ua) return { label: 'Unknown Device', icon: Globe };
  const lower = ua.toLowerCase();
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('iphone')) {
    return { label: 'Mobile Device', icon: Smartphone };
  }
  return { label: 'Desktop / Browser', icon: Monitor };
}

/**
 * Format a date to a user-friendly relative / absolute string.
 */
function formatExpiry(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MySessionsPage() {
  const { data: sessions, isLoading, isError } = useGetMySessionsQuery();
  const [revokeSession, { isLoading: isRevoking }] = useRevokeMySessionMutation();

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeSession(sessionId).unwrap();
      toast.success('Session revoked successfully');
    } catch {
      toast.error('Failed to revoke session');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Sessions</h1>
        <p className="text-gray-500">View and manage your active sessions across devices.</p>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            Failed to load sessions. Please try again.
          </div>
        )}

        {sessions && sessions.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-gray-500">
            No active sessions found.
          </div>
        )}

        {sessions?.map((session) => {
          const device = getDeviceLabel(session.userAgent);
          const DeviceIcon = device.icon;

          return (
            <div
              key={session.id}
              className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border ${
                session.current ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Left: Device info */}
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-lg p-3 ${session.current ? 'bg-emerald-50' : 'bg-gray-50'}`}
                  >
                    <DeviceIcon
                      className={`h-6 w-6 ${
                        session.current ? 'text-emerald-600' : 'text-gray-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{device.label}</span>
                      {session.current && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <ShieldCheck className="h-3 w-3" />
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Expires: {formatExpiry(session.expiredAt)}
                      </span>
                      {session.ip && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5" />
                          {session.ip}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 font-mono truncate max-w-md">
                      ID: {session.id.slice(0, 16)}…
                    </p>
                  </div>
                </div>

                {/* Right: Revoke button */}
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    onClick={() => handleRevoke(session.id)}
                    disabled={isRevoking}
                  >
                    {isRevoking ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
