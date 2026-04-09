import { useState, useMemo, useEffect } from 'react';
import { EntityManagerProps, FormMode } from './types';
import { toast } from '@/lib/toast';

export function useEntityManager<T extends Record<string, unknown>>({
  data,
  entityName,
  entityNamePlural,
  keyExtractor,
  formFields,
  getFormTitle,
  getFormDescription,
  onCreate,
  onUpdate,
  onDelete,
  onView,
  onFormOpen,
  optimisticUpdates,
  isRowEditable,
  isRowDeletable,
}: EntityManagerProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Partial<T> | Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plural = entityNamePlural || `${entityName}s`;

  // Sync form data with optimistic updates when form is open
  useEffect(() => {
    if (!formMode || !selectedItem) return;

    const itemId = keyExtractor(selectedItem);
    const optimisticUpdate = optimisticUpdates?.get(itemId);

    if (optimisticUpdate) {
      setFormData((prev) => ({ ...prev, ...optimisticUpdate }));
    }
  }, [optimisticUpdates, formMode, selectedItem, keyExtractor]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      Object.values(item as object).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(query)
      )
    );
  }, [data, searchQuery]);

  // Form handlers
  const openCreateForm = () => {
    setFormMode('create');
    setSelectedItem(null);
    setFormData(
      formFields.reduce((acc, field) => {
        const record = acc as Record<string, unknown>;
        record[field.name] = field.defaultValue ?? '';
        return record as Partial<T>;
      }, {} as Partial<T>)
    );
  };

  const handleView = (item: T) => {
    if (onView) {
      onView(item);
      return;
    }
    setFormMode('view');
    setSelectedItem(item);
    // Apply optimistic updates to form data
    const optimisticUpdate = optimisticUpdates?.get(keyExtractor(item));
    setFormData(optimisticUpdate ? { ...item, ...optimisticUpdate } : item);
    onFormOpen?.(item);
  };

  const handleEdit = (item: T) => {
    if (isRowEditable && !isRowEditable(item)) {
      // If not editable, treat as view mode instead
      handleView(item);
      toast.info('Order is in read-only mode');
      return;
    }
    setFormMode('edit');
    setSelectedItem(item);
    // Apply optimistic updates to form data
    const optimisticUpdate = optimisticUpdates?.get(keyExtractor(item));
    setFormData(optimisticUpdate ? { ...item, ...optimisticUpdate } : item);
    onFormOpen?.(item);
  };

  const handleDelete = async (item: T) => {
    if (isRowDeletable && !isRowDeletable(item)) {
      toast.warning('Only DRAFT orders can be deleted');
      return;
    }
    if (onDelete) {
      const id = keyExtractor(item);
      await onDelete(id);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Clean the data (strip metadata and cast types)
      const cleanedData: Record<string, any> = {};
      const metadataFields = [
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'createdBy',
        'updatedBy',
        'deletedBy',
        'tenantId',
      ];

      formFields.forEach((field) => {
        const rawValue = (formData as any)[field.name];

        if (rawValue !== undefined && rawValue !== null) {
          // Priority 1: Explicit valueType
          if (field.valueType === 'number') {
            cleanedData[field.name] = rawValue === '' ? null : Number(rawValue);
          } else if (field.valueType === 'boolean') {
            cleanedData[field.name] = rawValue === 'true' || rawValue === true;
          } else if (field.valueType === 'string') {
            cleanedData[field.name] = String(rawValue);
          }
          // Priority 2: Inferred from field.type (Backward compatibility)
          else if (field.type === 'number') {
            cleanedData[field.name] = rawValue === '' ? null : Number(rawValue);
          } else if (field.type === 'select') {
            // Handle numeric strings in selects automatically if they look like IDs
            if (typeof rawValue === 'string' && /^\d+$/.test(rawValue)) {
              cleanedData[field.name] = Number(rawValue);
            } else if (rawValue === 'true') {
              cleanedData[field.name] = true;
            } else if (rawValue === 'false') {
              cleanedData[field.name] = false;
            } else {
              cleanedData[field.name] = rawValue;
            }
          } else {
            cleanedData[field.name] = rawValue;
          }
        }
      });

      if (formMode === 'create' && onCreate) {
        await onCreate(cleanedData as Partial<T>);
      } else if (formMode === 'edit' && onUpdate && selectedItem) {
        const id = keyExtractor(selectedItem);
        await onUpdate(id, cleanedData as Partial<T>);
      }
      setFormMode(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (name: string, value: string | number | boolean | unknown[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formTitle = useMemo(() => {
    if (getFormTitle && formMode) {
      return getFormTitle(formMode, selectedItem ?? undefined);
    }
    switch (formMode) {
      case 'create':
        return `Create ${entityName}`;
      case 'edit':
        return `Edit ${entityName}`;
      case 'view':
        return `View ${entityName}`;
      default:
        return entityName;
    }
  }, [getFormTitle, formMode, selectedItem, entityName]);

  const formDescription = useMemo(() => {
    if (getFormDescription && formMode) {
      return getFormDescription(formMode, selectedItem ?? undefined);
    }
    switch (formMode) {
      case 'create':
        return `Add a new ${entityName.toLowerCase()} to the system.`;
      case 'edit':
        return `Update the ${entityName.toLowerCase()} details.`;
      case 'view':
        return `View ${entityName.toLowerCase()} details.`;
      default:
        return '';
    }
  }, [getFormDescription, formMode, selectedItem, entityName]);

  return {
    searchQuery,
    setSearchQuery,
    formMode,
    setFormMode,
    formData,
    isSubmitting,
    plural,
    filteredData,
    formTitle,
    formDescription,
    openCreateForm,
    handleFormSubmit,
    handleFieldChange,
    handleView,
    handleEdit,
    handleDelete,
  };
}
