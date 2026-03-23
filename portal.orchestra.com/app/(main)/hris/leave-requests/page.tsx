'use client';

import React, { useMemo, useState } from 'react';
import {
  useGetLeaveRequestsQuery,
  useUpdateLeaveRequestStatusMutation,
} from '@/store/api/leaveApi';
import EntityManager from '@/components/entity-manager/EntityManager';
import { columns as baseColumns } from './column';
import { formFields } from './form-fields';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SliderForm } from '@/components/ui/slider-form';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

export default function LeaveRequestsPage() {
  const { data: requests, isLoading, error } = useGetLeaveRequestsQuery({});
  const [updateStatus, { isLoading: isUpdating }] = useUpdateLeaveRequestStatusMutation();

  // Local state for the custom review modal
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [comment, setComment] = useState('');

  const data = requests || [];

  // Calculate statistics
  const stats = useMemo(
    () => [
      {
        label: 'Pending Requests',
        value: data.filter((r: any) => r.status === 'PENDING').length,
        icon: Clock,
        color: 'bg-amber-100 text-amber-700',
      },
      {
        label: 'Approved Today',
        value: data.filter((r: any) => r.status === 'APPROVED').length, // Simplified for demo
        icon: CheckCircle,
        color: 'bg-emerald-100 text-emerald-700',
      },
      {
        label: 'Rejected',
        value: data.filter((r: any) => r.status === 'REJECTED').length,
        icon: XCircle,
        color: 'bg-red-100 text-red-700',
      },
    ],
    [data]
  );

  const handleReview = (request: any) => {
    setSelectedRequest(request);
    setComment('');
    setIsReviewOpen(true);
  };

  const processStatus = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateStatus({
        id: selectedRequest.id,
        status,
        comment,
      }).unwrap();
      toast.success(`Request ${status.toLowerCase()}ed successfully`);
      setIsReviewOpen(false);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update request');
    }
  };

  // Enhance columns with a specific "Review" button in the actions
  const columns = useMemo(
    () => [
      ...baseColumns,
      {
        header: 'Actions',
        className: 'text-right',
        cell: (item: any) =>
          item.status === 'PENDING' ? (
            <Button variant="ghost" size="sm" onClick={() => handleReview(item)}>
              Review
            </Button>
          ) : null,
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <EntityManager
        entityName="Leave Request"
        entityNamePlural="Leave Requests"
        data={data}
        isLoading={isLoading}
        error={error ? 'Failed to fetch leave requests' : null}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item: any) => item.id}
        stats={stats}
        showViewButton={false} // Customizing buttons for workflow
        showEditButton={false}
        showDeleteButton={false}
        searchPlaceholder="Search requests by employee..."
        permissions={{
          view: 'hris.leave.manage',
        }}
      />

      {/* Specific Review Modal - Unique to this workflow */}
      <SliderForm
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        title="Review Leave Request"
        description="Review the details and provide a decision"
        footer={<div />} // Custom buttons inside content
      >
        {selectedRequest && (
          <div className="space-y-6 p-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Employee</span>
                <span className="text-sm font-semibold">
                  {selectedRequest.employee?.firstName} {selectedRequest.employee?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Leave Type</span>
                <Badge variant="outline">{selectedRequest.leaveType?.name}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Dates</span>
                <span className="text-sm">
                  {format(new Date(selectedRequest.startDate), 'PPP')} to{' '}
                  {format(new Date(selectedRequest.endDate), 'PPP')}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Reason
                </span>
                <p className="text-sm mt-1">{selectedRequest.reason || 'No reason provided'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Approver Comments</label>
              <Textarea
                placeholder="Add comments for the employee..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="outline"
                className="gap-2 h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isUpdating}
                onClick={() => processStatus('REJECTED')}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
              <Button
                className="gap-2 h-11"
                disabled={isUpdating}
                onClick={() => processStatus('APPROVED')}
              >
                <CheckCircle className="h-4 w-4" />
                Approve Request
              </Button>
            </div>
          </div>
        )}
      </SliderForm>
    </div>
  );
}
