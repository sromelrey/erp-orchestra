"use client";

import { useMemo, useState } from "react";
import { Permission } from "@/types";
import { PermissionFilters } from "../types";

export function usePermissionFilters(
  allPermissions: Permission[],
  selectedModule: string | null
) {
  const [filters, setFilters] = useState<PermissionFilters>({
    searchQuery: "",
    actionTypes: [],
    resources: [],
  });

  const filteredPermissions = useMemo(() => {
    let filtered = allPermissions;

    // Apply search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(
        (permission) =>
          permission.slug
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          permission.description
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          permission.resource
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          permission.action
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()),
      );
    }

    // Apply action type filter
    if (filters.actionTypes.length > 0) {
      filtered = filtered.filter((permission) =>
        filters.actionTypes.includes(permission.action)
      );
    }

    // Apply resource filter
    if (filters.resources.length > 0) {
      filtered = filtered.filter((permission) =>
        filters.resources.includes(permission.resource)
      );
    }

    // Apply module filter
    if (selectedModule) {
      filtered = filtered.filter((permission) => permission.module === selectedModule);
    }

    return filtered;
  }, [allPermissions, filters, selectedModule]);

  const updateFilters = (newFilters: Partial<PermissionFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      actionTypes: [],
      resources: [],
    });
  };

  const toggleActionType = (actionType: string) => {
    setFilters((prev) => ({
      ...prev,
      actionTypes: prev.actionTypes.includes(actionType)
        ? prev.actionTypes.filter((t) => t !== actionType)
        : [...prev.actionTypes, actionType],
    }));
  };

  const toggleResource = (resource: string) => {
    setFilters((prev) => ({
      ...prev,
      resources: prev.resources.includes(resource)
        ? prev.resources.filter((r) => r !== resource)
        : [...prev.resources, resource],
    }));
  };

  return {
    filters,
    filteredPermissions,
    updateFilters,
    clearFilters,
    toggleActionType,
    toggleResource,
  };
}
