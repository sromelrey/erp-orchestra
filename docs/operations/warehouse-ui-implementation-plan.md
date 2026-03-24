# Warehouse & Location UI Implementation Plan

**Branch:** `feature/ops-warehouse-ui`  
**Epic:** OPS-002 - Warehouse & Stock Ledger Management  
**Implementation Date:** March 2026

---

## Overview

This document outlines the detailed implementation plan for the Warehouse & Location UI module, following the established frontend standards and patterns. The module will provide comprehensive warehouse management capabilities including hierarchical location management, capacity tracking, and location assignment interfaces.

---

## 1. File Structure

```
portal.orchestra.com/
├── app/(main)/operations/
│   ├── warehouses/
│   │   ├── page.tsx              # Main warehouse management page
│   │   ├── column.tsx            # Warehouse table column definitions
│   │   └── form-fields.ts        # Warehouse form field configurations
│   ├── locations/
│   │   ├── page.tsx              # Location hierarchy management page
│   │   ├── column.tsx            # Location table column definitions
│   │   └── form-fields.ts        # Location form field configurations
│   └── layout.tsx                # Operations module layout
├── components/operations/
│   ├── warehouses/
│   │   ├── WarehouseCapacityCard.tsx    # Capacity visualization component
│   │   ├── LocationTreeView.tsx         # Hierarchical tree view
│   │   └── LocationAssignmentPanel.tsx  # Assignment interface
│   └── locations/
│       └── LocationBreadcrumbs.tsx      # Navigation breadcrumbs
├── hooks/operations/
│   ├── useWarehouses.ts         # Warehouse operations hook
│   └── useLocations.ts          # Location operations hook
├── store/api/
│   ├── warehousesApi.ts         # Warehouse RTK Query API
│   └── locationsApi.ts          # Location RTK Query API
└── types/
    └── operations.ts            # Warehouse & Location type definitions
```

---

## 2. API Layer Implementation

### 2.1 Warehouse API (`store/api/warehousesApi.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Warehouse, CreateWarehouseRequest, UpdateWarehouseRequest, WarehousesQueryParams } from '@/types';

export const warehousesApi = createApi({
  reducerPath: 'warehousesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/operations`,
    credentials: 'include',
  }),
  tagTypes: ['Warehouse'],
  endpoints: (builder) => ({
    getWarehouses: builder.query<Warehouse[], WarehousesQueryParams>({
      query: (params) => ({
        url: '/warehouses',
        params,
      }),
      providesTags: ['Warehouse'],
    }),
    getWarehouse: builder.query<Warehouse, string>({
      query: (id) => `/warehouses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Warehouse', id }],
    }),
    createWarehouse: builder.mutation<Warehouse, CreateWarehouseRequest>({
      query: (body) => ({
        url: '/warehouses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Warehouse'],
    }),
    updateWarehouse: builder.mutation<Warehouse, UpdateWarehouseRequest>({
      query: ({ id, body }) => ({
        url: `/warehouses/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Warehouse', id }],
    }),
    deleteWarehouse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/warehouses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Warehouse'],
    }),
    getWarehouseCapacity: builder.query<CapacityInfo, string>({
      query: (id) => `/warehouses/${id}/capacity`,
      providesTags: (result, error, id) => [{ type: 'Warehouse', id, type: 'capacity' }],
    }),
  }),
});

