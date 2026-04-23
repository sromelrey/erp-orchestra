'use client';

import { useSelector } from 'react-redux';
import { useState } from 'react';
import { EntityManager } from '@/components/entity-manager';
import { Column } from '@/components/ui/data-table';
import { columns } from './column';
import { getFormFields } from './form-fields';
import { useSalesOrders } from '@/hooks/operations/useSalesOrders';
import { useSalesOrderWorkflow } from '@/hooks/operations/useSalesOrderWorkflow';
import { useSalesOrderForm } from '@/hooks/operations/useSalesOrderForm';
import { useSalesOrderStats } from '@/hooks/operations/useSalesOrderStats';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { SalesOrderStatus, CreateSalesOrderRequest, UpdateSalesOrderRequest, SalesOrder } from '@/store/api/salesOrdersApi';
import { formatSalesOrderForCreate, formatSalesOrderForUpdate } from '@/utils/salesOrderHelpers';
import { SalesOrderHeader } from '@/components/sales-orders/SalesOrderHeader';
import { SalesOrderStats } from '@/components/sales-orders/SalesOrderStats';
import { DeliveryDialog } from '@/components/sales-orders/DeliveryDialog';
import { SalesOrderExpandedRow } from '@/components/sales-orders/SalesOrderExpandedRow';
import { selectCurrentUser } from '@/store/slices/authSlice';

export default function SalesOrdersPage() {
  const currentUser = useSelector(selectCurrentUser);
  const [currentEditStatus, setCurrentEditStatus] = useState<SalesOrderStatus | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    salesOrders,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleConfirm,
    handleShip,
    handleCancel,
    handleDeliver,
    itemOptions,
    warehouseOptions,
    uomOptions,
    serviceTypeOptions,
    serviceOptionOptions,
    addonOptions,
  } = useSalesOrders({ skipFormOptions: !isFormOpen });

  const { workflowActions, isProcessing, optimisticUpdates, mergeWithOptimistic, deliveryDialogOpen, handleDeliveryDialogConfirm, handleDeliveryDialogCancel, deliveryOrderId, handleFormOpen: workflowHandleFormOpen, handleCloseForm: workflowHandleCloseForm } =
    useSalesOrderWorkflow({
      handleConfirm,
      handleShip,
      handleCancel,
      handleDeliver,
      salesOrders: salesOrders as unknown as Record<string, unknown>[],
      userId: currentUser?.id,
    });

  const handleFormOpen = (item: Record<string, unknown>) => {
    const order = item as { status: SalesOrderStatus };
    setCurrentEditStatus(order.status);
    workflowHandleFormOpen(item);
  };

  const handleCloseForm = () => {
    setCurrentEditStatus(undefined);
    workflowHandleCloseForm();
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
  };

  const { getLocationsByWarehouse } = useSalesOrderForm();

  const { statsCards } = useSalesOrderStats({
    salesOrders,
  });

  const handleCreateSalesOrder = async (formData: Partial<CreateSalesOrderRequest>) => {
    const processedData = formatSalesOrderForCreate(formData);
    await handleCreate(processedData);
  };

  const handleUpdateSalesOrder = async (id: string | number, formData: Partial<UpdateSalesOrderRequest>) => {
    const processedData = formatSalesOrderForUpdate(formData);
    await handleUpdate(id, processedData);
  };

  const handleDeleteSalesOrder = async (id: string | number) => {
    await handleDelete(id);
  };

  const formFields = getFormFields(itemOptions, uomOptions, warehouseOptions, [], getLocationsByWarehouse, currentEditStatus, serviceTypeOptions, serviceOptionOptions, addonOptions);

  const salesOrdersWithOptimistic = mergeWithOptimistic(salesOrders as unknown as Record<string, unknown>[]);

  // Get order items for delivery dialog
  const deliveryOrder = deliveryOrderId ? salesOrders.find((so) => so.id === deliveryOrderId) : null;
  const deliveryOrderItems = deliveryOrder?.items || [];

  return (
    <PermissionGuard permission="operations.sales-order.view">
      <div className="p-6">
        <SalesOrderStats statsCards={statsCards} />
        <EntityManager
          entityName="Sales Order"
          entityNamePlural="Sales Orders"
          data={salesOrdersWithOptimistic}
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          formWidth="50%"
          formFields={formFields}
          keyExtractor={(item) => (item as { id: string | number }).id}
          onCreate={handleCreateSalesOrder}
          onUpdate={handleUpdateSalesOrder}
          onDelete={handleDeleteSalesOrder}
          onFormOpen={handleFormOpen}
          onFormClose={handleCloseForm}
          onFormOpenChange={handleFormOpenChange}
          searchPlaceholder="Search sales orders by order no or customer..."
          isLoading={isLoading}
          isMutating={isCreating || isUpdating || isDeleting}
          isProcessing={isProcessing}
          permissions={{
            create: 'operations.sales-order.create',
            update: 'operations.sales-order.update',
            delete: 'operations.sales-order.delete',
            view: 'operations.sales-order.view',
          }}
          workflowActions={workflowActions}
          optimisticUpdates={optimisticUpdates}
          header={SalesOrderHeader}
          expandedRow={(item) => <SalesOrderExpandedRow order={item as unknown as SalesOrder} />}
          autoSize={true}
          isRowEditable={(item: unknown) => {
            const order = item as { status: SalesOrderStatus };
            return order.status === SalesOrderStatus.DRAFT;
          }}
          isRowDeletable={(item: unknown) => {
            const order = item as { status: SalesOrderStatus };
            return order.status === SalesOrderStatus.DRAFT;
          }}
        />
        <DeliveryDialog
          open={deliveryDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleDeliveryDialogCancel();
          }}
          items={deliveryOrderItems}
          onConfirm={handleDeliveryDialogConfirm}
          onCancel={handleDeliveryDialogCancel}
        />
      </div>
    </PermissionGuard>
  );
}
