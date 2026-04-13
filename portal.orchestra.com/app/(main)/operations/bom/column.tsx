'use client';

import { Column } from '@/components/ui/data-table';
import { Bom } from '@/store/api/bomApi';
import { format } from 'date-fns';

export function getStatusBadge(isActive: boolean) {
  const colorClass = isActive
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-800';
  const label = isActive ? 'Active' : 'Inactive';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

export const columns: Column<Bom>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: (bom: Bom) => (
      <span className="font-medium">{bom.code}</span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: (bom: Bom) => (
      <span>{bom.name}</span>
    ),
  },
  {
    accessorKey: 'parentMaterial',
    header: 'Finished Good',
    cell: (bom: Bom) => (
      <span>{bom.parentMaterial?.name || `Material #${bom.parentMaterialId}`}</span>
    ),
  },
  {
    accessorKey: 'version',
    header: 'Version',
    cell: (bom: Bom) => (
      <span className="text-sm">{bom.version}</span>
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: (bom: Bom) => getStatusBadge(bom.isActive),
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: (bom: Bom) => (
      <span className="text-sm text-gray-600">{bom.items?.length || 0} items</span>
    ),
  },
  {
    accessorKey: 'effectiveDate',
    header: 'Effective Date',
    cell: (bom: Bom) => (
      <span className="text-sm">
        {bom.effectiveDate ? format(new Date(bom.effectiveDate), 'MMM dd, yyyy') : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: (bom: Bom) => (
      <span className="text-sm">
        {bom.createdAt ? format(new Date(bom.createdAt), 'MMM dd, yyyy HH:mm') : '-'}
      </span>
    ),
  },
];
