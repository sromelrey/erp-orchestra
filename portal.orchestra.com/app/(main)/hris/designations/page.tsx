"use client";

import { Briefcase } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { 
  useGetDesignationsQuery, 
  useCreateDesignationMutation, 
  useUpdateDesignationMutation, 
  useDeleteDesignationMutation 
} from "@/store/api/designationsApi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { toast } from "sonner";
import { Designation } from "@/types";

export default function DesignationsPage() {
  const { data: response, isLoading } = useGetDesignationsQuery({});
  const [createDesignation] = useCreateDesignationMutation();
  const [updateDesignation] = useUpdateDesignationMutation();
  const [deleteDesignation] = useDeleteDesignationMutation();

  const data = response?.data || [];
  const activeCount = data.filter(d => d.isActive).length;

  const stats: StatCard[] = [
    {
      label: "Total Designations",
      value: data.length,
      icon: Briefcase,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Designations",
      value: activeCount,
      icon: Briefcase,
      color: "bg-green-100 text-green-700",
    }
  ];

  const handleCreate = async (formData: Partial<Designation> & { is_active?: boolean | string; level?: string | number }) => {
    try {
      delete formData.isActive; // In case it's passed from form
      // Parse level to integer if it exists
      if (formData.level !== undefined && formData.level !== '') {
        formData.level = typeof formData.level === 'string' ? parseInt(formData.level, 10) : formData.level;
      } else {
        delete formData.level; // remove if empty string
      }
      await createDesignation(formData).unwrap();
      toast.success("Designation created successfully");
    } catch {
      toast.error("Failed to create designation");
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<Designation> & { is_active?: boolean | string; level?: string | number }) => {
    try {
      delete formData.isActive;
      if (formData.level !== undefined && formData.level !== '') {
        formData.level = typeof formData.level === 'string' ? parseInt(formData.level, 10) : formData.level;
      } else {
        delete formData.level;
      }
      await updateDesignation({ id, body: formData }).unwrap();
      toast.success("Designation updated successfully");
    } catch {
      toast.error("Failed to update designation");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteDesignation(id).unwrap();
      toast.success("Designation deleted successfully");
    } catch {
      toast.error("Failed to delete designation");
    }
  };

  return (
    <PermissionGuard permission="hris.designation.view">
      <div className="p-6">
        <EntityManager
          entityName="Designation"
          entityNamePlural="Designations"
          data={data}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          stats={stats}
          searchPlaceholder="Search designations..."
          isLoading={isLoading}
        />
      </div>
    </PermissionGuard>
  );
}
