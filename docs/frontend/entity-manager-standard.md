# Entity Manager Integration Standard

This document outlines the standard pattern for integrating the `EntityManager` component to manage entities (CRUD operations) within the application.

## Overview

The `EntityManager` is a "battery-included" component that handles:
- **Data Table**: Displaying, searching, and filtering data.
- **Forms**: Create/Edit/View operations using a side-panel slider.
- **State Management**: Handling modal states, loading states, and error handling.
- **Statistics**: Displaying summary cards.

## File Structure Pattern

For each entity (e.g., `tenants`, `users`, `products`), follow this file structure:

```
app/(main)/[entity-name]/
├── page.tsx          # Main entry point using EntityManager
├── column.tsx        # DataTable column definitions
└── form-fields.ts    # Form field configurations
```

---

## 1. Column Definitions (`column.tsx`)

Define the columns for the data table. Use the `Column` type from `@/components/ui/data-table`.

```tsx
import { Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

export const columns: Column<any>[] = [
  {
    header: "Name",
    accessorKey: "name", // Or use a custom renderer
    cell: (item) => <span className="font-medium">{item.name}</span>,
  },
  // ... other columns
  {
    header: "Actions",
    className: "text-right",
    cell: () => (
      // Actions are handled automatically by EntityManager if enabled
      // But you can add custom actions here if needed
      <></> 
    ),
  },
];
```

## 2. Form Fields Configuration (`form-fields.ts`)

Define the fields for the Create/Edit forms. This keeps the configuration separate from the page logic.

```tsx
import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Entity Name",
    type: "text",       // "text" | "email" | "number" | "select" | "textarea" | "date"
    placeholder: "Enter name",
    required: true,
  },
  {
    /* 
       NOTE: The "select" type uses a SearchableSelect component by default.
       This is mandatory for fields expected to have long lists (e.g., Employees, Departments).
    */
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    defaultValue: "active",
  },
  // ... other fields
];
```

## 3. Page Implementation (`page.tsx`)

Compose the `EntityManager` in the page component.

```tsx
"use client";

import { useState } from "react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields } from "./form-fields";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

export default function EntityPage() {
  const [data, setData] = useState([]); // Replace with API query hook

  // Optional: Define stats cards
  const stats: StatCard[] = [
    {
      label: "Total Items",
      value: data.length,
      icon: Building2,
      color: "bg-primary/10 text-primary",
    },
  ];

  // CRUD Handlers
  const handleCreate = async (formData: any) => {
    try {
      await createEntity(formData).unwrap();
      toast.success("Entity created successfully");
    } catch (error) {
      toast.error("Failed to create entity");
    }
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      await updateEntity({ id, body: formData }).unwrap();
      toast.success("Entity updated successfully");
    } catch (error) {
      toast.error("Failed to update entity");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteEntity(id).unwrap();
      toast.success("Entity deleted successfully");
    } catch (error) {
      toast.error("Failed to delete entity");
    }
  };

  return (
    <EntityManager
      entityName="Entity Name"
      entityNamePlural="Entities" // Optional
      data={data}
      columns={columns}
      formFields={formFields}
      keyExtractor={(item) => item.id}
      
      // Handlers
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      
      // Optional Configuration
      stats={stats}
      searchPlaceholder="Search entities..."
      isLoading={false}
    />
  );
}
```

## Key Benefits

1.  **Consistency**: All CRUD pages look and behave the same.
2.  **Maintainability**: UI logic (EntityManager) is separated from Business logic (Page).
3.  **Speed**: Adding a new entity page takes minutes—just define columns and fields.

## 4. Sidebar Configuration (`sidebar.config.ts`)

Once the pages are properly set up and secured with `PermissionGuard`, ensure they are accessible via the main sidebar navigation.

Locate the `CUSTOMER_PORTAL_MENU_ITEMS` (or equivalent config array) and add your new entry linked to its respective route and icon:

```tsx
  {
    label: "Entities",
    href: "/hris/entities",
    icon: Building2,
    description: "Manage entities in your organization",
    permission: "resource.entity.view" // Match your API/route guard
  }
```
