import { Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Material, MaterialType } from '@/store/api/materialsApi';
import { Eye, Edit, Trash2, Package, Box, Wrench, Settings } from 'lucide-react';

const getMaterialTypeIcon = (type: MaterialType) => {
  switch (type) {
    case MaterialType.RAW:
      return Package;
    case MaterialType.SEMI_FINISHED:
      return Wrench;
    case MaterialType.FINISHED:
      return Box;
    case MaterialType.SERVICE:
      return Settings;
    default:
      return Package;
  }
};

const getMaterialTypeColor = (type: MaterialType) => {
  switch (type) {
    case MaterialType.RAW:
      return 'bg-blue-100 text-blue-800';
    case MaterialType.SEMI_FINISHED:
      return 'bg-yellow-100 text-yellow-800';
    case MaterialType.FINISHED:
      return 'bg-green-100 text-green-800';
    case MaterialType.SERVICE:
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const columns: Column<Material>[] = [
  {
    header: 'SKU',
    accessorKey: 'sku',
    cell: (item) => <span className="font-mono text-sm">{item.sku}</span>,
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (item) => (
      <div>
        <span className="font-medium">{item.name}</span>
        {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
      </div>
    ),
  },
  {
    header: 'Type',
    accessorKey: 'materialType',
    cell: (item) => {
      const Icon = getMaterialTypeIcon(item.materialType);
      return (
        <Badge className={getMaterialTypeColor(item.materialType)}>
          <Icon className="w-3 h-3 mr-1" />
          {item.materialType.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    header: 'Group',
    accessorKey: 'materialGroup',
    cell: (item) => (
      <span className="text-sm">
        {item.materialGroup || <span className="text-gray-400">—</span>}
      </span>
    ),
  },
  {
    header: 'Base UoM',
    accessorKey: 'baseUom',
    cell: (item) => <span className="text-sm font-medium">{item.baseUom}</span>,
  },
  {
    header: 'Weight',
    cell: (item) => {
      if (!item.netWeight) return <span className="text-gray-400">—</span>;
      return (
        <span className="text-sm">
          {item.netWeight} {item.weightUom || 'kg'}
        </span>
      );
    },
  },
  {
    header: 'Status',
    accessorKey: 'isActive',
    cell: (item) => (
      <Badge variant={item.isActive ? 'default' : 'secondary'}>
        {item.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    header: 'Actions',
    className: 'text-right',
    cell: () => (
      <div className="flex items-center justify-end gap-2">
        {/* Actions are handled automatically by EntityManager if enabled */}
      </div>
    ),
  },
];
