"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { Permission, UserPermission } from "@/types";
import { toast } from "sonner";

interface PermissionsTabProps {
  userPermissions: UserPermission[];
  allPermissions: Permission[];
  onAssignPermissions: (permissionIds: number[], type: "GRANT" | "DENY") => Promise<boolean>;
  onRemovePermissions: (permissionIds: number[]) => Promise<boolean>;
  isLoading?: boolean;
}

export function PermissionsTab({
  userPermissions,
  allPermissions,
  onAssignPermissions,
  onRemovePermissions,
  isLoading = false,
}: PermissionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAvailable, setSelectedAvailable] = useState<number[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<number[]>([]);
  const [permissionType, setPermissionType] = useState<"GRANT" | "DENY">("GRANT");

  // Get assigned permission IDs
  const assignedPermissionIds = useMemo(
    () => userPermissions.map((up) => up.permissionId),
    [userPermissions]
  );

  // Filter available permissions
  const availablePermissions = useMemo(
    () =>
      allPermissions
        .filter((p) => !assignedPermissionIds.includes(p.id))
        .filter(
          (p) =>
            p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.module.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [allPermissions, assignedPermissionIds, searchTerm]
  );

  // Get assigned permissions
  const assignedPermissions = useMemo(
    () =>
      userPermissions
        .map((up) => up.permission)
        .filter(
          (p) =>
            p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.module.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [userPermissions, searchTerm]
  );

  const handleAssign = async () => {
    if (selectedAvailable.length === 0) {
      toast.error("Please select permissions to assign");
      return;
    }

    const success = await onAssignPermissions(selectedAvailable, permissionType);
    if (success) {
      setSelectedAvailable([]);
    }
  };

  const handleRemove = async () => {
    if (selectedAssigned.length === 0) {
      toast.error("Please select permissions to remove");
      return;
    }

    const success = await onRemovePermissions(selectedAssigned);
    if (success) {
      setSelectedAssigned([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search permissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Permission Type Selector */}
      <div className="flex gap-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="GRANT"
            checked={permissionType === "GRANT"}
            onChange={(e) => setPermissionType(e.target.value as "GRANT" | "DENY")}
            disabled={isLoading}
          />
          <span className="text-sm">Grant Permissions</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="DENY"
            checked={permissionType === "DENY"}
            onChange={(e) => setPermissionType(e.target.value as "GRANT" | "DENY")}
            disabled={isLoading}
          />
          <span className="text-sm">Deny Permissions</span>
        </label>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Available Permissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Available Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availablePermissions.length === 0 ? (
                <p className="text-sm text-gray-500">No permissions available</p>
              ) : (
                availablePermissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAvailable.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAvailable([...selectedAvailable, permission.id]);
                        } else {
                          setSelectedAvailable(selectedAvailable.filter((id) => id !== permission.id));
                        }
                      }}
                      disabled={isLoading}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">{permission.slug}</div>
                      <div className="text-xs text-gray-500 truncate">{permission.module}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Permissions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Assigned Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {assignedPermissions.length === 0 ? (
                <p className="text-sm text-gray-500">No permissions assigned</p>
              ) : (
                assignedPermissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAssigned.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssigned([...selectedAssigned, permission.id]);
                        } else {
                          setSelectedAssigned(selectedAssigned.filter((id) => id !== permission.id));
                        }
                      }}
                      disabled={isLoading}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">{permission.slug}</div>
                      <div className="text-xs text-gray-500 truncate">{permission.module}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-2">
        <Button
          onClick={handleAssign}
          disabled={selectedAvailable.length === 0 || isLoading}
          variant="default"
          size="sm"
        >
          <ChevronRight className="w-4 h-4 mr-2" />
          Assign
        </Button>
        <Button
          onClick={handleRemove}
          disabled={selectedAssigned.length === 0 || isLoading}
          variant="destructive"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>
    </div>
  );
}
