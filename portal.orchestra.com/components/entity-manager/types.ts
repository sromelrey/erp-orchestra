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
  | 'custom'
  | 'nested-array';

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
  // For nested array fields (like items in a sales order)
  nestedArrayConfig?: {
    columns: Array<{
      key: string;
      label: string;
      type: 'text' | 'number' | 'select';
      options?: FormFieldOption[];
      required?: boolean;
      width?: 'full' | 'half';
      // For dependent columns within nested arrays
      dependsOn?: string; // Column key this column depends on
      getOptions?: (dependencyValue: string | number) => Promise<FormFieldOption[]> | FormFieldOption[];
    }>;
    itemLabel?: string; // e.g., "Item"
    itemsLabel?: string; // e.g., "Items"
    emptyMessage?: string;
  };
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
  onFormOpen?: (item: T) => void; // Called when form opens with an item
  onFormClose?: () => void; // Called when form is closed

  // Optional customization
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean; // For initial data fetch
  isMutating?: boolean; // For create/update/delete mutations
  isProcessing?: boolean; // For workflow action processing (locks form)
  error?: string | null;

  // Stats cards (optional)
  stats?: StatCard[];

  // Action buttons customization
  showViewButton?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;

  // Row-level edit/delete control
  isRowEditable?: (item: T) => boolean;
  isRowDeletable?: (item: T) => boolean;

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

  // Workflow actions (optional)
  workflowActions?: WorkflowAction<T>[];

  // Optimistic updates (optional)
  optimisticUpdates?: Map<string | number, Partial<T>>;

  // Custom header for form (optional)
  header?: (formData: Partial<T> | Record<string, unknown>) => React.ReactNode;

  // Form customization
  formWidth?: string; // Can be percentage like "60%" or fixed like "lg"
}

/**
 * Workflow action definition for use in EntityManager
 * @template TItem - The entity item type
 */
export type WorkflowAction<TItem> = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: TItem) => void | Promise<void>;
  permission?: string;
  isVisible?: (item: TItem) => boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string | ((item: TItem) => string);
  // 🔹 Enhancement: Structured confirmation config for custom dialog
  confirm?: {
    title: string | ((item: TItem) => string);
    description: string | ((item: TItem) => string);
    variant?: 'default' | 'destructive';
    confirmLabel?: string;
  };
};
