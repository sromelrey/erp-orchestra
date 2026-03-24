"use client";

import { EntityManager, StatCard } from "@/components/entity-manager";
import { useWarehouses } from "@/hooks/operations/useWarehouses";
import { Building2, Package } from "lucide-react";
import { columns } from "./column";
import { CreateWarehouseRequest } from "@/types/operations";

export default function WarehousesPage() {
  const {
    warehouses,
    isLoading,
    handleCreate,
    handleUpdate,
    handleDelete,
    formFields,
  } = useWarehouses();

  // Calculate stats
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter((w: { isActive: boolean }) => w.isActive).length;

  const stats: StatCard[] = [
    {
      label: "Total Warehouses",
      value: totalWarehouses,
      icon: Building2,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Warehouses",
      value: activeWarehouses,
      icon: Package,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="space-y-6">
      <EntityManager
        entityName="Warehouse"
        entityNamePlural="Warehouses"
        data={warehouses}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        onCreate={async (data) => {
          await handleCreate(data as CreateWarehouseRequest);
        }}
        onUpdate={async (id, data) => {
          await handleUpdate(id as string, data as CreateWarehouseRequest);
        }}
        onDelete={async (id) => {
          await handleDelete(id as string);
        }}
        stats={stats}
        searchPlaceholder="Search warehouses..."
        isLoading={isLoading}
      />
    </div>
  );
}
