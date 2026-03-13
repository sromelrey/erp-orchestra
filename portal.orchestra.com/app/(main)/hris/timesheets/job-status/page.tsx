"use client";

import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { Activity, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  useGetJobStatusQuery,
  useTriggerCronMutation,
} from "@/store/api/timesheetsApi";
import { JobExecutionLog } from "@/store/api/timesheetsApi";

export default function JobStatusPage() {
  const { data: jobStatusData, isLoading, refetch } = useGetJobStatusQuery();
  const [triggerCron, { isLoading: isTriggering }] = useTriggerCronMutation();

  // Calculate stats
  const stats: StatCard[] = [
    {
      label: "Total Jobs",
      value: jobStatusData?.length || 0,
      icon: Activity,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Successful",
      value:
        jobStatusData?.filter(
          (job: JobExecutionLog) => job.status === "SUCCESS",
        ).length || 0,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Failed",
      value:
        jobStatusData?.filter((job: JobExecutionLog) => job.status === "FAILED")
          .length || 0,
      icon: AlertCircle,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Partial",
      value:
        jobStatusData?.filter(
          (job: JobExecutionLog) => job.status === "PARTIAL",
        ).length || 0,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const handleTriggerCron = async () => {
    try {
      await triggerCron().unwrap();
      toast.success("Timesheet generation triggered successfully");
      refetch(); // Refresh the data
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to trigger timesheet generation";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Timesheet Job Status</h1>
          <p className="text-muted-foreground">
            Monitor automated timesheet generation jobs and their execution
            status
          </p>
        </div>
        <button
          onClick={handleTriggerCron}
          disabled={isTriggering}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isTriggering ? "Triggering..." : "Trigger Manual Generation"}
        </button>
      </div>

      <EntityManager
        entityName="Job Execution"
        entityNamePlural="Job Executions"
        data={jobStatusData || []}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        stats={stats}
        isLoading={isLoading}
        searchPlaceholder="Search job executions..."
        // Disable CRUD operations for job logs (read-only)
        showViewButton={true}
        showEditButton={false}
        showDeleteButton={false}
        // Override create button to show manual trigger
        onCreate={handleTriggerCron}
      />
    </div>
  );
}
