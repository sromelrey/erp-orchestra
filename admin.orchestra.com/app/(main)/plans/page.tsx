"use client";

import { CreditCard, Tag, Users } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from "@/store/api/plansApi";

import { toast } from "@/lib/toast";

export default function PlansPage() {
  const { data: plansData, isLoading } = useGetPlansQuery({});
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const plans = plansData?.data || [];

  // Stats configuration
  const stats: StatCard[] = [
    {
      label: "Total Plans",
      value: plans.length,
      icon: CreditCard,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Avg. Price",
      value: plans.length
        ? `$${(
            plans.reduce((acc: number, curr: any) => acc + Number(curr.monthlyPrice), 0) /
            plans.length
          ).toFixed(2)}`
        : "$0.00",
      icon: Tag,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total Capacity",
      value: plans.reduce((acc: number, curr: any) => acc + Number(curr.maxUsers), 0),
      icon: Users,
      color: "bg-amber-100 text-amber-600",
    },
  ];

  // CRUD handlers
  const handleCreate = async (data: any) => {
    try {
      // Ensure numbers are numbers
      const payload = {
        ...data,
        monthlyPrice: Number(data.monthlyPrice),
        maxUsers: Number(data.maxUsers),
      };
      await createPlan(payload).unwrap();
      toast.success("Plan created successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to create plan:", error);
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
       // Ensure numbers are numbers
       const payload = {
        ...data,
        monthlyPrice: Number(data.monthlyPrice),
        maxUsers: Number(data.maxUsers),
      };
      await updatePlan({ id, body: payload }).unwrap();
      toast.success("Plan updated successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to update plan:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deletePlan(id).unwrap();
      toast.success("Plan deleted successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to delete plan:", error);
    }
  };

  return (
    <EntityManager
      data={plans}
      columns={columns}
      entityName="Plan"
      keyExtractor={(plan) => plan.id}
      formFields={formFields}
      stats={stats}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      showViewButton={true}
      showEditButton={true}
      showDeleteButton={true}
      isLoading={isLoading}
    />
  );
}
