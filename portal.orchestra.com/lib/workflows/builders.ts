/**
 * Workflow Action Builder
 *
 * Converts workflow configuration into EntityManager-compatible workflow actions
 * with support for validation, global disable logic, and loading states.
 */

import {
  WorkflowConfig,
  WorkflowAction,
  BuildWorkflowActionsOptions,
  LoadingState,
} from './types';

/**
 * Validates if a transition is allowed based on the workflow configuration
 * @template TStatus - The status enum or type
 * @template TItem - The entity item type
 * @param workflow - The workflow configuration
 * @param currentStatus - The current status
 * @param targetStatus - The target status
 * @returns true if the transition is allowed, false otherwise
 */
export function validateTransition<TStatus extends string | number | symbol, TItem extends Record<string, unknown>>(
  workflow: WorkflowConfig<TStatus, TItem>,
  currentStatus: TStatus,
  targetStatus: TStatus
): boolean {
  const allowedTransitions = workflow.transitions[currentStatus] || [];
  const isValid = allowedTransitions.some((t) => t.to === targetStatus);

  if (!isValid) {
    console.warn(
      `[Workflow] Invalid transition attempted: ${String(currentStatus)} → ${String(targetStatus)}`
    );
  }

  return isValid;
}

/**
 * Builds workflow actions from workflow configuration
 * Handles visibility, disabled state, loading state, and confirmation
 *
 * @template TStatus - The status enum or type
 * @template TItem - The entity item type
 * @param options - The build options
 * @returns Array of workflow actions compatible with EntityManager
 */
export function buildWorkflowActions<TStatus extends string | number | symbol, TItem extends Record<string, unknown>>(
  options: BuildWorkflowActionsOptions<TStatus, TItem>
): WorkflowAction<TItem>[] {
  const { workflow, handlers, loadingActions, currentStatus, itemId } = options;

  // Get allowed transitions for current status
  const transitions = workflow.transitions[currentStatus || workflow.initial] || [];

  // 🔹 Enhancement: Global disable logic - if any action loading for item, disable ALL buttons
  const isAnyActionLoading = itemId ? loadingActions.has(itemId) : false;

  return transitions
    .filter((transition) => {
      // Check visibility
      if (transition.isVisible) {
        // We can't check isVisible without the item, so assume visible for now
        // The actual visibility check will happen in the page component
        return true;
      }
      return true;
    })
    .map((transition) => {
      const loadingState = itemId ? loadingActions.get(itemId) : null;
      const isThisActionLoading = loadingState?.action === transition.handlerKey && loadingState?.isLoading;

      // 🔹 Enhancement: Apply global disable - disabled if any action loading OR transition-specific disable
      const isDisabled =
        isAnyActionLoading ||
        (transition.isDisabled ? transition.isDisabled({} as TItem) : false);

      const action: WorkflowAction<TItem> = {
        label: transition.label,
        icon: transition.icon,
        variant: transition.variant || 'default',
        permission: transition.permission,
        isVisible: transition.isVisible,
        isLoading: isThisActionLoading,
        isDisabled,
        disabledReason: isAnyActionLoading
          ? 'Another action is in progress'
          : transition.disabledReason,
        requiresConfirmation: transition.requiresConfirmation,
        confirmationMessage: transition.confirmationMessage?.({} as TItem),
        // 🔹 Enhancement: Structured confirmation config
        confirm: transition.confirm,
        onClick: async (item: TItem) => {
          const handler = handlers[transition.handlerKey];
          if (!handler) {
            console.error(`[Workflow] Handler not found: ${transition.handlerKey}`);
            return;
          }

          // 🔹 Enhancement: Run beforeExecute hook if present
          if (transition.beforeExecute) {
            const shouldContinue = await transition.beforeExecute(item);
            if (!shouldContinue) {
              console.log(`[Workflow] beforeExecute cancelled action: ${transition.handlerKey}`);
              return;
            }
          }

          const itemStatus = workflow.getStatus(item);
          const itemIdValue = (item as TItem & { id: string | number }).id;

          // 🔹 Enhancement: Validate transition before executing
          if (!validateTransition(workflow, itemStatus, transition.to)) {
            console.error(
              `[Workflow] Invalid transition: ${String(itemStatus)} → ${String(transition.to)}`
            );
            return;
          }

          console.log(
            `[Workflow] Executing action: ${transition.handlerKey} for item ${itemIdValue}`
          );

          await handler(itemIdValue, item);
        },
      };

      return action;
    });
}

/**
 * Helper to get the current status from an item using the workflow config
 * @template TStatus - The status enum or type
 * @template TItem - The entity item type
 * @param workflow - The workflow configuration
 * @param item - The item
 * @returns The current status
 */
export function getItemStatus<TStatus extends string | number | symbol, TItem extends Record<string, unknown>>(
  workflow: WorkflowConfig<TStatus, TItem>,
  item: TItem
): TStatus {
  return workflow.getStatus(item);
}
