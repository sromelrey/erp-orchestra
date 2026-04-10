# Permission Implementation Guide

## Overview

This guide explains how to implement Role-Based Access Control (RBAC) for new features in the frontend. Every new feature must follow the "Double-Gated" security pattern to ensure proper access control.

## Core Principles

### Double-Gated Security
Access is granted only if **both** conditions are met:
1. **Feature Gate**: The Tenant's active Plan includes the required system Module
2. **Permission Gate**: The User's assigned Role has the specific permission slug

### Permission Slug Convention
Permissions follow the pattern: `{resource}.{action}`

**Examples:**
- `operations.goods-receipt.create`
- `operations.goods-receipt.view`
- `operations.goods-receipt.update`
- `operations.goods-receipt.delete`
- `operations.goods-receipt.confirm`
- `operations.goods-receipt.cancel`

**Standard Actions:**
- `create` - Create new records
- `view` - Read/view records
- `update` - Edit existing records
- `delete` - Delete records
- `confirm` - Confirm/approve records (workflow-specific)
- `cancel` - Cancel records (workflow-specific)

## Available Components

### 1. PermissionGuard
Protects entire pages or sections. Redirects to `/system/unauthorized` by default if access is denied.

**Use case:** Route-level protection for pages

```tsx
import { PermissionGuard } from '@/components/auth/PermissionGuard';

export default function GoodsReceiptsPage() {
  return (
    <PermissionGuard permission="operations.goods-receipt.view">
      <div className="p-6">
        {/* Your page content */}
      </div>
    </PermissionGuard>
  );
}
```

### 2. HasPermission
Granular UI gating for specific components. Can hide/show elements or redirect.

**Use case:** Protecting buttons, forms, or specific sections within a page

```tsx
import { HasPermission } from '@/components/auth/HasPermission';

export default function GoodsReceiptsPage() {
  return (
    <div className="p-6">
      <HasPermission permission="operations.goods-receipt.create">
        <Button onClick={handleCreate}>Create Goods Receipt</Button>
      </HasPermission>

      <HasPermission 
        permission="operations.goods-receipt.delete"
        fallback={<span className="text-gray-400">Delete not available</span>}
      >
        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
      </HasPermission>
    </div>
  );
}
```

### 3. usePermission Hook
Programmatic permission check in custom hooks or components.

**Use case:** Conditional logic based on permissions

```tsx
import { usePermission } from '@/hooks/usePermission';

export default function GoodsReceiptsPage() {
  const canCreate = usePermission('operations.goods-receipt.create');
  const canDelete = usePermission('operations.goods-receipt.delete');
  const canConfirm = usePermission('operations.goods-receipt.confirm');

  return (
    <div className="p-6">
      {canCreate && <Button onClick={handleCreate}>Create</Button>}
      {canDelete && <Button variant="destructive" onClick={handleDelete}>Delete</Button>}
      {canConfirm && <Button onClick={handleConfirm}>Confirm</Button>}
    </div>
  );
}
```

## Step-by-Step Implementation

### Step 1: Protect the Page with PermissionGuard

Wrap your entire page with `PermissionGuard` to ensure unauthorized users can't access it:

```tsx
'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
// ... other imports

export default function GoodsReceiptsPage() {
  return (
    <PermissionGuard permission="operations.goods-receipt.view">
      <div className="p-6">
        <EntityManager
          entityName="Goods Receipt"
          // ... other props
        />
      </div>
    </PermissionGuard>
  );
}
```

### Step 2: Configure EntityManager Permissions

Pass permission slugs to the `EntityManager` component for CRUD operations:

```tsx
<EntityManager
  entityName="Goods Receipt"
  entityNamePlural="Goods Receipts"
  data={goodsReceiptsWithOptimistic}
  columns={columns}
  formFields={formFields}
  permissions={{
    create: 'operations.goods-receipt.create',
    update: 'operations.goods-receipt.update',
    delete: 'operations.goods-receipt.delete',
    view: 'operations.goods-receipt.view',
  }}
  // ... other props
/>
```

### Step 3: Protect Workflow Actions

Add permission checks to workflow action buttons:

```tsx
const workflowActions = [
  {
    label: 'Confirm Receipt',
    icon: CheckCircle,
    variant: 'default',
    permission: 'operations.goods-receipt.confirm', // Permission check
    handler: handleConfirm,
    isVisible: (item) => item.status === GoodsReceiptStatus.DRAFT,
  },
  {
    label: 'Cancel Receipt',
    icon: XCircle,
    variant: 'destructive',
    permission: 'operations.goods-receipt.cancel', // Permission check
    handler: handleCancel,
    isVisible: (item) => item.status === GoodsReceiptStatus.DRAFT,
  },
];
```

