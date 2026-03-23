'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { selectCurrentUser } from '@/store/slices/authSlice';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { HasPermission } from '@/components/auth/HasPermission';
import {
  useGetAllSessionsQuery,
  useRevokeUserSessionsMutation,
  AdminSession,
} from '@/store/api/sessionsApi';
import {
  Users,
  Trash2,
  Loader2,
  Clock,
  Shield,
  UserCircle,
  Activity,
  KeyRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * Format a date to a user-friendly string.
 */
function formatExpiry(dateStr: string): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AdminSessionsContent() {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);
  const { data: sessions = [], isLoading, isError } = useGetAllSessionsQuery();
  const [revokeUserSessions] = useRevokeUserSessionsMutation();

  // Track which user is currently being revoked to show row-specific loading state
  const [revokingUserId, setRevokingUserId] = React.useState<number | null>(null);

  // Group sessions by user
  const sessionsByUser = React.useMemo(() => {
    if (!sessions) return [];

    const grouped = new Map<
      number,
      {
        user: AdminSession['user'];
        sessions: AdminSession[];
      }
    >();

    for (const session of sessions) {
      const existing = grouped.get(session.user.id);
      if (existing) {
        existing.sessions.push(session);
      } else {
        grouped.set(session.user.id, {
          user: session.user,
          sessions: [session],
        });
      }
    }

    return Array.from(grouped.values()).sort((a, b) =>
      (a.user.lastName || '').localeCompare(b.user.lastName || '')
    );
  }, [sessions]);

  // Page stats following EntityManager pattern
  const stats = [
    {
      label: 'Total Active Sessions',
      value: sessions.length,
      icon: Activity,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Users with Sessions',
      value: sessionsByUser.length,
      icon: Users,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      label: 'System Admins',
      value: sessionsByUser.filter((s) => s.user.isSystemAdmin).length,
      icon: Shield,
      color: 'bg-blue-500/10 text-blue-600',
    },
  ];

  const handleRevokeUser = async (userId: number, userName: string) => {
    const isSelf = currentUser?.id === userId;
    setRevokingUserId(userId);

    try {
      await revokeUserSessions(userId).unwrap();
      toast.success(`All sessions revoked for ${userName}`);

      // If the admin just revoked their own sessions, redirect to login
      if (isSelf) {
        router.push('/login');
        return;
      }
    } catch {
      toast.error('Failed to revoke sessions');
    } finally {
      setRevokingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center text-destructive">
        <p>Failed to load active sessions. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header following EntityManager pattern */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Active Sessions Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and manage all active browser sessions across the organization
          </p>
        </div>
      </div>

      {/* Stats Cards following EntityManager pattern */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions Table grouped by user */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Active Devices & Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessionsByUser.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                  No active sessions found.
                </TableCell>
              </TableRow>
            ) : (
              sessionsByUser.map(({ user, sessions }) => (
                <TableRow key={user.id} className="align-top hover:bg-transparent">
                  <TableCell className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {user.isSystemAdmin && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            System Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="pt-4">
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-gray-600 font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            <KeyRound className="h-3 w-3" />
                            {session.id.substring(0, 8)}...
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Expires: {formatExpiry(session.expiredAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pt-4">
                    <HasPermission permission="system.session.manage">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 gap-2 shadow-sm"
                        onClick={() =>
                          handleRevokeUser(user.id, `${user.firstName} ${user.lastName}`)
                        }
                        disabled={revokingUserId === user.id}
                      >
                        {revokingUserId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Revoke All ({sessions.length})
                      </Button>
                    </HasPermission>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function AdminSessionsPage() {
  return (
    <PermissionGuard permission="system.session.view">
      <AdminSessionsContent />
    </PermissionGuard>
  );
}
