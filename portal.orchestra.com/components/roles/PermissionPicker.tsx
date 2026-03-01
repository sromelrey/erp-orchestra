'use client';

import { useState } from 'react';
import { Permission } from '@/store/api/rolesApi';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PermissionPickerProps {
  permissions: Permission[];
  selectedPermissionIds: number[];
  onChange: (permissionIds: number[]) => void;
}

export function PermissionPicker({
  permissions,
  selectedPermissionIds,
  onChange,
}: PermissionPickerProps) {
  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleToggle = (permissionId: number) => {
    const newSelected = selectedPermissionIds.includes(permissionId)
      ? selectedPermissionIds.filter((id) => id !== permissionId)
      : [...selectedPermissionIds, permissionId];
    onChange(newSelected);
  };

  const handleSelectAllModule = (module: string) => {
    const modulePermissions = groupedPermissions[module];
    const modulePermissionIds = modulePermissions.map((p) => p.id);
    const allSelected = modulePermissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    );

    if (allSelected) {
      // Deselect all from this module
      onChange(
        selectedPermissionIds.filter((id) => !modulePermissionIds.includes(id))
      );
    } else {
      // Select all from this module
      const newSelected = [
        ...selectedPermissionIds,
        ...modulePermissionIds.filter((id) => !selectedPermissionIds.includes(id)),
      ];
      onChange(newSelected);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedPermissions).map(([module, modulePermissions]) => {
        const modulePermissionIds = modulePermissions.map((p) => p.id);
        const allSelected = modulePermissionIds.every((id) =>
          selectedPermissionIds.includes(id)
        );
        const someSelected = modulePermissionIds.some((id) =>
          selectedPermissionIds.includes(id)
        );

        return (
          <Card key={module}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium uppercase">
                  {module}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectAllModule(module)}
                >
                  {allSelected ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modulePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={selectedPermissionIds.includes(permission.id)}
                      onCheckedChange={() => handleToggle(permission.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={`permission-${permission.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {permission.resource}.{permission.action}
                      </Label>
                      {permission.description && (
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
