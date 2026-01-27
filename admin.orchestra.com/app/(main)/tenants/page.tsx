"use client";

import { Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} from "@/store/api/tenantsApi";
import { toast } from "@/lib/toast";

export default function TenantsPage() {
  const { data: tenantsData, isLoading } = useGetTenantsQuery({});
  const [createTenant] = useCreateTenantMutation();
  const [updateTenant] = useUpdateTenantMutation();
  const [deleteTenant] = useDeleteTenantMutation();

  const tenants = tenantsData?.data || [];

  // Stats configuration
  const stats: StatCard[] = [
    {
      label: "Total Tenants",
      value: tenants.length,
      icon: Building2,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      value: tenants.filter((t: any) => t.status === "active").length,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pending",
      value: tenants.filter((t: any) => t.status === "pending").length,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Suspended",
      value: tenants.filter((t: any) => t.status === "suspended").length,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  // CRUD handlers
  const handleCreate = async (data: any) => {
    try {
      await createTenant(data).unwrap();
      toast.success("Tenant created successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to create tenant:", error);
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      await updateTenant({ id, body: data }).unwrap();
      toast.success("Tenant updated successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to update tenant:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteTenant(id).unwrap();
      toast.success("Tenant deleted successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to delete tenant:", error);
    }
  };

  return (
    <EntityManager
      data={tenants}
      columns={columns}
      entityName="Tenant"
      keyExtractor={(tenant) => tenant.id}
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
