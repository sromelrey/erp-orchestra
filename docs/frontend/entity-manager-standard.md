# Entity Manager Integration Standard

This document outlines the standard pattern for integrating the `EntityManager` component to manage entities (CRUD operations) within the application.

## Overview

The `EntityManager` is a "battery-included" component that handles:
- **Data Table**: Displaying, searching, and filtering data.
- **Forms**: Create/Edit/View operations using a side-panel slider.
- **State Management**: Handling modal states, loading states, and error handling.
- **Statistics**: Displaying summary cards.

## File Structure Pattern (Mandatory)

For every entity managed via `EntityManager`, you **must** separate the configuration from the implementation. Defining columns or form fields directly inside `page.tsx` is prohibited.

```
app/(main)/[entity-name]/
├── page.tsx          # Main entry point (Composition only)
├── column.tsx        # Mandatory: DataTable column definitions
└── form-fields.ts    # Mandatory: Form field configurations
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

### 3.1 Workflow Actions Pattern (for entities with state transitions)

For entities that require workflow actions (e.g., Sales Orders: Confirm → Ship → Deliver), use the workflow actions pattern:

```tsx
// In your page component
import { useSalesOrderWorkflow } from '@/hooks/operations/useSalesOrderWorkflow';

const { workflowActions, isProcessing, optimisticUpdates, mergeWithOptimistic } =
  useSalesOrderWorkflow({
    handleConfirm,
    handleShip,
    handleCancel,
    handleDeliver,
    salesOrders: salesOrders as unknown as Record<string, unknown>[],
    userId: currentUser?.id,
  });

// Merge optimistic updates with actual data
const salesOrdersWithOptimistic = mergeWithOptimistic(salesOrders);

return (
  <EntityManager
    // ... other props
    data={salesOrdersWithOptimistic}
    workflowActions={workflowActions}
    optimisticUpdates={optimisticUpdates}
    isProcessing={isProcessing}
  />
);
```

**Workflow Action Definition Pattern:**

```tsx
// In lib/workflows/salesOrderWorkflow.ts
import { WorkflowAction } from './types';

export const buildSalesOrderWorkflow = (
  handleConfirm: (id: string) => Promise<void>,
  handleShip: (id: string) => Promise<void>,
  handleCancel: (id: string) => Promise<void>,
  handleDeliver: (id: string) => Promise<void>,
  userId?: string
): WorkflowAction[] => [
  {
    label: 'Confirm',
    icon: CheckCircle,
    variant: 'default',
    permission: 'operations.sales-order.confirm',
    onClick: (item) => handleConfirm(item.id),
    isVisible: (item) => item.status === 'DRAFT',
    confirm: {
      title: 'Confirm Sales Order',
      description: 'Are you sure you want to confirm this order?',
      variant: 'default',
    },
  },
  // ... other actions
];
```

**Optimistic Updates Pattern:**

Use `useOptimisticWorkflow` for immediate UI feedback during async operations:

```tsx
// In lib/workflows/useOptimisticWorkflow.ts
export const useOptimisticWorkflow = <T extends Record<string, unknown>>({
  data,
  workflowActions,
}: OptimisticWorkflowProps<T>) => {
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate<T>[]>([]);

  const executeAction = async (item: T, action: WorkflowAction) => {
    // Add optimistic update
    const optimisticUpdate: OptimisticUpdate<T> = {
      id: item.id,
      changes: action.optimisticChanges?.(item) || {},
    };
    setOptimisticUpdates(prev => [...prev, optimisticUpdate]);

    // Execute actual action
    await action.onClick(item);

    // Remove optimistic update after completion
    setOptimisticUpdates(prev => prev.filter(u => u.id !== item.id));
  };

  const mergeWithOptimistic = (originalData: T[]): T[] => {
    return originalData.map(item => {
      const update = optimisticUpdates.find(u => u.id === item.id);
      return update ? { ...item, ...update.changes } : item;
    });
  };

  return { optimisticUpdates, executeAction, mergeWithOptimistic };
};
```

### 3.2 Page composition must be hook-driven (no heavy logic in page)

- Move data fetching, mutations, validation, and inline-edit handlers into a dedicated hook (e.g., `useEmployee`).
- The page should **only** compose UI (buttons, headers, EntityManager) and read handlers/state from the hook.
- For inline expandable rows, have the hook return a `renderExpandedRow` factory (can use `React.createElement`) so the page stays JSX-light.
- Build dynamic form options inside the hook and return a ready `formFields` array; keep `form-fields.ts` static for structure only.
- Keep columns in `column.tsx` pure (no business logic); pass any extra props via the page/hook pattern.

**Hook Organization Pattern (from Sales Orders):**

Separate concerns into multiple focused hooks:

```
hooks/operations/
├── useSalesOrders.ts          # Main CRUD operations and data fetching
├── useSalesOrderWorkflow.ts   # Workflow actions (confirm/ship/cancel/deliver)
├── useSalesOrderForm.ts       # Form-specific logic (warehouse/location filtering)
└── useSalesOrderStats.ts      # Statistics/dashboard metrics
```

Each hook should have a single responsibility:
- `useSalesOrders`: Handles all CRUD operations, data fetching, and basic mutations
- `useSalesOrderWorkflow`: Handles workflow state transitions and optimistic updates
- `useSalesOrderForm`: Handles form field dependencies and dynamic options
- `useSalesOrderStats`: Handles statistics calculation and dashboard data

### 3.3 Creation flows and onboarding

- For simple CRUD, wire `onCreate` to the hook handlers.
- For complex onboarding (multi-step wizard), **do not** open the EntityManager form; instead, surface a CTA that redirects to the onboarding route (e.g., `router.push("/hris/employees/onboarding")`).
- Remove redundant table action columns when the expanded row already provides edit controls.

### 3.4 Helper Functions Pattern

Extract data transformation logic into helper functions to keep hooks and components clean:

```tsx
// utils/salesOrderHelpers.ts
export const formatSalesOrderForCreate = (formData: Partial<CreateSalesOrderRequest>): CreateSalesOrderRequest => {
  return {
    customer_name: formData.customer_name || '',
    order_date: formData.order_date || new Date().toISOString().split('T')[0],
    items: formData.items?.map(item => ({
      ...item,
      line_total: (item.quantity || 0) * (item.unit_price || 0),
    })) || [],
    // ... other transformations
  };
};