### Step 4: Protect Custom Components

Use `HasPermission` for custom UI elements:

```tsx
import { HasPermission } from '@/components/auth/HasPermission';

export function GoodsReceiptActions({ goodsReceipt }: { goodsReceipt: GoodsReceipt }) {
  return (
    <div className="flex gap-2">
      <HasPermission permission="operations.goods-receipt.confirm">
        <Button onClick={() => handleConfirm(goodsReceipt.id)}>
          Confirm
        </Button>
      </HasPermission>

      <HasPermission permission="operations.goods-receipt.cancel">
        <Button variant="destructive" onClick={() => handleCancel(goodsReceipt.id)}>
          Cancel
        </Button>
      </HasPermission>
    </div>
  );
}
```

### Step 5: Use usePermission for Conditional Logic

For complex conditional logic, use the `usePermission` hook:

```tsx
import { usePermission } from '@/hooks/usePermission';

export function GoodsReceiptsPage() {
  const canCreate = usePermission('operations.goods-receipt.create');
  const canConfirm = usePermission('operations.goods-receipt.confirm');
  const canCancel = usePermission('operations.goods-receipt.cancel');

  const workflowActions = useMemo(() => {
    const actions = [];
    
    if (canConfirm) {
      actions.push({
        label: 'Confirm Receipt',
        icon: CheckCircle,
        variant: 'default',
        handler: handleConfirm,
        isVisible: (item) => item.status === GoodsReceiptStatus.DRAFT,
      });
    }
    
    if (canCancel) {
      actions.push({
        label: 'Cancel Receipt',
        icon: XCircle,
        variant: 'destructive',
        handler: handleCancel,
        isVisible: (item) => item.status === GoodsReceiptStatus.DRAFT,
      });
    }
    
    return actions;
  }, [canConfirm, canCancel]);

  return (
    <EntityManager
      // ...
      workflowActions={workflowActions}
    />
  );
}
```

## Complete Example: Goods Receipts Page

```tsx
'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { HasPermission } from '@/components/auth/HasPermission';
import { EntityManager } from '@/components/entity-manager';
import { useGoodsReceipts } from '@/hooks/operations/useGoodsReceipts';
import { useGoodsReceiptWorkflow } from '@/hooks/operations/useGoodsReceiptWorkflow';
import { useGoodsReceiptForm } from '@/hooks/operations/useGoodsReceiptForm';
import { useGoodsReceiptStats } from '@/hooks/operations/useGoodsReceiptStats';
import { columns } from './column';
import { getFormFields } from './form-fields';
import { GoodsReceiptStatus } from '@/store/api/goodsReceiptsApi';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GoodsReceiptsPage() {
  const {
    goodsReceipts,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleConfirm,
    handleCancel,
    itemOptions,
    warehouseOptions,
    uomOptions,
  } = useGoodsReceipts();

  const { workflowActions, isProcessing, optimisticUpdates, mergeWithOptimistic } =
    useGoodsReceiptWorkflow({
      handleConfirm,
      handleCancel,
      goodsReceipts,
      userId: 1,
    });

  const { getLocationsByWarehouse } = useGoodsReceiptForm();
  const { statsCards } = useGoodsReceiptStats({ goodsReceipts });

  const formFields = getFormFields({
    itemOptions,
    uomOptions,
    warehouseOptions,
    locationOptions: [],
    getLocationsByWarehouse,
    currentStatus: undefined,
  });

  const goodsReceiptsWithOptimistic = mergeWithOptimistic(
    goodsReceipts as unknown as Record<string, unknown>[]
  );

  const isRowEditable = (item: Record<string, unknown>) => {
    const status = item?.status as GoodsReceiptStatus;
    return status === GoodsReceiptStatus.DRAFT;
  };

  const isRowDeletable = (item: Record<string, unknown>) => {
    const status = item?.status as GoodsReceiptStatus;
    return status === GoodsReceiptStatus.DRAFT;
  };

  return (
    <PermissionGuard permission="operations.goods-receipt.view">
      <div className="p-6 space-y-6">
        {/* Stats Cards - Protected */}
        <HasPermission permission="operations.goods-receipt.view">
          <GoodsReceiptStats statsCards={statsCards} />
        </HasPermission>

        {/* Entity Manager with full permission configuration */}
        <EntityManager
          entityName="Goods Receipt"
          entityNamePlural="Goods Receipts"
          data={goodsReceiptsWithOptimistic as unknown as Record<string, unknown>[]}
          columns={columns as unknown as import('@/components/entity-manager/types').EntityColumn<Record<string, unknown>>[]}
          formFields={formFields}
          formWidth="50%"
          keyExtractor={(item) => (item as unknown as { id: string | number }).id}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isLoading={isLoading}
          isMutating={isCreating || isUpdating || isDeleting}
          workflowActions={workflowActions}
          isProcessing={isProcessing}
          optimisticUpdates={optimisticUpdates}
          isRowEditable={isRowEditable}
          isRowDeletable={isRowDeletable}
          permissions={{
            create: 'operations.goods-receipt.create',
            update: 'operations.goods-receipt.update',
            delete: 'operations.goods-receipt.delete',
            view: 'operations.goods-receipt.view',
          }}
        />
      </div>
    </PermissionGuard>
  );
}
```

