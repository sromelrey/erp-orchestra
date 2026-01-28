import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/ui/data-table";
import { EntityManagerProps, FormMode } from "./types";

export function useEntityManager<T extends Record<string, any>>({
  data,
  columns,
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
  showViewButton,
  showEditButton,
  showDeleteButton,
}: EntityManagerProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plural = entityNamePlural || `${entityName}s`;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(query)
      )
    );
  }, [data, searchQuery]);

  // Form handlers
  const openCreateForm = () => {
    setFormMode("create");
    setSelectedItem(null);
    setFormData(
      formFields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue ?? "";
        return acc;
      }, {} as Record<string, any>)
    );
  };

  const handleView = (item: T) => {
    if (onView) {
      onView(item);
      return;
    }
    setFormMode("view");
    setSelectedItem(item);
    setFormData(item);
  };

  const handleEdit = (item: T) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormData(item);
  };

  const handleDelete = async (item: T) => {
    if (onDelete) {
      const id = keyExtractor(item);
      await onDelete(id);
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (formMode === "create" && onCreate) {
        await onCreate(formData);
      } else if (formMode === "edit" && onUpdate && selectedItem) {
        const id = keyExtractor(selectedItem);
        await onUpdate(id, formData);
      }
      setFormMode(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formTitle = useMemo(() => {
    if (getFormTitle && formMode) {
      return getFormTitle(formMode, selectedItem ?? undefined);
    }
    switch (formMode) {
      case "create":
        return `Create ${entityName}`;
      case "edit":
        return `Edit ${entityName}`;
      case "view":
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
      case "create":
        return `Add a new ${entityName.toLowerCase()} to the system.`;
      case "edit":
        return `Update the ${entityName.toLowerCase()} details.`;
      case "view":
        return `View ${entityName.toLowerCase()} details.`;
      default:
        return "";
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