export const {
  useGetWarehousesQuery,
  useGetWarehouseQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehouseCapacityQuery,
} = warehousesApi;
```

### 2.2 Location API (`store/api/locationsApi.ts`)

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Location, CreateLocationRequest, UpdateLocationRequest, LocationsQueryParams } from '@/types';

export const locationsApi = createApi({
  reducerPath: 'locationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/operations`,
    credentials: 'include',
  }),
  tagTypes: ['Location'],
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], LocationsQueryParams>({
      query: (params) => ({
        url: '/locations',
        params,
      }),
      providesTags: ['Location'],
    }),
    getLocationTree: builder.query<LocationTreeNode[], string | undefined>({
      query: (warehouseId) => ({
        url: '/locations/tree',
        params: warehouseId ? { warehouseId } : undefined,
      }),
      providesTags: ['Location'],
    }),
    createLocation: builder.mutation<Location, CreateLocationRequest>({
      query: (body) => ({
        url: '/locations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Location'],
    }),
    updateLocation: builder.mutation<Location, UpdateLocationRequest>({
      query: ({ id, body }) => ({
        url: `/locations/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Location', id }],
    }),
    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/locations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Location'],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationTreeQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;
```

---

## 3. Type Definitions

### 3.1 Update Types (`types/operations.ts`)

```typescript
// Warehouse Types
export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address?: string;
  isActive: boolean;
  capacity?: number;
  currentUtilization: number;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehouseRequest {
  name: string;
  code: string;
  address?: string;
  isActive?: boolean;
  capacity?: number;
  managerId?: string;
}

export interface UpdateWarehouseRequest {
  id: string;
  body: Partial<CreateWarehouseRequest>;
}

export interface WarehousesQueryParams {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  code: string;
  warehouseId: string;
  parentId?: string;
  type: LocationType;
  capacity?: number;
  currentStock: number;
  isActive: boolean;
  aisle?: string;
  bay?: string;
  level?: string;
  position?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationTreeNode extends Location {
  children: LocationTreeNode[];
}

export interface CreateLocationRequest {
  name: string;
  code: string;
  warehouseId: string;
  parentId?: string;
  type: LocationType;
  capacity?: number;
  aisle?: string;
  bay?: string;
  level?: string;
  position?: string;
  isActive?: boolean;
}

export interface UpdateLocationRequest {
  id: string;
  body: Partial<CreateLocationRequest>;
}

export interface LocationsQueryParams {
  search?: string;
  warehouseId?: string;
  parentId?: string;
  type?: LocationType;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export enum LocationType {
  STORAGE = 'storage',
  PICKING = 'picking',
  RECEIVING = 'receiving',
  SHIPPING = 'shipping',
  STAGING = 'staging',
  QUARANTINE = 'quarantine',
}

// Capacity Types
export interface CapacityInfo {
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  locationBreakdown: {
    locationId: string;
    locationName: string;
    usedCapacity: number;
    totalCapacity: number;
  }[];
}
```

---

## 4. Component Implementation

### 4.1 Warehouse Management Page

#### 4.1.1 Column Definition (`app/(main)/operations/warehouses/column.tsx`)

```tsx
import { Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, MapPin, User } from "lucide-react";
import { Warehouse } from "@/types";

export const columns: Column<Warehouse>[] = [
  {
    header: "Warehouse",
    accessorKey: "name",
    cell: (warehouse) => (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{warehouse.name}</p>
          <p className="text-sm text-muted-foreground">{warehouse.code}</p>
        </div>
      </div>
    ),
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: (warehouse) => (
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-3 w-3 text-muted-foreground" />
        <span>{warehouse.address || "Not specified"}</span>
      </div>
    ),
  },
  {
    header: "Capacity",
    cell: (warehouse) => {
      const utilization = warehouse.capacity 
        ? (warehouse.currentUtilization / warehouse.capacity) * 100 
        : 0;
      
      return (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{warehouse.currentUtilization}</span>
            <span>{warehouse.capacity || "Unlimited"}</span>
          </div>
          {warehouse.capacity && (
            <Progress value={utilization} className="h-2" />
          )}
          <p className="text-xs text-muted-foreground">
            {utilization.toFixed(1)}% utilized
          </p>
        </div>
      );
    },
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (warehouse) => (
      <Badge variant={warehouse.isActive ? "default" : "secondary"}>
        {warehouse.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    header: "Manager",
    accessorKey: "managerId",
    cell: (warehouse) => (
      <div className="flex items-center gap-2">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">
          {warehouse.managerId ? "Assigned" : "Not assigned"}
        </span>
      </div>
    ),
  },
];
```

#### 4.1.2 Form Fields (`app/(main)/operations/warehouses/form-fields.tsx`)

```tsx
import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Warehouse Name",
    type: "text",
    placeholder: "Enter warehouse name",
    required: true,
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: "code",
    label: "Warehouse Code",
    type: "text",
    placeholder: "e.g., WH001",
    required: true,
    validation: {
      pattern: /^[A-Z0-9]{3,10}$/,
      message: "Code must be 3-10 uppercase alphanumeric characters",
    },
  },
  {
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter warehouse address",
    rows: 3,
  },
  {
    name: "capacity",
    label: "Total Capacity",
    type: "number",
    placeholder: "Enter total capacity",
    helper: "Leave empty for unlimited capacity",
  },
  {
    name: "managerId",
    label: "Warehouse Manager",
    type: "select",
    placeholder: "Select warehouse manager",
    // Options will be populated dynamically via hook
    options: [],
  },
  {
    name: "isActive",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
    defaultValue: "true",
  },
];
```

#### 4.1.3 Hook Implementation (`hooks/operations/useWarehouses.ts`)

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetWarehousesQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetUsersQuery,
} from "@/store";
import { Warehouse, CreateWarehouseRequest, UpdateWarehouseRequest } from "@/types";

export function useWarehouses() {
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Data fetching
  const {
    data: warehouses = [],
    isLoading,
    error,
  } = useGetWarehousesQuery({
    search,
    isActive,
  });

  // Get users for manager selection
  const { data: users = [] } = useGetUsersQuery({ limit: 1000 });

  // Mutations
  const [createWarehouse] = useCreateWarehouseMutation();
  const [updateWarehouse] = useUpdateWarehouseMutation();
  const [deleteWarehouse] = useDeleteWarehouseMutation();

  // Handlers
  const handleCreate = async (formData: CreateWarehouseRequest) => {
    try {
      await createWarehouse({
        ...formData,
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      }).unwrap();
      toast.success("Warehouse created successfully");
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create warehouse");
      return false;
    }
  };

  const handleUpdate = async (id: string, formData: CreateWarehouseRequest) => {
    try {
      await updateWarehouse({
        id,
        body: formData,
      }).unwrap();
      toast.success("Warehouse updated successfully");
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to update warehouse");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWarehouse(id).unwrap();
      toast.success("Warehouse deleted successfully");
      return true;
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete warehouse");
      return false;
    }
  };

  // Prepare form fields with dynamic options
  const getFormFields = () => {
    const baseFields = [...formFields]; // Import from form-fields.ts
    
    return baseFields.map(field => {
      if (field.name === "managerId") {
        return {
          ...field,
          options: users.map(user => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user.id,
          })),
        };
      }
      return field;
    });
  };

  return {
    warehouses,
    isLoading,
    error,
    search,
    setSearch,
    isActive,
    setIsActive,
    handleCreate,
    handleUpdate,
    handleDelete,
    formFields: getFormFields(),
  };
}
```

### 4.2 Location Management Components

#### 4.2.1 Location Tree View (`components/operations/warehouses/LocationTreeView.tsx`)

```tsx
"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LocationTreeNode } from "@/types";

interface LocationTreeViewProps {
  locations: LocationTreeNode[];
  onLocationSelect?: (location: LocationTreeNode) => void;
  selectedLocationId?: string;
  className?: string;
}

export function LocationTreeView({
  locations,
  onLocationSelect,
  selectedLocationId,
  className,
}: LocationTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: LocationTreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedLocationId === node.id;
    const utilization = node.capacity 
      ? (node.currentStock / node.capacity) * 100 
      : 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
            hover:bg-accent transition-colors
            ${isSelected ? "bg-accent" : ""}
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onLocationSelect?.(node)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{node.name}</p>
              <p className="text-xs text-muted-foreground">{node.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {node.type}
            </Badge>
            
            {node.capacity && (
              <div className="flex items-center gap-1 min-w-0">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {node.currentStock}/{node.capacity}
                </span>
              </div>
            )}
          </div>
        </div>

        {node.capacity && (
          <div 
            className="px-2 pb-1"
            style={{ paddingLeft: `${level * 16 + 40}px` }}
          >
            <Progress value={utilization} className="h-1" />
          </div>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {locations.map((location) => renderNode(location))}
    </div>
  );
}
```

#### 4.2.2 Warehouse Capacity Card (`components/operations/warehouses/WarehouseCapacityCard.tsx`)

```tsx
"use client";

import { Building2, TrendingUp, Package, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CapacityInfo } from "@/types";

interface WarehouseCapacityCardProps {
  capacity: CapacityInfo;
  warehouseName: string;
  className?: string;
}

export function WarehouseCapacityCard({
  capacity,
  warehouseName,
  className,
}: WarehouseCapacityCardProps) {
  const isNearCapacity = capacity.utilizationPercentage >= 90;
  const isHighUtilization = capacity.utilizationPercentage >= 75;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Capacity Overview</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Utilization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Utilization</span>
              <span className={isNearCapacity ? "text-destructive" : ""}>
                {capacity.utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={capacity.utilizationPercentage} 
              className={`h-2 ${isNearCapacity ? "bg-destructive/20" : ""}`}
            />
            <p className="text-xs text-muted-foreground">
              {capacity.usedCapacity.toLocaleString()} of {capacity.totalCapacity.toLocaleString()} units
            </p>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {capacity.availableCapacity.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {capacity.usedCapacity.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">In Use</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {capacity.locationBreakdown.length}
              </p>
              <p className="text-xs text-muted-foreground">Locations</p>
            </div>
          </div>

          {/* Alert for High Utilization */}
          {isHighUtilization && (
            <div className={`flex items-center gap-2 p-2 rounded-md ${
              isNearCapacity ? "bg-destructive/10 text-destructive" : "bg-yellow-50 text-yellow-800"
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs">
                {isNearCapacity 
                  ? "Critical: Warehouse is at near-full capacity"
                  : "Warning: Warehouse utilization is high"
                }
              </p>
            </div>
          )}

          {/* Top Utilized Locations */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Utilized Locations</p>
            <div className="space-y-1">
              {capacity.locationBreakdown
                .sort((a, b) => (b.usedCapacity / b.totalCapacity) - (a.usedCapacity / a.totalCapacity))
                .slice(0, 3)
                .map((location) => {
                  const utilization = (location.usedCapacity / location.totalCapacity) * 100;
                  return (
                    <div key={location.locationId} className="flex justify-between text-xs">
                      <span className="truncate mr-2">{location.locationName}</span>
                      <span className={utilization >= 90 ? "text-destructive" : "text-muted-foreground"}>
                        {utilization.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 5. Page Implementations

### 5.1 Warehouse Page (`app/(main)/operations/warehouses/page.tsx`)

```tsx
"use client";

import { EntityManager, StatCard } from "@/components/entity-manager";
import { WarehouseCapacityCard } from "@/components/operations/warehouses/WarehouseCapacityCard";
import { useWarehouses } from "@/hooks/operations/useWarehouses";
import { Building2, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function WarehousesPage() {
  const {
    warehouses,
    isLoading,
    search,
    setSearch,
    isActive,
    setIsActive,
    handleCreate,
    handleUpdate,
    handleDelete,
    formFields,
  } = useWarehouses();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  // Calculate stats
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.isActive).length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.capacity || 0), 0);
  const totalUtilization = warehouses.reduce((sum, w) => sum + w.currentUtilization, 0);
  const avgUtilization = totalCapacity > 0 ? (totalUtilization / totalCapacity) * 100 : 0;

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
    {
      label: "Total Capacity",
      value: totalCapacity.toLocaleString(),
      icon: TrendingUp,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Avg Utilization",
      value: `${avgUtilization.toFixed(1)}%`,
      icon: AlertTriangle,
      color: avgUtilization >= 75 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700",
    },
  ];

  // Filter controls
  const filterControls = (
    <div className="flex gap-2">
      <select
        value={isActive === undefined ? "" : isActive.toString()}
        onChange={(e) => setIsActive(e.target.value ? e.target.value === "true" : undefined)}
        className="px-3 py-1.5 text-sm border rounded-md bg-background"
      >
        <option value="">All Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <EntityManager
        entityName="Warehouse"
        entityNamePlural="Warehouses"
        data={warehouses}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        stats={stats}
        searchPlaceholder="Search warehouses..."
        isLoading={isLoading}
        search={search}
        onSearchChange={setSearch}
        filterControls={filterControls}
        actions={
          selectedWarehouseId && (
            <WarehouseCapacityCard
              warehouseName={warehouses.find(w => w.id === selectedWarehouseId)?.name || ""}
              capacity={{
                totalCapacity: warehouses.find(w => w.id === selectedWarehouseId)?.capacity || 0,
                usedCapacity: warehouses.find(w => w.id === selectedWarehouseId)?.currentUtilization || 0,
                availableCapacity: (warehouses.find(w => w.id === selectedWarehouseId)?.capacity || 0) - 
                                 (warehouses.find(w => w.id === selectedWarehouseId)?.currentUtilization || 0),
                utilizationPercentage: warehouses.find(w => w.id === selectedWarehouseId)?.capacity 
                  ? ((warehouses.find(w => w.id === selectedWarehouseId)?.currentUtilization || 0) / 
                     warehouses.find(w => w.id === selectedWarehouseId)!.capacity!) * 100 
                  : 0,
                locationBreakdown: [],
              }}
            />
          )
        }
      />
    </div>
  );
}
```

---

## 6. Sidebar Configuration

Update `components/sidebar/sidebar.config.ts` to include the new warehouse and location pages:

```tsx
// Add to OPERATIONS_MENU_ITEMS array
{
  label: "Warehouses",
  href: "/operations/warehouses",
  icon: Building2,
  description: "Manage warehouse locations and capacity",
  permission: "resource.warehouse.view",
},
{
  label: "Locations",
  href: "/operations/locations",
  icon: MapPin,
  description: "Manage storage locations and hierarchy",
  permission: "resource.location.view",
},
```

---

## 7. Testing Strategy

### 7.1 Unit Tests
- Test API endpoints and RTK Query hooks
- Test component rendering and interactions
- Test form validation and submission

### 7.2 Integration Tests
- Test warehouse creation with location assignment
- Test capacity calculations and updates
- Test location hierarchy operations

### 7.3 E2E Tests
- Complete warehouse management workflow
- Location tree navigation and management
- Capacity monitoring and alerts

---

## 8. Implementation Checklist

- [ ] Create warehouse and location API definitions
- [ ] Implement type definitions for all entities
- [ ] Create warehouse management page with EntityManager
- [ ] Create location management page with tree view
- [ ] Implement WarehouseCapacityCard component
- [ ] Implement LocationTreeView component
- [ ] Create custom hooks for warehouse and location operations
- [ ] Add sidebar navigation items
- [ ] Implement permission guards
- [ ] Add loading and error states
- [ ] Create form validation schemas
- [ ] Implement search and filtering
- [ ] Add capacity visualization and alerts
- [ ] Write unit and integration tests
- [ ] Perform manual testing and QA

---

## 9. Dependencies & Prerequisites

1. **Backend APIs**: Warehouse and Location CRUD endpoints must be implemented
2. **Permissions**: RBAC permissions for warehouse and location operations
3. **Material Module**: Basic material types should be available for location categorization
4. **UI Components**: All required shadcn/ui components should be installed

---

## 10. Success Criteria

1. Users can create, edit, and delete warehouses
2. Users can manage hierarchical location structures
3. Real-time capacity tracking and visualization
4. Intuitive tree navigation for locations
5. Proper permission-based access control
6. Responsive design for mobile and desktop
7. Comprehensive error handling and validation
8. Performance optimized for large datasets
