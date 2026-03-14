"use client";

import { useState } from "react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { TrendingUp, Calendar, Target, DollarSign } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  useGetEmployeeDeductionsQuery,
  useCreateEmployeeDeductionMutation,
  useUpdateEmployeeDeductionMutation,
  useDeleteEmployeeDeductionMutation,
  EmployeeDeduction,
  CreateDeductionDto,
  UpdateDeductionDto,
  DeductionType,
  DeductionFrequency,
} from "@/store/api/compensationApi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export default function DeductionsPage() {
  // For now, we'll use a fixed employee ID. In a real implementation,
  // this would come from a selector or state management
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(1);

  const {
    data: deductionsData,
    isLoading,
    refetch,
  } = useGetEmployeeDeductionsQuery(selectedEmployeeId);
  const [createDeduction] = useCreateEmployeeDeductionMutation();
  const [updateDeduction] = useUpdateEmployeeDeductionMutation();
  const [deleteDeduction] = useDeleteEmployeeDeductionMutation();

  // Use deductionsData directly instead of local state
  const data = deductionsData || [];

  // Calculate stats
  const stats: StatCard[] = [
    {
      label: "Total Deductions",
      value: data.length,
      icon: Target,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Deductions",
      value: data.filter((item) => item.isActive).length,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Inactive Deductions",
      value: data.filter((item) => !item.isActive).length,
      icon: Calendar,
      color: "bg-gray-100 text-gray-600",
    },
    {
      label: "Total Deduction Amount",
      value: data.reduce((sum, item) => sum + (item.amount || 0), 0),
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // CRUD Handlers
  const handleCreate = async (formData: Record<string, unknown>) => {
    try {
      const deductionData: CreateDeductionDto = {
        name: formData.name as string,
        type: formData.type as DeductionType,
        amount: formData.amount as number | undefined,
        percentage: formData.percentage as number | undefined,
        frequency: formData.frequency as DeductionFrequency,
        effectiveDate: formData.effectiveDate as string,
        endDate: formData.endDate as string | undefined,
        description: formData.description as string | undefined,
      };

      await createDeduction({
        employeeId: selectedEmployeeId,
        body: deductionData,
      }).unwrap();

      toast.success("Deduction record created successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create deduction record";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async (
    id: string | number,
    formData: Record<string, unknown>,
  ) => {
    try {
      const deductionData: UpdateDeductionDto = {
        name: formData.name as string | undefined,
        type: formData.type as DeductionType | undefined,
        amount: formData.amount as number | undefined,
        percentage: formData.percentage as number | undefined,
        frequency: formData.frequency as DeductionFrequency | undefined,
        effectiveDate: formData.effectiveDate as string | undefined,
        endDate: formData.endDate as string | undefined,
        description: formData.description as string | undefined,
      };

      await updateDeduction({
        employeeId: selectedEmployeeId,
        id: Number(id),
        body: deductionData,
      }).unwrap();

      toast.success("Deduction record updated successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update deduction record";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteDeduction({
        employeeId: selectedEmployeeId,
        id: Number(id),
      }).unwrap();

      toast.success("Deduction record deleted successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete deduction record";
      toast.error(errorMessage);
    }
  };

  return (
    <PermissionGuard permission="hris.compensation.view">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Deductions Management</h1>
            <p className="text-muted-foreground">
              Manage employee deduction records and payroll deductions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Employee 1</option>
              <option value={2}>Employee 2</option>
              <option value={3}>Employee 3</option>
            </select>
          </div>
        </div>

        <EntityManager
          entityName="Deduction Record"
          entityNamePlural="Deduction Records"
          data={data}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          stats={stats}
          isLoading={isLoading}
          searchPlaceholder="Search deduction records..."
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          showViewButton={true}
          showEditButton={true}
          showDeleteButton={true}
        />
      </div>
    </PermissionGuard>
  );
}
