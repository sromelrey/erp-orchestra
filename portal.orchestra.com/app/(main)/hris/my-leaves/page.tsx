'use client';

import React, { useState } from 'react';
import { 
  useGetMyLeaveRequestsQuery, 
  useCreateLeaveRequestMutation,
  useGetLeaveTypesQuery 
} from '@/store/api/leaveApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Send, Calendar, Clock, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';
import { SliderForm } from '@/components/ui/slider-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function MyLeavesPage() {
  const { data: requests, isLoading } = useGetMyLeaveRequestsQuery();
  const { data: leaveTypes } = useGetLeaveTypesQuery();
  const [createRequest, { isLoading: isSubmitting }] = useCreateLeaveRequestMutation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmitAction = () => {
    handleSubmit();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      if (!formData.leaveTypeId || !formData.startDate || !formData.endDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      await createRequest({
        leaveTypeId: parseInt(formData.leaveTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      }).unwrap();

      toast.success('Leave request submitted successfully');
      setIsFormOpen(false);
      setFormData({ leaveTypeId: '', startDate: '', endDate: '', reason: '' });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || 'Failed to submit request');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-background/50 backdrop-blur-md p-6 rounded-2xl border border-border/50 shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <span className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Calendar className="h-6 w-6" />
            </span>
            My Leaves
          </h1>
          <p className="text-muted-foreground mt-1">Submit and track your leave applications.</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="rounded-full px-6 h-12 text-md font-semibold gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Balances Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-xl bg-primary text-primary-foreground overflow-hidden h-fit">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Info className="h-24 w-24 -mr-8 -mt-8" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Leave Balances</CardTitle>
              <CardDescription className="text-primary-foreground/70">Available for 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {leaveTypes?.map((type) => (
                <div key={type.id} className="flex justify-between items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium">{type.name}</span>
                  <Badge variant="secondary" className="bg-white text-primary hover:bg-white font-bold px-2.5">
                    {type.defaultDaysPerYear} Days
                  </Badge>
                </div>
              ))}
              {(!leaveTypes || leaveTypes.length === 0) && (
                <div className="text-xs text-primary-foreground/50 italic text-center py-4">
                  No leave types configured.
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="bg-accent/30 rounded-2xl p-6 border border-border/50">
            <h4 className="font-bold flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-primary" />
              Recent Status
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Pending Approval', count: requests?.filter(r => r.status === 'PENDING').length || 0, color: 'text-amber-600 bg-amber-500/10' },
                { label: 'Approved', count: requests?.filter(r => r.status === 'APPROVED').length || 0, color: 'text-primary bg-primary/10' },
                { label: 'Taken', count: 0, color: 'text-blue-600 bg-blue-500/10' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="lg:col-span-3">
          {requests && requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge variant="outline" className="mb-2 bg-background">
                          {request.leaveType?.name}
                        </Badge>
                        <CardTitle className="text-lg font-bold">
                          {format(new Date(request.startDate), 'MMM do')} — {format(new Date(request.endDate), 'MMM do')}
                        </CardTitle>
                      </div>
                      <Badge 
                        variant={
                          request.status === 'PENDING' ? 'secondary' : 
                          request.status === 'APPROVED' ? 'default' : 
                          request.status === 'REJECTED' ? 'destructive' : 'outline'
                        }
                        className="px-2.5 py-1"
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                      "{request.reason || 'No reason provided'}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                       <span>Applied on {format(new Date(request.createdAt), 'PP')}</span>
                       {request.approvedAt && (
                         <span className="flex items-center gap-1 text-primary font-medium">
                           <Clock className="h-3 w-3" />
                           Processed on {format(new Date(request.approvedAt), 'MMM do')}
                         </span>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/10 rounded-2xl border-2 border-dashed border-border py-20 flex flex-col items-center justify-center text-center px-6">
              <div className="h-16 w-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-muted-foreground/30" />
              </div>
              <h3 className="text-xl font-bold text-muted-foreground">No Leave Requests</h3>
              <p className="text-sm text-muted-foreground/70 mt-2 max-w-xs">
                You haven't submitted any leave applications yet. Click the button above to start.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Leave Form */}
      <SliderForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title="Submit Leave Request"
        description="Fill in the details below to request for a leave"
        onSubmit={handleSubmitAction}
        isLoading={isSubmitting}
        submitLabel="Submit Application"
      >
        <div className="grid gap-6 py-6 px-10">
          <div className="space-y-2">
            <Label htmlFor="leaveTypeId">Leave Type</Label>
            <Select 
              onValueChange={(val) => setFormData({ ...formData, leaveTypeId: val })}
              value={formData.leaveTypeId}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Input
                  id="startDate"
                  type="date"
                  className="h-12 rounded-xl"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                className="h-12 rounded-xl"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason / Description</Label>
            <Textarea
              id="reason"
              placeholder="Briefly explain the reason for your leave request..."
              className="min-h-[120px] rounded-xl resize-none"
              value={formData.reason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex items-start gap-3">
             <div className="h-8 w-8 bg-background rounded-lg flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Info className="h-4 w-4" />
             </div>
             <div className="text-xs text-muted-foreground leading-relaxed">
               By submitting this request, it will be sent to your immediate manager for review. You will be notified once a decision has been made.
             </div>
          </div>
        </div>
      </SliderForm>
    </div>
  );
}
