'use client';

import { useState } from 'react';

export function usePermissionSelection(initialPermissions: number[] = []) {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialPermissions);

  const togglePermission = (permissionId: number) => {
    setSelectedIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const selectAllInModule = (moduleName: string, modulePermissionIds: number[]) => {
    const allSelected = modulePermissionIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Deselect all in module
      setSelectedIds((prev) => prev.filter((id) => !modulePermissionIds.includes(id)));
    } else {
      // Select all in module
      setSelectedIds((prev) => [
        ...prev,
        ...modulePermissionIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const selectAllFiltered = (filteredPermissionIds: number[]) => {
    const allSelected = filteredPermissionIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Deselect all filtered
      setSelectedIds((prev) => prev.filter((id) => !filteredPermissionIds.includes(id)));
    } else {
      // Select all filtered
      setSelectedIds((prev) => [
        ...prev,
        ...filteredPermissionIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const selectByActionType = (actionType: string, actionPermissionIds: number[]) => {
    const allSelected = actionPermissionIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      // Deselect all of this action type
      setSelectedIds((prev) => prev.filter((id) => !actionPermissionIds.includes(id)));
    } else {
      // Select all of this action type
      setSelectedIds((prev) => [
        ...prev,
        ...actionPermissionIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const invertSelection = (allVisibleIds: number[]) => {
    const newSelection: number[] = [];

    allVisibleIds.forEach((id) => {
      if (!selectedIds.includes(id)) {
        newSelection.push(id);
      }
    });

    setSelectedIds(newSelection);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const setSelection = (permissionIds: number[]) => {
    setSelectedIds(permissionIds);
  };

  return {
    selectedIds,
    togglePermission,
    selectAllInModule,
    selectAllFiltered,
    selectByActionType,
    invertSelection,
    clearSelection,
    setSelection,
    isSelected: (id: number) => selectedIds.includes(id),
  };
}
