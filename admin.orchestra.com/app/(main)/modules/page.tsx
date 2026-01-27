"use client";

import { Package, CheckCircle2, XCircle } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields as baseFormFields } from "./form-fields";
import {
  useGetSystemModulesQuery,
  useCreateSystemModuleMutation,
  useUpdateSystemModuleMutation,
  useDeleteSystemModuleMutation,
  useGetSystemModuleOptionsQuery,
} from "@/store/api/systemModulesApi";
import { useMemo } from "react";

import { toast } from "@/lib/toast";

export default function ModulesPage() {
  const { data: modulesData, isLoading } = useGetSystemModulesQuery({});
  const { data: moduleOptions = [] } = useGetSystemModuleOptionsQuery();
  const [createModule] = useCreateSystemModuleMutation();
  const [updateModule] = useUpdateSystemModuleMutation();
  const [deleteModule] = useDeleteSystemModuleMutation();

  const modules = modulesData?.data || [];

  // Dynamic formFields with parent module options
  const formFields = useMemo(() => {
    return baseFormFields.map((field) => {
      if (field.name === "parentId") {
        return {
          ...field,
          type: "select" as const,
          placeholder: undefined,
          options: [
            { label: "None (Top-level Module)", value: "_none" },
            ...moduleOptions.map((m) => ({
              label: `${m.name} (${m.code})`,
              value: String(m.id),
            })),
          ],
        };
      }
      return field;
    });
  }, [moduleOptions]);

  // Stats configuration
  const stats: StatCard[] = [
    {
      label: "Total Modules",
      value: modules.length,
      icon: Package,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active",
      value: modules.filter((m: any) => m.isActive).length,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Inactive",
      value: modules.filter((m: any) => !m.isActive).length,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  // CRUD handlers
  const handleCreate = async (data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive === "true" || data.isActive === true,
        parentId: data.parentId && data.parentId !== "_none" ? Number(data.parentId) : null,
      };
      await createModule(payload).unwrap();
      toast.success("Module created successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to create module:", error);
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive === "true" || data.isActive === true,
        parentId: data.parentId && data.parentId !== "_none" ? Number(data.parentId) : null,
      };
      await updateModule({ id, body: payload }).unwrap();
      toast.success("Module updated successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to update module:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteModule(id).unwrap();
      toast.success("Module deleted successfully");
    } catch (error) {
      toast.error(error);
      console.error("Failed to delete module:", error);
    }
  };

  return (
    <EntityManager
      data={modules}
      columns={columns}
      entityName="System Module"
      keyExtractor={(item) => item.id}
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

