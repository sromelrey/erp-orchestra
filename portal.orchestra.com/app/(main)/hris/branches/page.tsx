"use client";

import { MapPin } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { 
  useGetBranchesQuery, 
  useCreateBranchMutation, 
  useUpdateBranchMutation, 
  useDeleteBranchMutation 
} from "@/store/api/branchesApi";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { toast } from "sonner";
import { Branch } from "@/types";

export default function BranchesPage() {
  const { data: response, isLoading } = useGetBranchesQuery({});
  const [createBranch] = useCreateBranchMutation();
  const [updateBranch] = useUpdateBranchMutation();
  const [deleteBranch] = useDeleteBranchMutation();

  const data = response?.data || [];
  const activeCount = data.filter((d) => d.isActive).length;

  const stats: StatCard[] = [
    {
      label: "Total Branches",
      value: data.length,
      icon: MapPin,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Branches",
      value: activeCount,
      icon: MapPin,
      color: "bg-green-100 text-green-700",
    }
  ];

  const handleCreate = async (formData: Partial<Branch>) => {
    try {
      await createBranch(formData).unwrap();
      toast.success("Branch created successfully");
    } catch {
      toast.error("Failed to create branch");
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<Branch>) => {
    try {
      await updateBranch({ id, body: formData }).unwrap();
      toast.success("Branch updated successfully");
    } catch {
      toast.error("Failed to update branch");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteBranch(id).unwrap();
      toast.success("Branch deleted successfully");
    } catch {
      toast.error("Failed to delete branch");
    }
  };

  return (
    <PermissionGuard permission="hris.branch.view">
      <div className="p-6">
        <EntityManager
          entityName="Branch"
          entityNamePlural="Branches"
          data={data}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          stats={stats}
          searchPlaceholder="Search branches..."
          isLoading={isLoading}
        />
      </div>
    </PermissionGuard>
  );
}