export const formatSalesOrderForUpdate = (formData: Partial<UpdateSalesOrderRequest>): UpdateSalesOrderRequest => {
  return {
    // ... update-specific transformations
  };
};
```

Usage in page:
```tsx
const handleCreateSalesOrder = async (formData: Partial<CreateSalesOrderRequest>) => {
  const processedData = formatSalesOrderForCreate(formData);
  await handleCreate(processedData);
};
```

## Key Benefits

1.  **Consistency**: All CRUD pages look and behave the same.
2.  **Maintainability**: UI logic (EntityManager) is separated from Business logic (Page).
3.  **Speed**: Adding a new entity page takes minutes—just define columns and fields.
4.  **Scalability**: Hook-driven architecture allows easy addition of workflow actions, statistics, and complex form logic.
5.  **Reusability**: Helper functions and workflow builders can be reused across similar entities.

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

## 5. Complete Example: Sales Orders Implementation

The Sales Orders feature demonstrates all the patterns described above:

### File Structure
```
app/(main)/operations/sales-orders/
├── page.tsx              # Main page (composition only)
├── column.tsx            # Column definitions
└── form-fields.tsx       # Form field configurations

hooks/operations/
├── useSalesOrders.ts         # CRUD operations
├── useSalesOrderWorkflow.ts  # Workflow actions
├── useSalesOrderForm.ts      # Form logic
└── useSalesOrderStats.ts     # Statistics

lib/workflows/
├── types.ts                  # Workflow types
├── builders.ts               # Workflow builders
├── salesOrderWorkflow.ts     # Sales order workflow
└── useOptimisticWorkflow.ts  # Optimistic updates

components/sales-orders/
├── SalesOrderHeader.tsx      # Custom header component
├── SalesOrderStats.tsx       # Stats cards component
└── DeliveryDialog.tsx        # Delivery dialog

utils/
└── salesOrderHelpers.ts      # Data transformation helpers

store/api/
└── salesOrdersApi.ts         # RTK Query API slice
```

### Key Patterns Used
1. **Hook-driven page composition**: Page only composes UI, all logic in hooks
2. **Workflow actions**: Confirm/Ship/Deliver/Cancel with optimistic updates
3. **Helper functions**: Data transformation in `salesOrderHelpers.ts`
4. **Custom components**: Feature-specific components for header, stats, and dialogs
5. **Permission-based access**: All actions protected with permissions
6. **Optimistic UI**: Immediate feedback during async operations
7. **Nested form fields**: `NestedArrayField` for order items
