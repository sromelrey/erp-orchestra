'use client';

import React, { useMemo } from 'react';
import {
  useGetMyLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
  useGetLeaveTypesQuery,
  LeaveRequest,
} from '@/store/api/leaveApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Info } from 'lucide-react';
import { toast } from '@/lib/toast';
import EntityManager from '@/components/entity-manager/EntityManager';
import { columns } from './columns';
import { getFormFields } from './form-fields';

export default function MyLeavesPage() {
  const { data: requests = [], isLoading, error: fetchError } = useGetMyLeaveRequestsQuery();
  const { data: leaveTypes = [] } = useGetLeaveTypesQuery();
  const [createRequest] = useCreateLeaveRequestMutation();

  const formFields = useMemo(() => getFormFields(leaveTypes), [leaveTypes]);

  const handleCreate = async (data: Partial<LeaveRequest>) => {
    try {
      await createRequest(data).unwrap();
      toast.success('Leave request submitted successfully');
    } catch (err: unknown) {
      toast.error(err as string);
    }
  };

  const recentStats = useMemo(
    () => [
      {
        label: 'Pending Approval',
        count: requests?.filter((r) => r.status === 'PENDING').length || 0,
        color: 'text-amber-600 bg-amber-500/10',
      },
      {
        label: 'Approved',
        count: requests?.filter((r) => r.status === 'APPROVED').length || 0,
        color: 'text-primary bg-primary/10',
      },
      { label: 'Taken', count: 0, color: 'text-blue-600 bg-blue-500/10' },
    ],
    [requests]
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar: Balances & Stats */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <Card className="border-none shadow-xl bg-gray-900 text-white overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Info className="h-24 w-24 -mr-8 -mt-8" />
            </div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Leave Balances</CardTitle>
              <CardDescription className="text-gray-400">
                Available for {new Date().getFullYear()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveTypes?.map((type) => (
                <div
                  key={type.id}
                  className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm"
                >
                  <span className="text-sm font-medium">{type.name}</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary text-primary-foreground hover:bg-primary font-bold px-2.5"
                  >
                    {type.defaultDaysPerYear} Days
                  </Badge>
                </div>
              ))}
              {(!leaveTypes || leaveTypes.length === 0) && (
                <div className="text-xs text-white/50 italic text-center py-4">
                  No leave types configured.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm shadow-gray-200/50 bg-white p-6 ring-1 ring-gray-100">
            <h4 className="font-bold flex items-center gap-2 mb-4 text-gray-900">
              <Clock className="h-4 w-4 text-primary" />
              Quick Summary
            </h4>
            <div className="space-y-4">
              {recentStats.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.color}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 flex items-start gap-3">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-primary shrink-0 shadow-sm ring-1 ring-primary/10">
              <Info className="h-4 w-4" />
            </div>
            <div className="text-[11px] text-gray-600 leading-relaxed font-medium">
              Select a leave type and duration. Your request will be routed to your manager for
              approval.
            </div>
          </div>
        </div>

        {/* Main Content: Entity Manager */}
        <div className="lg:col-span-3">
          <EntityManager
            data={requests}
            entityName="Leave Request"
            entityNamePlural="My Leaves"
            columns={columns}
            formFields={formFields}
            isLoading={isLoading}
            error={fetchError?.toString()}
            onCreate={handleCreate}
            keyExtractor={(item) => item.id}
            searchPlaceholder="Search your requests..."
            // Disable Edit/Delete for submitted requests for now
            showEditButton={false}
            showDeleteButton={false}
            permissions={{
              create: 'hris.leave.request',
              view: 'hris.leave.request',
            }}
          />
        </div>
      </div>
    </div>
  );
}
