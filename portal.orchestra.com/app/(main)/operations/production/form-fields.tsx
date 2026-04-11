'use client';

import { FormField, FormFieldOption } from '@/components/entity-manager/types';
import { ProductionStatus } from '@/store/api/productionApi';

interface FormFieldsContext {
  bomOptions: FormFieldOption[];
  currentStatus?: ProductionStatus;
  isProcessing?: boolean;
}

export function getFormFields(context: FormFieldsContext): FormField[] {
  const { bomOptions, currentStatus, isProcessing } = context;

  // Only PLANNED batches are editable (not CANCELLED or other statuses)
  // Also disable when processing workflow actions
  const isEditable = (!currentStatus || currentStatus === ProductionStatus.PLANNED) && !isProcessing;

  const fields: FormField[] = [
    {
      name: 'bomId',
      label: 'Bill of Materials (BOM)',
      type: 'select',
      required: true,
      disabled: !isEditable,
      options: bomOptions,
      placeholder: 'Select BOM',
      description: 'The BOM defines the materials and steps required for production',
    },
    {
      name: 'plannedQuantity',
      label: 'Planned Quantity',
      type: 'number',
      required: true,
      disabled: !isEditable,
      placeholder: 'Enter planned quantity',
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      disabled: !isEditable,
      placeholder: 'Planned start date',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      disabled: !isEditable,
      placeholder: 'Planned end date',
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      disabled: !isEditable,
      placeholder: 'Enter any additional notes...',
    },
    {
      name: 'workOrders',
      label: 'Work Orders',
      type: 'nested-array',
      disabled: !isEditable,
      nestedArrayConfig: {
        itemLabel: 'Work Order',
        itemsLabel: 'Work Orders',
        emptyMessage: 'No work orders added. Click "Add Work Order" to define production steps.',
        columns: [
          {
            key: 'stepName',
            label: 'Step Name',
            type: 'text',
            required: true,
          },
          {
            key: 'notes',
            label: 'Notes',
            type: 'text',
            required: false,
          },
        ],
      },
    },
  ];

  return fields;
}
