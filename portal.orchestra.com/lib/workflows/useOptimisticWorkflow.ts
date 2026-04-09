/**
 * Optimistic Workflow Hook
 * 
 * Manages optimistic updates and loading states for workflow actions
 * with concurrency safety, transition validation, and robust error handling.
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { LoadingState, WorkflowConfig } from './types';
import { validateTransition } from './builders';

/**
 * Hook for managing optimistic workflow updates
 * @template TStatus - The status enum or type
 * @template TItem - The entity item type
 */
export function useOptimisticWorkflow<TStatus extends string | number | symbol, TItem extends Record<string, unknown>>() {
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string | number, Partial<TItem>>>(new Map());
  const [loadingActions, setLoadingActions] = useState<Map<string | number, LoadingState>>(new Map());
  const [previousState, setPreviousState] = useState<Map<string | number, Partial<TItem>>>(new Map());

  /**
   * Gets additional optimistic fields based on target status
   */
  const getOptimisticFields = useCallback((targetStatus: TStatus, userId?: number): Partial<TItem> => {
    const fields: Partial<TItem> = {};
    const statusStr = String(targetStatus);

    if (statusStr === 'SHIPPED') {
      (fields as Record<string, unknown>).shippedAt = new Date().toISOString();
      if (userId) {
        (fields as Record<string, unknown>).shippedBy = userId;
      }
    }

    if (statusStr === 'DELIVERED') {
      (fields as Record<string, unknown>).deliveredAt = new Date().toISOString();
      if (userId) {
        (fields as Record<string, unknown>).deliveredBy = userId;
      }
    }

    if (statusStr === 'CONFIRMED') {
      (fields as Record<string, unknown>).approvedAt = new Date().toISOString();
      if (userId) {
        (fields as Record<string, unknown>).approvedBy = userId;
      }
    }

    return fields;
  }, []);

  /**
   * Executes a workflow action with optimistic updates and error handling
   *
   * @param itemId - The ID of the item
   * @param item - The item data
   * @param targetStatus - The target status after the action
   * @param handler - The handler function to execute
   * @param workflow - The workflow configuration
   * @param statusField - The field name for status (default: 'status')
   * @param userId - Optional user ID for timestamp fields
   */
  const executeAction = useCallback(
    async (
      itemId: string | number,
      item: TItem,
      targetStatus: TStatus,
      handler: (id: string | number, item: TItem) => Promise<boolean>,
      workflow: WorkflowConfig<TStatus, TItem>,
      statusField: keyof TItem = 'status' as keyof TItem,
      userId?: number
    ) => {
      // 🔹 Enhancement: Concurrency guard - prevent duplicate clicks
      if (loadingActions.has(itemId)) {
        console.log(`[Workflow] Action already in progress for item ${itemId}`);
        return;
      }

      const currentStatus = workflow.getStatus(item);

      // 🔹 Enhancement: Validate transition before executing
      if (!validateTransition(workflow, currentStatus, targetStatus)) {
        toast.error('Invalid transition');
        return;
      }

      // 🔹 Enhancement: Save previous state before applying optimistic update
      setPreviousState((prev) => new Map(prev).set(itemId, { [statusField]: currentStatus } as Partial<TItem>));

      // Set loading state
      setLoadingActions((prev) => new Map(prev).set(itemId, { action: String(targetStatus), isLoading: true }));

      // Apply optimistic update with additional fields
      const optimisticFields = getOptimisticFields(targetStatus, userId);
      setOptimisticUpdates((prev) =>
        new Map(prev).set(itemId, { [statusField]: targetStatus, ...optimisticFields } as Partial<TItem>)
      );

      try {
        // Execute the handler
        const success = await handler(itemId, item);

        if (success) {
          // Clear optimistic update on success (server data will be refreshed)
          setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
          });

          // Clear previous state
          setPreviousState((prev) => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
          });
        } else {
          // Rollback on failure
          setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
          });

          setPreviousState((prev) => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
          });
        }
      } catch (error) {
        // 🔹 Enhancement: Rollback using previousState on error
        const prev = previousState.get(itemId);
        if (prev) {
          setOptimisticUpdates((prevMap) =>
            new Map(prevMap).set(itemId, prev)
          );
        } else {
          // If no previous state, just delete optimistic update
          setOptimisticUpdates((prevMap) => {
            const newMap = new Map(prevMap);
            newMap.delete(itemId);
            return newMap;
          });
        }

        // Clear previous state after rollback
        setPreviousState((prev) => {
          const newMap = new Map(prev);
          newMap.delete(itemId);
          return newMap;
        });

        console.error('[Workflow] Action execution failed:', error);
      } finally {
        // 🔹 Enhancement: Always clear loading state in finally block
        setLoadingActions((prev) => {
          const newMap = new Map(prev);
          newMap.delete(itemId);
          return newMap;
        });
      }
    },
    [loadingActions, previousState, getOptimisticFields]
  );

  /**
   * Merges server data with optimistic updates
   * UI must always use this merged data, not server data alone
   * 
   * @param data - The server data
   * @returns Merged data with optimistic updates applied
   */
  const mergeWithOptimistic = useCallback(
    (data: TItem[]): TItem[] => {
      return data.map((item) => {
        const itemId = (item as TItem & { id: string | number }).id;
        const optimistic = optimisticUpdates.get(itemId);
        return optimistic ? { ...item, ...optimistic } : item;
      });
    },
    [optimisticUpdates]
  );

  return {
    optimisticUpdates,
    loadingActions,
    previousState,
    executeAction,
    mergeWithOptimistic,
  };
}
