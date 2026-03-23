'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Users } from 'lucide-react';
import { StatCard } from '@/components/entity-manager';
import { formFields as baseFormFields } from '@/app/(main)/hris/employees/form-fields';
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from '@/store/api/employeesApi';
import {
  useCreateEmployeeCompensationMutation,
  useUpdateEmployeeCompensationMutation,
  useLazyGetEmployeeCompensationQuery,
  useCreateEmployeeDeductionMutation,
  useUpdateEmployeeDeductionMutation,
  useLazyGetEmployeeDeductionsQuery,
  EmployeeCompensation,
  EmployeeDeduction,
} from '@/store/api/compensationApi';
import { useGetDepartmentsQuery } from '@/store/api/departmentsApi';
import { useGetDesignationsQuery } from '@/store/api/designationsApi';
import { useGetBranchesQuery } from '@/store/api/branchesApi';
import { Employee, Department, Designation, Branch } from '@/types';
import {
  useInlineEdits,
  EmployeeInlineEditor,
  DraftCompensation,
  DraftDeduction,
} from '@/components/hris/employees/inline-edit';

// Orchestrates employee listing data, inline edits, and helper handlers for the Employees page.
export function useEmployee() {
  const router = useRouter();
  const { data: response, isLoading } = useGetEmployeesQuery({});

  // Fetch relational data for dropdowns
  const { data: deptResponse } = useGetDepartmentsQuery({});
  const { data: desigResponse } = useGetDesignationsQuery({});
  const { data: branchResponse } = useGetBranchesQuery({});

  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  // Compensation and Deductions mutations
  const [createCompensation] = useCreateEmployeeCompensationMutation();
  const [updateCompensation] = useUpdateEmployeeCompensationMutation();
  const [fetchCompensation] = useLazyGetEmployeeCompensationQuery();
  const [createDeduction] = useCreateEmployeeDeductionMutation();
  const [updateDeduction] = useUpdateEmployeeDeductionMutation();
  const [fetchDeductions] = useLazyGetEmployeeDeductionsQuery();

  // Inline editing state
  const inlineEdits = useInlineEdits();
  const [editingEmployeeIds, setEditingEmployeeIds] = useState<Set<number>>(new Set());

  // Initialize employee data when loaded
  const [employeeData, setEmployeeData] = useState<
    Record<number, { compensation?: EmployeeCompensation; deductions?: EmployeeDeduction[] }>
  >({});

  // Fetch data for each employee
  useEffect(() => {
    const fetchEmployeeData = async () => {
      const newData: typeof employeeData = {};

      for (const emp of response?.data || []) {
        try {
          const [compensation, deductions] = await Promise.all([
            fetchCompensation(emp.id).unwrap(),
            fetchDeductions(emp.id).unwrap(),
          ]);

          newData[emp.id] = {
            compensation: compensation?.[0],
            deductions: deductions || [],
          };
        } catch (error) {
          console.error(`Failed to fetch data for employee ${emp.id}:`, error);
          newData[emp.id] = {
            compensation: undefined,
            deductions: [],
          };
        }
      }

      setEmployeeData(newData);
    };

    if (response?.data && response.data.length > 0) {
      fetchEmployeeData();
    }
  }, [response?.data, fetchCompensation, fetchDeductions]);

  const data = useMemo(() => response?.data || [], [response?.data]);
  const activeCount = data.filter((emp: Employee) => emp.status === 'ACTIVE').length;

  const stats: StatCard[] = useMemo(
    () => [
      {
        label: 'Total Employees',
        value: data.length,
        icon: Users,
        color: 'bg-primary/10 text-primary',
      },
      {
        label: 'Active Employees',
        value: activeCount,
        icon: Users,
        color: 'bg-green-100 text-green-700',
      },
    ],
    [data.length, activeCount]
  );

  // Inject dropdown options into formFields
  const formFields = useMemo(() => {
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
        case 'departmentId':
          return { ...field, options: departments };
        case 'designationId':
          return { ...field, options: designations };
        case 'branchId':
          return { ...field, options: branches };
        case 'managerId':
          return { ...field, options: managers };
        default:
          return field;
      }
    });
  }, [data, deptResponse, desigResponse, branchResponse]);

  // Normalize update payloads and persist employee profile changes
  const handleUpdate = async (
    id: string | number,
    formData: Partial<Employee> & { createUserAccount?: string | boolean }
  ) => {
    try {
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
      toast.success('Employee updated successfully');
    } catch {
      toast.error('Failed to update employee');
    }
  };

  // Delete an employee record
  const handleDelete = async (id: string | number) => {
    try {
      await deleteEmployee(id).unwrap();
      toast.success('Employee deleted successfully');
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  // Toggle inline edit mode for a given employee
  const handleToggleEdit = useCallback((employeeId: number) => {
    setEditingEmployeeIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) newSet.delete(employeeId);
      else newSet.add(employeeId);
      return newSet;
    });
  }, []);

  // Stage compensation edits for an employee
  const handleCompensationUpdate = (employeeId: number, updates: DraftCompensation) => {
    inlineEdits.updateEmployeeCompensation(employeeId, updates);
  };

  // Stage deduction edits for an employee
  const handleDeductionUpdate = (
    employeeId: number,
    deductionIndex: number,
    updates: Partial<DraftDeduction>
  ) => {
    inlineEdits.updateEmployeeDeduction(employeeId, deductionIndex, updates);
  };

  // Add a new deduction draft row
  const handleDeductionAdd = (employeeId: number) => {
    inlineEdits.addEmployeeDeduction(employeeId);
  };

  // Remove a deduction draft row
  const handleDeductionRemove = (employeeId: number, deductionIndex: number) => {
    inlineEdits.removeEmployeeDeduction(employeeId, deductionIndex);
  };

  // Persist compensation and deduction edits for one employee
  const handleSaveEmployee = async (employeeId: number) => {
    if (!inlineEdits.validateEmployeeEdits(employeeId)) return;

    inlineEdits.setEmployeeSaving(employeeId, true);
    const edits = inlineEdits.getEmployeeEdits(employeeId);

    if (!edits) {
      inlineEdits.setEmployeeSaving(employeeId, false);
      return;
    }

    try {
      if (edits.compensation) {
        const compensationData = {
          baseSalary: edits.compensation.baseSalary,
          hourlyRate: edits.compensation.hourlyRate,
          overtimeRate: edits.compensation.overtimeRate,
          currency: edits.compensation.currency || 'PHP',
          paymentFrequency: edits.compensation.paymentFrequency,
          effectiveDate: edits.compensation.effectiveDate || new Date().toISOString().split('T')[0],
          endDate: edits.compensation.endDate,
          changeReason: edits.compensation.changeReason,
        };

        if (edits.compensation.id) {
          await updateCompensation({
            employeeId,
            id: edits.compensation.id,
            body: compensationData,
          }).unwrap();
        } else {
          await createCompensation({
            employeeId,
            body: compensationData,
          }).unwrap();
        }
      }

      if (edits.deductions) {
        for (const deduction of edits.deductions) {
          const deductionData = {
            name: deduction.name,
            type: deduction.type,
            amount: deduction.amount,
            percentage: deduction.percentage,
            frequency: deduction.frequency,
            effectiveDate: deduction.effectiveDate || new Date().toISOString().split('T')[0],
            endDate: deduction.endDate,
            description: deduction.description,
          };

          if (deduction.id) {
            await updateDeduction({
              employeeId,
              id: deduction.id,
              body: deductionData,
            }).unwrap();
          } else if (deduction.name) {
            await createDeduction({ employeeId, body: deductionData }).unwrap();
          }
        }
      }

      inlineEdits.clearEmployeeEdits(employeeId);
      setEditingEmployeeIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });

      toast.success(`Employee ${employeeId} compensation and deductions saved successfully`);
    } catch (error: unknown) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save changes';
      inlineEdits.setEmployeeError(employeeId, errorMessage);
      toast.error(errorMessage);
    } finally {
      inlineEdits.setEmployeeSaving(employeeId, false);
    }
  };

  // Cancel edits for one employee
  const handleCancelEdit = (employeeId: number) => {
    inlineEdits.clearEmployeeEdits(employeeId);
    setEditingEmployeeIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(employeeId);
      return newSet;
    });
  };

  // Persist edits for all dirty employees
  const handleBulkSave = async () => {
    const dirtyEmployeeIds = inlineEdits.getDirtyEmployeeIds();
    if (dirtyEmployeeIds.length === 0) return;

    let successCount = 0;
    let failureCount = 0;

    for (const employeeId of dirtyEmployeeIds) {
      try {
        await handleSaveEmployee(employeeId);
        successCount++;
      } catch {
        failureCount++;
      }
    }

    if (successCount > 0) toast.success(`${successCount} employee(s) saved successfully`);
    if (failureCount > 0) toast.error(`${failureCount} employee(s) failed to save`);
  };

  // Discard edits for all dirty employees
  const handleBulkDiscard = () => {
    const dirtyEmployeeIds = inlineEdits.getDirtyEmployeeIds();
    dirtyEmployeeIds.forEach((employeeId) => {
      inlineEdits.clearEmployeeEdits(employeeId);
      setEditingEmployeeIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });
    });
    toast.success('All unsaved changes discarded');
  };

  // Build the expanded row UI for an employee
  const renderExpandedRow = (employee: Employee): React.ReactNode => {
    const empData = employeeData[employee.id];
    const compensation = empData?.compensation;
    const deductions = empData?.deductions || [];
    const isEditing = editingEmployeeIds.has(employee.id);
    const isDirty = inlineEdits.isEmployeeDirty(employee.id);
    const hasErrors =
      Object.keys(inlineEdits.state.errorsByEmployeeId[employee.id] || {}).length > 0;
    const isSaving = inlineEdits.state.savingByEmployeeId[employee.id] || false;
    const errors = inlineEdits.state.errorsByEmployeeId[employee.id];

    const edits = inlineEdits.getEmployeeEdits(employee.id);
    const currentCompensation = edits?.compensation || compensation;
    const currentDeductions = edits?.deductions || deductions;

    return React.createElement(EmployeeInlineEditor, {
      employee,
      isEditing,
      onToggleEdit: () => handleToggleEdit(employee.id),
      isDirty,
      hasErrors,
      isSaving,
      compensation: currentCompensation,
      deductions: currentDeductions,
      onCompensationUpdate: (updates: DraftCompensation) =>
        handleCompensationUpdate(employee.id, updates),
      onDeductionUpdate: (index: number, updates: Partial<DraftDeduction>) =>
        handleDeductionUpdate(employee.id, index, updates),
      onDeductionAdd: () => handleDeductionAdd(employee.id),
      onDeductionRemove: (index: number) => handleDeductionRemove(employee.id, index),
      onSave: () => handleSaveEmployee(employee.id),
      onCancel: () => handleCancelEdit(employee.id),
      errors,
      inlineEdits,
    });
  };

  const dirtyEmployeeIds = inlineEdits.getDirtyEmployeeIds();

  // Redirect to onboarding flow
  const handleAddEmployee = () => router.push('/hris/employees/onboarding');

  return {
    data,
    isLoading,
    stats,
    formFields,
    handleUpdate,
    handleDelete,
    handleBulkSave,
    handleBulkDiscard,
    renderExpandedRow,
    dirtyEmployeeIds,
    handleAddEmployee,
  };
}
