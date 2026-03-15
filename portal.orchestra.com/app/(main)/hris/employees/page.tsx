"use client";

import { Users, Save, X, AlertCircle } from "lucide-react";
import { EntityManager } from "@/components/entity-manager";
import { Button } from "@/components/ui/button";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { HasPermission } from "@/components/auth/HasPermission";
import { columns } from "./column";
import { useEmployee } from "@/hooks/hris/useEmployee";

export default function EmployeesPage() {
  const {
    data,
    isLoading,
    stats,
    formFields,
    renderExpandedRow,
    handleUpdate,
    handleDelete,
    handleBulkSave,
    handleBulkDiscard,
    dirtyEmployeeIds,
    handleAddEmployee,
  } = useEmployee();

  return (
    <PermissionGuard permission="hris.employee.view">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Employees</h2>
          </div>
          <HasPermission permission="hris.employee.manage">
            <Button className="gap-2" onClick={handleAddEmployee}>
              <Users className="h-4 w-4" />
              Add Employee
            </Button>
          </HasPermission>
        </div>

        {/* Bulk Save Controls */}
        {dirtyEmployeeIds.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  {dirtyEmployeeIds.length} employee(s) have unsaved changes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HasPermission permission="hris.compensation.manage">
                  <Button
                    onClick={handleBulkDiscard}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Discard All
                  </Button>
                  <Button onClick={handleBulkSave} size="sm" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save All Changes
                  </Button>
                </HasPermission>
              </div>
            </div>
          </div>
        )}

        <EntityManager
          entityName="Employee"
          entityNamePlural="Employees"
          data={data}
          columns={columns}
          formFields={formFields}
          keyExtractor={(item) => item.id}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          stats={stats}
          searchPlaceholder="Search employees..."
          isLoading={isLoading}
          expandedRow={renderExpandedRow}
        />
      </div>
    </PermissionGuard>
  );
}
