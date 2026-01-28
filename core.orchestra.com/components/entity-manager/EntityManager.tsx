"use client";

import React, { useMemo } from "react";
import { Plus, Search, Loader2, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, Column } from "@/components/ui/data-table";
import { SliderForm } from "@/components/ui/slider-form";
import { FormRenderer } from "./FormRenderer";
import { EntityManagerProps } from "./types";
import { useEntityManager } from "./useEntityManager";

function EntityManager<T extends Record<string, any>>(props: EntityManagerProps<T>) {
  const {
    data,
    columns,
    entityName,
    formFields,
    searchPlaceholder,
    emptyMessage,
    isLoading = false,
    error,
    stats,
    onCreate,
    onDelete,
    keyExtractor,
    showViewButton = true,
    showEditButton = true,
    showDeleteButton = true,
  } = props;

  const {
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
  } = useEntityManager(props);

  // Build columns with action buttons
  const columnsWithActions: Column<T>[] = useMemo(() => {
    const hasActions = showViewButton || showEditButton || showDeleteButton;
    if (!hasActions) return columns;

    return [
      ...columns,
      {
        header: "Actions",
        className: "text-right",
        cell: (item: T) => (
          <div className="flex items-center justify-end gap-2">
            {showViewButton && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleView(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {showEditButton && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {showDeleteButton && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(item)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ];
  }, [columns, showViewButton, showEditButton, showDeleteButton, onDelete, handleView, handleEdit, handleDelete]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {plural} Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all {plural.toLowerCase()} and their configurations
          </p>
        </div>
        {onCreate && (
          <Button className="gap-2" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            Add {entityName}
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder || `Search ${plural.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Slider Form */}
      <SliderForm
        open={formMode !== null}
        onOpenChange={(open) => !open && setFormMode(null)}
        title={formTitle}
        description={formDescription}
        onSubmit={formMode !== "view" ? handleFormSubmit : undefined}
        isLoading={isSubmitting}
        submitLabel={formMode === "create" ? `Create ${entityName}` : `Save Changes`}
        // Only show footer buttons if not in view mode
        footer={formMode === "view" ? <div /> : undefined}
      >
        <div className="grid gap-4 py-4 px-6">
          <FormRenderer
            fields={formFields}
            formData={formData}
            formMode={formMode}
            onFieldChange={handleFieldChange}
          />
        </div>
      </SliderForm>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p>Failed to load {plural.toLowerCase()}. Please try again later.</p>
          <p className="text-sm mt-1 opacity-80">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && !error && stats && stats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Table */}
      {!isLoading && !error && (
        <DataTable
          columns={columnsWithActions}
          data={filteredData}
          keyExtractor={keyExtractor}
          emptyMessage={emptyMessage || `No ${plural.toLowerCase()} found`}
        />
      )}
    </div>
  );
}

export default EntityManager;
