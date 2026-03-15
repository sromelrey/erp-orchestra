"use client";

import { useMemo, useState } from "react";
import { Permission, Role } from "@/types";
import { usePermissionFilters } from "./use-permission-filters";
import { usePermissionSelection } from "./use-permission-selection";

export function usePermissionManager(role: Role) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock permissions data - in real app, this would come from API
  const allPermissions: Permission[] = useMemo(() => {
    if (!role?.rolePermissions) return [];
    return role.rolePermissions.map((rp) => rp.permission);
  }, [role.rolePermissions]);

  // Group permissions by module
  const modules = useMemo(() => {
    const moduleGroups = allPermissions.reduce(
      (acc, permission) => {
        if (!acc[permission.module]) {
          acc[permission.module] = {
            permissions: [],
            selectedCount: 0,
            totalCount: 0,
          };
        }
        acc[permission.module].permissions.push(permission);
        return acc;
      },
      {} as Record<
        string,
        { permissions: Permission[]; selectedCount: number; totalCount: number }
      >,
    );

    // Add selection counts
    Object.keys(moduleGroups).forEach((module) => {
      const moduleSelectedPermissions =
        selectedModule === module
          ? allPermissions.filter((p) => p.module === module)
          : [];
      moduleGroups[module] = {
        ...moduleGroups[module],
        selectedCount: moduleSelectedPermissions.length,
        totalCount: moduleGroups[module].permissions.length,
      };
    });

    return moduleGroups;
  }, [allPermissions, selectedModule]);

  // Use custom hooks for filters and selection
  const {
    filters,
    filteredPermissions,
    updateFilters,
    clearFilters,
    toggleActionType,
    toggleResource,
  } = usePermissionFilters(allPermissions, selectedModule);

  const {
    selectedIds,
    togglePermission,
    selectAllInModule,
    selectAllFiltered,
    selectByActionType,
    invertSelection,
    clearSelection,
    setSelection,
    isSelected,
  } = usePermissionSelection();

  // Group filtered permissions by action type
  const actionGroups = useMemo(() => {
    if (!selectedModule) return {};

    const modulePermissions = filteredPermissions.filter(
      (p) => p.module === selectedModule,
    );

    return modulePermissions.reduce(
      (acc, permission) => {
        const actionType = permission.action;
        if (!acc[actionType]) {
          acc[actionType] = [];
        }
        acc[actionType].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>,
    );
  }, [filteredPermissions, selectedModule]);

  const handleModuleSelect = (module: string) => {
    setSelectedModule(module);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getActionBadgeClasses = (action: string) => {
    switch (action.toLowerCase()) {
      case "view":
      case "read":
        return "bg-sky-100 text-sky-700 border-sky-200";
      case "create":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "update":
      case "edit":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "delete":
      case "remove":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "manage":
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return {
    // State
    selectedModule,
    isFullscreen,
    modules,
    allPermissions,
    filteredPermissions,
    actionGroups,

    // Filters
    filters,
    updateFilters,
    clearFilters,
    toggleActionType,
    toggleResource,

    // Selection
    selectedIds,
    togglePermission,
    selectAllInModule,
    selectAllFiltered,
    selectByActionType,
    invertSelection,
    clearSelection,
    setSelection,
    isSelected,

    // Actions
    handleModuleSelect,
    handleToggleFullscreen,
    getActionBadgeClasses,
  };
}
