import { Column } from '@/components/ui/data-table';
import { ReactNode } from 'react';

export type FormFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'select'
  | 'textarea'
  | 'date'
  | 'password'
  | 'checkbox'
  | 'custom';

export interface FormFieldOption {
  label: string;
  value: string | number;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[]; // For select fields
  defaultValue?: string | number | boolean;
  disabled?: boolean;
  suffix?: ReactNode; // For custom suffixes like ".orchestra.com"
  description?: string; // Helper text below the field
  width?: 'full' | 'half';
  valueType?: 'string' | 'number' | 'boolean';
  render?: (props: {
    value: string | number | boolean;
    onChange: (value: string | number | boolean) => void;
    formData: Record<string, string | number | boolean | undefined>;
    field: FormField;
    isDisabled: boolean;
  }) => ReactNode;
  // For dependent fields
  dependsOn?: string; // Field name this field depends on
  getOptions?: (dependencyValue: string | number | boolean) => Promise<FormFieldOption[]> | FormFieldOption[];
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string; // Tailwind color classes
}

export type FormMode = 'create' | 'edit' | 'view';

export interface EntityManagerProps<T> {
  // Data
  data: T[];
  columns: Column<T>[];

  // Identifiers
  entityName: string;
  entityNamePlural?: string;
  keyExtractor: (item: T) => string | number;

  // Form configuration
  formFields: FormField[];
  getFormTitle?: (mode: FormMode, item?: T) => string;
  getFormDescription?: (mode: FormMode, item?: T) => string;

  // CRUD handlers
  onCreate?: (data: Partial<T>) => void | Promise<void>;
  onUpdate?: (id: string | number, data: Partial<T>) => void | Promise<void>;
  onDelete?: (id: string | number) => void | Promise<void>;
  onView?: (item: T) => void;

  // Optional customization
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  error?: string | null;

  // Stats cards (optional)
  stats?: StatCard[];

  // Action buttons customization
  showViewButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;

  // Expandable row support
  expandedRow?: (item: T) => React.ReactNode;

  /**
   * Permissions required for various CRUD operations.
   * If provided, the EntityManager will automatically hide buttons
   * using HasPermission.
   */
  permissions?: {
    create?: string;
    update?: string;
    delete?: string;
    view?: string;
  };
}
