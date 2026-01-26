"use client";

import { useState } from "react";
import { Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { EntityManager, FormField, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";

// Mock data for tenants
const mockTenants = [
  {
    id: "1",
    name: "Acme Corporation",
    subdomain: "acme",
    plan: "Enterprise",
    status: "active",
    users: 150,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "TechStart Inc",
    subdomain: "techstart",
    plan: "Pro",
    status: "active",
    users: 45,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Global Foods Ltd",
    subdomain: "globalfoods",
    plan: "Basic",
    status: "suspended",
    users: 12,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "MediCare Plus",
    subdomain: "medicareplus",
    plan: "Enterprise",
    status: "active",
    users: 230,
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "BuildRight Construction",
    subdomain: "buildright",
    plan: "Pro",
    status: "pending",
    users: 0,
    createdAt: "2024-04-01",
  },
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState(mockTenants);

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
      value: tenants.filter((t) => t.status === "active").length,
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Pending",
      value: tenants.filter((t) => t.status === "pending").length,
      icon: Clock,
      color: "bg-amber-100 text-amber-600",
    },
    {
      label: "Suspended",
      value: tenants.filter((t) => t.status === "suspended").length,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ];

  // CRUD handlers
  const handleCreate = (data: any) => {
    const newTenant = {
      ...data,
      id: String(tenants.length + 1),
      users: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTenants([...tenants, newTenant]);
    console.log("Created tenant:", newTenant);
  };

  const handleUpdate = (id: string | number, data: any) => {
    setTenants(tenants.map((t) => (t.id === id ? { ...t, ...data } : t)));
    console.log("Updated tenant:", id, data);
  };

  const handleDelete = (id: string | number) => {
    setTenants(tenants.filter((t) => t.id !== id));
    console.log("Deleted tenant:", id);
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
    />
  );
}
