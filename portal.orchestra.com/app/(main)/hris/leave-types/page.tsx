'use client';

import React from 'react';
import EntityManager from '@/components/entity-manager/EntityManager';
import {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} from '@/store/api/leaveApi';
import { toast } from 'sonner';
import { columns } from './column';
import { formFields } from './form-fields';

export default function LeaveTypesPage() {
  const { data: response, isLoading, error } = useGetLeaveTypesQuery();
  const [createLeaveType] = useCreateLeaveTypeMutation();
  const [updateLeaveType] = useUpdateLeaveTypeMutation();
  const [deleteLeaveType] = useDeleteLeaveTypeMutation();

  const data = response || [];

  const handleCreate = async (formData: any) => {
    try {
      await createLeaveType(formData).unwrap();
      toast.success('Leave type created successfully');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to create leave type');
    }
  };

  const handleUpdate = async (id: string | number, formData: any) => {
    try {
      await updateLeaveType({ id: Number(id), data: formData }).unwrap();
      toast.success('Leave type updated successfully');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update leave type');
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteLeaveType(Number(id)).unwrap();
      toast.success('Leave type deleted successfully');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete leave type');
    }
  };

  return (
    <div className="p-6">
      <EntityManager
        entityName="Leave Type"
        entityNamePlural="Leave Types"
        data={data}
        isLoading={isLoading}
        error={error ? 'Failed to fetch leave types' : null}
        keyExtractor={(item: any) => item.id}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        columns={columns}
        formFields={formFields}
        searchPlaceholder="Search leave types..."
        permissions={{
          create: 'hris.leave_type.manage',
          update: 'hris.leave_type.manage',
          delete: 'hris.leave_type.manage',
          view: 'hris.leave_type.manage',
        }}
      />
    </div>
  );
}
