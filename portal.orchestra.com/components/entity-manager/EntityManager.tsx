'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Search, Loader2, Eye, Edit, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable, Column } from '@/components/ui/data-table';
import { SliderForm } from '@/components/ui/slider-form';
import { FormRenderer } from './FormRenderer';
import { EntityManagerProps } from './types';
import { useEntityManager } from './useEntityManager';
import { HasPermission } from '@/components/auth/HasPermission';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Badge } from '@/components/ui/badge';

function EntityManager<T extends object>(props: EntityManagerProps<T>) {
  const {
    columns,
    entityName,
    formFields,
    searchPlaceholder,
    emptyMessage,
    isLoading = false,
    isMutating = false,
    isProcessing = false,
    error,
    stats,
    onCreate,
    onDelete,
    onFormClose,
    onFormChange,
    keyExtractor,
    showViewButton = true,
    showEditButton = true,
    showDeleteButton = true,
    isRowEditable,
    isRowDeletable,
    expandedRow,
    formWidth = 'lg',
    permissions,
    workflowActions,
    optimisticUpdates,
    header,
  } = props;

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: 'default' | 'destructive';
    confirmLabel: string;
    onConfirm: () => void | Promise<void>;
  } | null>(null);

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
  } = useEntityManager({
    ...props,
    optimisticUpdates,
    onFormChange,
  });

  // Build columns with action buttons
  const columnsWithActions: Column<T>[] = useMemo(() => {
    const hasActions = showViewButton || showEditButton || showDeleteButton;
    if (!hasActions) return columns;

    return [
      ...columns,
      {
        header: 'Actions',
        className: 'text-right',
        cell: (item: T) => {
          const canEdit = isRowEditable ? isRowEditable(item) : true;
          const canDelete = isRowDeletable ? isRowDeletable(item) : true;

          return (
            <div className="flex items-center justify-end gap-2">
              {showViewButton && (
                <HasPermission permission={permissions?.view}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleView(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </HasPermission>
              )}
              {showEditButton && canEdit && (
                <HasPermission permission={permissions?.update}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </HasPermission>
              )}
              {showDeleteButton && onDelete && canDelete && (
                <HasPermission permission={permissions?.delete}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </HasPermission>
              )}
            </div>
          );
        },
      },
    ];
  }, [
    columns,
    showViewButton,
    showEditButton,
    showDeleteButton,
    onDelete,
    handleView,
    handleEdit,
    handleDelete,
    permissions?.delete,
    permissions?.update,
    permissions?.view,
    isRowEditable,
    isRowDeletable,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{plural} Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all {plural.toLowerCase()} and their configurations
          </p>
        </div>
        {onCreate && (
          <HasPermission permission={permissions?.create}>
            <Button className="gap-2" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Add {entityName}
            </Button>
          </HasPermission>
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
        onOpenChange={(open) => {
          if (!open) {
            setFormMode(null);
            onFormClose?.();
          }
        }}
        title={formTitle}
        description={formDescription}
        onSubmit={formMode !== 'view' ? handleFormSubmit : undefined}
        isLoading={isSubmitting}
        isProcessing={isProcessing}
        isReadOnly={formMode === 'view' || (formMode === 'edit' && isRowEditable && !isRowEditable(formData as T))}
        submitLabel={formMode === 'create' ? `Create ${entityName}` : `Save Changes`}
        width={formWidth}
        header={
          (formMode === 'view' || formMode === 'edit') ? (
            <div className="space-y-3 pt-3">
              {/* Read-only badge */}
              {formMode === 'view' && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Read-only mode
                  </Badge>
                </div>
              )}
              {/* Custom Header */}
              {header && header(formData)}

              {/* Workflow Actions */}
              {workflowActions && workflowActions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {workflowActions.map((action, index) => {
                    const isVisible = action.isVisible ? action.isVisible(formData as T) : true;
                    if (!isVisible) return null;
                    return (
                      <HasPermission key={index} permission={action.permission}>
                        <Button
                          variant={action.variant || 'default'}
                          size="sm"
                          onClick={() => {
                            // 🔹 Enhancement: Handle confirmation with custom dialog
                            if (action.confirm) {
                              const title = typeof action.confirm.title === 'function'
                                ? action.confirm.title(formData as T)
                                : action.confirm.title;
                              const description = typeof action.confirm.description === 'function'
                                ? action.confirm.description(formData as T)
                                : action.confirm.description;
                              const variant: 'default' | 'destructive' = action.confirm.variant || (action.variant === 'destructive' ? 'destructive' : 'default');
                              const confirmLabel = action.confirm.confirmLabel || action.label;

                              setConfirmDialog({
                                open: true,
                                title,
                                description,
                                variant,
                                confirmLabel,
                                onConfirm: async () => {
                                  setConfirmDialog(null);
                                  await action.onClick(formData as T);
                                },
                              });
                            } else if (action.requiresConfirmation) {
                              const message = typeof action.confirmationMessage === 'function'
                                ? action.confirmationMessage(formData as T)
                                : action.confirmationMessage || `Are you sure you want to ${action.label.toLowerCase()}?`;
                              if (window.confirm(message)) {
                                action.onClick(formData as T);
                              }
                            } else {
                              action.onClick(formData as T);
                            }
                          }}
                          className="gap-2"
                          disabled={action.isLoading || action.isDisabled || isProcessing}
                          title={action.disabledReason || (isProcessing ? 'Processing...' : undefined)}
                        >
                          {action.isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <action.icon className="h-4 w-4" />
                          )}
                          {action.label}
                        </Button>
                      </HasPermission>
                    );
                  })}
                </div>
              )}
            </div>
          ) : undefined
        }
      >
        <div className="relative">
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">
                Processing...
              </p>
            </div>
          )}
          <div className="grid gap-4 py-4 px-6">
            <FormRenderer
              fields={formMode === 'view' || formMode === 'edit' 
                ? formFields.filter(field => field.name !== 'status') 
                : formFields}
              formData={formData as Record<string, string | number | boolean | undefined>}
              formMode={formMode}
              onFieldChange={handleFieldChange}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </SliderForm>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmationDialog
          open={confirmDialog.open}
          onOpenChange={(open) => {
            if (!open) setConfirmDialog(null);
          }}
          title={confirmDialog.title}
          description={confirmDialog.description}
          variant={confirmDialog.variant}
          confirmLabel={confirmDialog.confirmLabel}
          onConfirm={confirmDialog.onConfirm}
        />
      )}

      {/* Loading State - only show full loader when initial loading with no data */}
      {isLoading && filteredData.length === 0 && (
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
      {!error && stats && stats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
                >
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

      {/* Data Table with overlay loader for mutations */}
      <div className="relative">
        {isMutating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {!error && (
          <DataTable
            columns={columnsWithActions}
            data={filteredData}
            keyExtractor={keyExtractor}
            emptyMessage={emptyMessage || `No ${plural.toLowerCase()} found`}
            expandedRow={expandedRow}
          />
        )}
      </div>
    </div>
  );
}

export default EntityManager;
