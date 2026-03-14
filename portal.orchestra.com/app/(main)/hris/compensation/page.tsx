"use client";

import { useState } from "react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { DollarSign, TrendingUp, Calendar, Users } from "lucide-react";
import { toast } from "@/lib/toast";
import {
  useGetEmployeeCompensationQuery,
  useCreateEmployeeCompensationMutation,
  useUpdateEmployeeCompensationMutation,
  useDeleteEmployeeCompensationMutation,
} from "@/store/api/compensationApi";
import {
  EmployeeCompensation,
  CreateCompensationDto,
  UpdateCompensationDto,
} from "@/store/api/compensationApi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";

export default function CompensationPage() {
  // For now, we'll use a fixed employee ID. In a real implementation,
  // this would come from a selector or state management
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(1);

  const {
    data: compensationData,
    isLoading,
    refetch,
  } = useGetEmployeeCompensationQuery(selectedEmployeeId);
  const [createCompensation] = useCreateEmployeeCompensationMutation();
  const [updateCompensation] = useUpdateEmployeeCompensationMutation();
  const [deleteCompensation] = useDeleteEmployeeCompensationMutation();

  // Use compensationData directly instead of local state
  const data = compensationData || [];

  // Calculate stats
  const stats: StatCard[] = [
    {
      label: "Total Records",
      value: data.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Compensation",
      value: data.filter((item) => item.isActive).length,
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Inactive Records",
      value: data.filter((item) => !item.isActive).length,
      icon: Calendar,
      color: "bg-gray-100 text-gray-600",
    },
    {
      label: "Total Base Salary",
      value: data.reduce((sum, item) => sum + (item.baseSalary || 0), 0),
      icon: DollarSign,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  // CRUD Handlers
  const handleCreate = async (formData: Record<string, unknown>) => {
    try {
      const compensationData: CreateCompensationDto = {
        baseSalary: formData.baseSalary as number | undefined,
        hourlyRate: formData.hourlyRate as number | undefined,
        overtimeRate: formData.overtimeRate as number | undefined,
        effectiveDate: formData.effectiveDate as string,
        endDate: formData.endDate as string | undefined,
        currency: formData.currency as string,
        paymentFrequency: formData.paymentFrequency as string,
        changeReason: formData.changeReason as string | undefined,
      };

      await createCompensation({
        employeeId: selectedEmployeeId,
        body: compensationData,
      }).unwrap();

      toast.success("Compensation record created successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create compensation record";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async (
    id: string | number,
    formData: Record<string, unknown>,
  ) => {
    try {
      const compensationData: UpdateCompensationDto = {
        baseSalary: formData.baseSalary as number | undefined,
        hourlyRate: formData.hourlyRate as number | undefined,
        overtimeRate: formData.overtimeRate as number | undefined,
        effectiveDate: formData.effectiveDate as string | undefined,
        endDate: formData.endDate as string | undefined,
        currency: formData.currency as string | undefined,
        paymentFrequency: formData.paymentFrequency as string | undefined,
        changeReason: formData.changeReason as string | undefined,
      };

      await updateCompensation({
        employeeId: selectedEmployeeId,
        id: Number(id),
        body: compensationData,
      }).unwrap();

      toast.success("Compensation record updated successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update compensation record";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteCompensation({
        employeeId: selectedEmployeeId,
        id: Number(id),
      }).unwrap();

      toast.success("Compensation record deleted successfully");
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete compensation record";
      toast.error(errorMessage);
    }
  };

  return (
    <PermissionGuard permission="hris.compensation.view">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Compensation Management</h1>
            <p className="text-muted-foreground">
              Manage employee compensation records and salary structures
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
          entityName="Compensation Record"
          entityNamePlural="Compensation Records"
          data={data}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          stats={stats}
          isLoading={isLoading}
          searchPlaceholder="Search compensation records..."
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
