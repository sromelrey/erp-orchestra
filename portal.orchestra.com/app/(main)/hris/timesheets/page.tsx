'use client';

import { useEffect, useState } from 'react';
import { EntityManager, StatCard } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';
import { useGetPayPeriodsQuery } from '@/store/api/payPeriodsApi';
import {
  useGetTimesheetsQuery,
  useGetTimesheetSummaryQuery,
  useGenerateTimesheetsMutation,
  useUpdateTimesheetStatusMutation,
  TimesheetStatus,
} from '@/store/api/timesheetsApi';
import {
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  RefreshCcw,
  LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function TimesheetsPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);

  // Queries
  const { data: payPeriods = [], isLoading: loadingPeriods } = useGetPayPeriodsQuery();
  const {
    data: timesheets = [],
    isLoading: loadingTimesheets,
    refetch: refetchTimesheets,
  } = useGetTimesheetsQuery(
    { payPeriodId: selectedPeriodId as number },
    { skip: !selectedPeriodId }
  );
  const { data: summary, refetch: refetchSummary } = useGetTimesheetSummaryQuery(
    { payPeriodId: selectedPeriodId as number },
    { skip: !selectedPeriodId }
  );

  // Mutations
  const [generate] = useGenerateTimesheetsMutation();
  const [updateStatus] = useUpdateTimesheetStatusMutation();

  // Set initial period
  useEffect(() => {
    if (payPeriods.length > 0 && !selectedPeriodId) {
      setSelectedPeriodId(payPeriods[0].id);
    }
  }, [payPeriods, selectedPeriodId]);

  const handleGenerate = async () => {
    if (!selectedPeriodId) return;
    const promise = generate({ payPeriodId: selectedPeriodId }).unwrap();

    toast.promise(promise, {
      loading: 'Analyzing attendance logs...',
      success: (data) => `Successfully generated/refreshed ${data.generated} timesheets.`,
      error: 'Failed to aggregate timesheets.',
    });

    try {
      await promise;
      refetchTimesheets();
      refetchSummary();
    } catch (e) {}
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      await updateStatus({
        id: id.toString(),
        status: formData.status,
      }).unwrap();
      toast.success('Timesheet status updated successfully');
      refetchTimesheets();
      refetchSummary();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update timesheet');
      throw error;
    }
  };

  const stats: StatCard[] = [
    {
      label: 'Total Employees',
      value: summary?.total || 0,
      icon: Users as LucideIcon,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Anomalies',
      value: summary?.anomalies || 0,
      icon: AlertCircle as LucideIcon,
      color: summary?.anomalies ? 'bg-red-50 text-red-600 shadow-sm' : 'bg-gray-50 text-gray-400',
    },
    {
      label: 'Approved',
      value: summary?.approved || 0,
      icon: CheckCircle2 as LucideIcon,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Pending Review',
      value: summary?.pending || 0,
      icon: Clock as LucideIcon,
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-xl ring-1 ring-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Timesheet Directory</h2>
            <p className="text-sm text-gray-500">Aggregate daily logs into payroll periods</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-[200px]">
            <Select
              value={selectedPeriodId?.toString()}
              onValueChange={(v) => setSelectedPeriodId(parseInt(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Pay Period" />
              </SelectTrigger>
              <SelectContent>
                {payPeriods.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name} ({new Date(p.startDate).toLocaleDateString()} -{' '}
                    {new Date(p.endDate).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            variant="outline"
            className="gap-2"
            disabled={!selectedPeriodId || loadingTimesheets}
          >
            <RefreshCcw className={`h-4 w-4 ${loadingTimesheets ? 'animate-spin' : ''}`} />
            Refresh Aggregation
          </Button>
        </div>
      </div>

      <EntityManager
        entityName="Timesheet"
        entityNamePlural="Timesheets"
        data={timesheets}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        onUpdate={handleUpdate}
        stats={stats}
        isLoading={loadingTimesheets || loadingPeriods}
        searchPlaceholder="Search employees..."
        showViewButton={true}
        showEditButton={true}
        showDeleteButton={false}
        permissions={{
          update: 'hris.timesheet.manage',
          view: 'hris.timesheet.view',
        }}
      />
    </div>
  );
}
