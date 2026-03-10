"use client";

import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { CalendarRange, CalendarClock, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { 
  useGetPayPeriodsQuery, 
  useCreatePayPeriodMutation, 
  useUpdatePayPeriodMutation, 
  useDeletePayPeriodMutation,
  PayPeriodStatus 
} from "@/store/api/payPeriodsApi";

export default function PayPeriodsPage() {
  const { data: payPeriods = [], isLoading, refetch } = useGetPayPeriodsQuery();
  const [createPeriod] = useCreatePayPeriodMutation();
  const [updatePeriod] = useUpdatePayPeriodMutation();
  const [deletePeriod] = useDeletePayPeriodMutation();

  const openPeriods = payPeriods.filter(p => p.status === PayPeriodStatus.OPEN).length;
  const processingPeriods = payPeriods.filter(p => p.status === PayPeriodStatus.PROCESSING).length;

  const stats: StatCard[] = [
    {
      label: "Total Pay Periods",
      value: payPeriods.length,
      icon: CalendarRange,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Open Periods",
      value: openPeriods,
      icon: CalendarClock,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Processing",
      value: processingPeriods,
      icon: DollarSign,
      color: "bg-amber-100 text-amber-800",
    },
  ];

  const handleCreate = async (formData: any) => {
    try {
      await createPeriod(formData).unwrap();
      toast.success("Pay Period created successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create pay period");
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      await updatePeriod({ id, body: formData }).unwrap();
      toast.success("Pay Period updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update pay period");
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deletePeriod(id).unwrap();
      toast.success("Pay Period deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete pay period");
      throw error;
    }
  };

  return (
    <EntityManager
      entityName="Pay Period"
      entityNamePlural="Pay Periods"
      data={payPeriods}
      columns={columns}
      formFields={formFields}
      keyExtractor={(item) => item.id}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      permissions={{
        create: "hris.payroll.manage",
        update: "hris.payroll.manage",
        delete: "hris.payroll.manage",
        view: "hris.payroll.view",
      }}
      isLoading={isLoading}
    />
  );
}
