'use client';

import { FormField, FormFieldOption } from '@/components/entity-manager/types';

interface FormFieldsContext {
  finishedGoodsOptions: FormFieldOption[];
  rawMaterialsOptions: FormFieldOption[];
  isEditable: boolean;
}

export function getFormFields(context: FormFieldsContext): FormField[] {
  const { finishedGoodsOptions, rawMaterialsOptions, isEditable } = context;

  const fields: FormField[] = [
    {
      name: 'code',
      label: 'BOM Code',
      type: 'text',
      required: true,
      disabled: !isEditable,
      placeholder: 'e.g., BOM-001',
      description: 'Unique identifier for this BOM',
    },
    {
      name: 'name',
      label: 'BOM Name',
      type: 'text',
      required: true,
      disabled: !isEditable,
      placeholder: 'e.g., Product Assembly v1',
      description: 'Descriptive name for this BOM',
    },
    {
      name: 'parentMaterialId',
      label: 'Finished Good',
      type: 'select',
      required: true,
      disabled: !isEditable,
      options: finishedGoodsOptions,
      placeholder: 'Select finished good',
      description: 'The finished product this BOM produces',
    },
    {
      name: 'version',
      label: 'Version',
      type: 'text',
      required: true,
      disabled: !isEditable,
      placeholder: 'e.g., 1.0',
      description: 'Version number for tracking BOM changes',
    },
    {
      name: 'effectiveDate',
      label: 'Effective Date',
      type: 'date',
      disabled: !isEditable,
      description: 'When this BOM becomes effective',
    },
    {
      name: 'expiryDate',
      label: 'Expiry Date',
      type: 'date',
      disabled: !isEditable,
      description: 'When this BOM expires (optional)',
    },
    {
      name: 'lines',
      label: 'BOM Lines',
      type: 'nested-array',
      required: true,
      disabled: !isEditable,
      nestedArrayConfig: {
        itemLabel: 'Component',
        itemsLabel: 'Components',
        emptyMessage: 'No components added. Click "Add Component" to define raw materials.',
        columns: [
          {
            key: 'componentMaterialId',
            label: 'Raw Material',
            type: 'select',
            required: true,
            options: rawMaterialsOptions,
          },
          {
            key: 'quantity',
            label: 'Quantity',
            type: 'number',
            required: true,
            allowDecimal: true,
            decimalScale: 4,
          },
          {
            key: 'uom',
            label: 'UOM',
            type: 'text',
            required: true,
          },
          {
            key: 'scrapPercentage',
            label: 'Scrap %',
            type: 'number',
            required: false,
            allowDecimal: true,
            decimalScale: 2,
          },
        ],
      },
    },
  ];

  return fields;
}