## Common Pitfalls

### ❌ Don't Skip Page-Level Protection
```tsx
// BAD: Anyone can access the page, even if they lack permissions
export default function GoodsReceiptsPage() {
  return <EntityManager entityName="Goods Receipt" />;
}
```

### ❌ Don't Protect Only the Create Button
```tsx
// BAD: Users can still edit/delete without permission
<HasPermission permission="operations.goods-receipt.create">
  <Button>Create</Button>
</HasPermission>
<EntityManager permissions={{ create: 'operations.goods-receipt.create' }} />
```

### ❌ Don't Use Hardcoded Permission Checks
```tsx
// BAD: Not using the permission components
const userPermissions = useSelector(selectUserPermissions);
if (userPermissions.includes('operations.goods-receipt.create')) {
  return <Button>Create</Button>;
}
```

### ✅ Always Protect the Page
```tsx
// GOOD: Page is protected at the route level
<PermissionGuard permission="operations.goods-receipt.view">
  <GoodsReceiptsPage />
</PermissionGuard>
```

### ✅ Configure All CRUD Permissions
```tsx
// GOOD: All operations are protected
<EntityManager
  permissions={{
    create: 'operations.goods-receipt.create',
    update: 'operations.goods-receipt.update',
    delete: 'operations.goods-receipt.delete',
    view: 'operations.goods-receipt.view',
  }}
/>
```

### ✅ Use Permission Components
```tsx
// GOOD: Using the permission components
<HasPermission permission="operations.goods-receipt.create">
  <Button>Create</Button>
</HasPermission>
```

## Testing Permissions

### Manual Testing Checklist

- [ ] Access page without view permission → Should redirect to unauthorized
- [ ] Access page with view permission → Should show page
- [ ] Try to create without create permission → Button should be hidden/disabled
- [ ] Try to edit without update permission → Edit button should be hidden/disabled
- [ ] Try to delete without delete permission → Delete button should be hidden/disabled
- [ ] Try workflow action without permission → Action button should be hidden/disabled

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { HasPermission } from '@/components/auth/HasPermission';

describe('HasPermission', () => {
  it('renders children when user has permission', () => {
    render(
      <HasPermission permission="operations.goods-receipt.create">
        <button>Create</button>
      </HasPermission>
    );
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders fallback when user lacks permission', () => {
    render(
      <HasPermission 
        permission="operations.goods-receipt.create"
        fallback={<span>No access</span>}
      >
        <button>Create</button>
      </HasPermission>
    );
    expect(screen.queryByText('Create')).not.toBeInTheDocument();
    expect(screen.getByText('No access')).toBeInTheDocument();
  });
});
```

## Checklist for New Features

- [ ] Wrap page with `PermissionGuard` using view permission
- [ ] Configure `EntityManager` with all CRUD permissions
- [ ] Add permission checks to workflow actions
- [ ] Protect custom components with `HasPermission`
- [ ] Use `usePermission` for conditional logic if needed
- [ ] Test with different user roles
- [ ] Verify unauthorized users are redirected
- [ ] Ensure all UI elements respect permissions

## Related Documentation

- [Component Guidelines](./component-guidelines.md) - UI component standards
- [API Guidelines](./api-guidelines.md) - API integration patterns
- [Entity Manager Standard](./entity-manager-standard.md) - EntityManager usage guide
