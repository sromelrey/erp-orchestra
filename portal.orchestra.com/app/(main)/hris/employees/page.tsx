"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "./column";
import { formFields as baseFormFields } from "./form-fields";
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "@/store/api/employeesApi";
import { useGetDepartmentsQuery } from "@/store/api/departmentsApi";
import { useGetDesignationsQuery } from "@/store/api/designationsApi";
import { useGetBranchesQuery } from "@/store/api/branchesApi";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { toast } from "sonner";
import { Employee, Department, Designation, Branch } from "@/types";

export default function EmployeesPage() {
  const { data: response, isLoading } = useGetEmployeesQuery({});
  
  // Fetch relational data for dropdowns
  const { data: deptResponse } = useGetDepartmentsQuery({});
  const { data: desigResponse } = useGetDesignationsQuery({});
  const { data: branchResponse } = useGetBranchesQuery({});

  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const data = useMemo(() => response?.data || [], [response?.data]);
  const activeCount = data.filter((emp: Employee) => emp.status === "ACTIVE").length;

  const stats: StatCard[] = [
    {
      label: "Total Employees",
      value: data.length,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Active Employees",
      value: activeCount,
      icon: Users,
      color: "bg-green-100 text-green-700",
    },
  ];

  // Inject dropdown options into formFields
  const dynamicFormFields = useMemo(() => {
    const managers = data.map((emp: Employee) => ({
      label: `${emp.firstName} ${emp.lastName}`,
      value: emp.id.toString(),
    }));

    const departments = (deptResponse?.data || []).map((d: Department) => ({
      label: d.name,
      value: d.id.toString(),
    }));

    const designations = (desigResponse?.data || []).map((d: Designation) => ({
      label: d.name,
      value: d.id.toString(),
    }));

    const branches = (branchResponse?.data || []).map((b: Branch) => ({
      label: b.name,
      value: b.id.toString(),
    }));

    return baseFormFields.map((field) => {
      switch (field.name) {
        case "departmentId":
          return { ...field, options: departments };
        case "designationId":
          return { ...field, options: designations };
        case "branchId":
          return { ...field, options: branches };
        case "managerId":
          return { ...field, options: managers };
        default:
          return field;
      }
    });
  }, [data, deptResponse, desigResponse, branchResponse]);

  const handleCreate = async (formData: Partial<Employee> & { createUserAccount?: string | boolean }) => {
    try {
      // Convert toggle value "true"/"false" to boolean
      if (formData.createUserAccount === "true") formData.createUserAccount = true;
      if (formData.createUserAccount === "false") formData.createUserAccount = false;
      
      // Convert relational IDs to numbers if present, else remove them
      if (formData.departmentId) formData.departmentId = Number(formData.departmentId);
      else delete formData.departmentId;
      
      if (formData.designationId) formData.designationId = Number(formData.designationId);
      else delete formData.designationId;
      
      if (formData.branchId) formData.branchId = Number(formData.branchId);
      else delete formData.branchId;
      
      if (formData.managerId) formData.managerId = Number(formData.managerId);
      else delete formData.managerId;

      await createEmployee(formData as Partial<Employee> & { createUserAccount?: boolean }).unwrap();
      toast.success("Employee created successfully");
    } catch {
      toast.error("Failed to create employee");
    }
  };

  const handleUpdate = async (id: string | number, formData: Partial<Employee> & { createUserAccount?: string | boolean }) => {
    try {
      // Drop createUserAccount for updates as our backend DTO doesn't use it
      delete formData.createUserAccount;

      if (formData.departmentId) formData.departmentId = Number(formData.departmentId);
      else delete formData.departmentId;

      if (formData.designationId) formData.designationId = Number(formData.designationId);
      else delete formData.designationId;

      if (formData.branchId) formData.branchId = Number(formData.branchId);
      else delete formData.branchId;

      if (formData.managerId) formData.managerId = Number(formData.managerId);
      else delete formData.managerId;

      await updateEmployee({ id, body: formData }).unwrap();
      toast.success("Employee updated successfully");
    } catch {
      toast.error("Failed to update employee");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee deleted successfully");
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <PermissionGuard permission="hris.employee.view">
      <div className="p-6">
        <EntityManager
          entityName="Employee"
          entityNamePlural="Employees"
          data={data}
          columns={columns}
          formFields={dynamicFormFields}
          keyExtractor={(item) => item.id}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          stats={stats}
          searchPlaceholder="Search employees..."
          isLoading={isLoading}
        />
      </div>
    </PermissionGuard>
  );
}
