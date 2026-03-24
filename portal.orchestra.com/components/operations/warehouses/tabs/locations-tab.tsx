"use client";

import { EntityManager } from "@/components/entity-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocations } from "@/hooks/operations/useLocations";
import { CreateLocationRequest, Location } from "@/types/operations";
import { Column } from "@/components/ui/data-table";

// Define the type for location data
type LocationData = Location & {
  children?: LocationData[];
};

import { MapPin } from "lucide-react";
import { toast } from "sonner";

// Define columns for locations table
const columns: Column<LocationData>[] = [
  {
    header: "Code",
    accessorKey: "code",
    cell: (item) => <div className="font-medium">{item.code}</div>,
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: (item) => (
      <div className="max-w-[500px] truncate">
        {item.name}
      </div>
    ),
  },
  {
    header: "Path",
    accessorKey: "path",
    cell: (item) => (
      <div className="max-w-[300px] truncate font-mono text-sm">
        {item.path || "-"}
      </div>
    ),
  },
  {
    header: "Level",
    accessorKey: "depth",
    cell: (item) => (
      <Badge variant="outline">
        Level {item.depth}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (item) => (
      <Badge variant={item.isActive ? "default" : "secondary"}>
        {item.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

// Define form fields for location creation/editing
const formFields = [
  {
    name: "code",
    label: "Code",
    type: "text" as const,
    placeholder: "e.g., BLDG-A-FL1-A01",
    required: true,
    validation: {
      pattern: /^[A-Z0-9-]+$/,
      message: "Code must contain only uppercase letters, numbers, and hyphens",
    },
  },
  {
    name: "name",
    label: "Name",
    type: "text" as const,
    placeholder: "e.g., Building A - First Floor - Aisle 01",
    required: true,
  },
  {
    name: "parentId",
    label: "Parent Location",
    type: "select" as const,
    placeholder: "Select parent location (optional)",
    options: [],
    description: "Leave empty for root locations",
  },
  {
    name: "isActive",
    label: "Status",
    type: "checkbox" as const,
    defaultValue: true,
    valueType: "boolean" as const,
    description: "Inactive locations cannot be used for inventory transactions",
  },
];

interface LocationsTabProps {
  warehouseId: string;
}

export function LocationsTab({ warehouseId }: LocationsTabProps) {
  const {
    locations,
    handleCreate,
    handleUpdate,
    isLoading,
  } = useLocations(warehouseId);

  // Get parent locations for the selected warehouse
  const getParentLocationOptions = () => {
    const buildPath = (location: LocationData, ancestors: LocationData[] = []): LocationData[] => {
      if (location.parentId) {
        const parent = locations.find(l => l.id === location.parentId);
        if (parent) {
          return buildPath(parent, [parent, ...ancestors]);
        }
      }
      return ancestors;
    };

    return locations
      .filter(l => l.isActive)
      .map(location => ({
        label: `${buildPath(location).map(p => p.name).join(' > ')}${buildPath(location).length > 0 ? ' > ' : ''}${location.name} (${location.code})`,
        value: location.id,
      }));
  };

  // Update form fields with dynamic parent options
  const updatedFormFields = formFields.map(field => {
    if (field.name === "parentId") {
      return {
        ...field,
        options: getParentLocationOptions(),
      };
    }
    return field;
  });

  return (
    <div className="space-y-6">
      {/* Header and Location Statistics */}
      <Card className="border-gray-200">
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{locations.length}</p>
                <p className="text-sm text-muted-foreground">Total Locations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {locations.filter(l => l.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {locations.filter(l => !l.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations Table */}
      <EntityManager
        entityName="Warehouse Location"
        entityNamePlural="Warehouse Locations"
        data={locations}
        columns={columns}
        formFields={updatedFormFields}
        keyExtractor={(item) => item.id}
        onCreate={async (data) => {
          await handleCreate(data as CreateLocationRequest);
        }}
        onUpdate={async (id, data) => {
          await handleUpdate(id as string, data as CreateLocationRequest);
        }}
        onDelete={async () => {
          // TODO: Implement delete functionality
          toast.info("Delete functionality not yet implemented");
        }}
        searchPlaceholder="Search locations..."
        isLoading={isLoading}
      />
    </div>
  );
}
