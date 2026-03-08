"use client";

import { Building2 } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { 
  useGetDepartmentsQuery, 
  useCreateDepartmentMutation, 
  useUpdateDepartmentMutation, 
  useDeleteDepartmentMutation 
} from "@/store/api/departmentsApi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { toast } from "sonner";

export default function DepartmentsPage() {
  const { data: response, isLoading } = useGetDepartmentsQuery({});
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const data = response?.data || [];
  const activeCount = data.length; // Departments don't have is_active on backend yet

  const stats: StatCard[] = [
    {
      label: "Total Departments",
      value: data.length,
      icon: Building2,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Departments",
      value: activeCount,
      icon: Building2,
      color: "bg-green-100 text-green-700",
    }
  ];

  const handleCreate = async (formData: any) => {
    try {
      // is_active is dropped because the backend CreateDepartmentDto does not accept it
      delete formData.is_active;
      await createDepartment(formData).unwrap();
      toast.success("Department created successfully");
    } catch (error) {
      toast.error("Failed to create department");
    }
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      delete formData.is_active;
      await updateDepartment({ id, body: formData }).unwrap();
      toast.success("Department updated successfully");
    } catch (error) {
      toast.error("Failed to update department");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteDepartment(id).unwrap();
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Failed to delete department");
    }
  };

  return (
    <PermissionGuard permission="hris.department.view">
      <div className="p-6">
        <EntityManager
          entityName="Department"
          entityNamePlural="Departments"
          data={data}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          stats={stats}
          searchPlaceholder="Search departments..."
          isLoading={isLoading}
        />
      </div>
    </PermissionGuard>
  );
}
