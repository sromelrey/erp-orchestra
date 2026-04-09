/**
 * Workflow System Types
 * 
 * Provides type definitions for a reusable, state machine-like workflow system
 * with support for optimistic updates, concurrency safety, and transition validation.
 */

import { ComponentType } from 'react';

/**
 * Loading state for workflow actions
 * Tracks which action is currently executing for a given item
 */
export type LoadingState = {
  action: string;
  isLoading: boolean;
};

/**
 * Workflow configuration defining state transitions and actions
 * @template TStatus - The status enum or type (must be a valid object key)
 * @template TItem - The entity item type
 */
export type WorkflowConfig<TStatus extends string | number | symbol, TItem extends Record<string, unknown>> = {
  initial: TStatus;
  transitions: Record<TStatus, WorkflowTransition<TStatus, TItem>[]>;
  getStatus: (item: TItem) => TStatus;
  statusField?: keyof TItem; // Default: 'status'
};

/**
 * Definition of a single state transition
 * @template TStatus - The status enum or type (must be a valid object key)
 * @template TItem - The entity item type
 */
export type WorkflowTransition<TStatus extends string | number | symbol, TItem> = {
  to: TStatus;
  label: string;
  icon: ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  permission?: string;
  handlerKey: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: (item: TItem) => string;
  isDisabled?: (item: TItem) => boolean;
  disabledReason?: string;
  isVisible?: (item: TItem) => boolean;
  // 🔹 Enhancement: Structured confirmation config for custom dialog
  confirm?: {
    title: string | ((item: TItem) => string);
    description: string | ((item: TItem) => string);
    variant?: 'default' | 'destructive';
    confirmLabel?: string;
  };
  // 🔹 Enhancement: Extensibility hook for complex actions (e.g., modal before execute)
  beforeExecute?: (item: TItem) => Promise<boolean>;
};

/**
 * Handler function type for workflow actions
 * @template TItem - The entity item type
 */
export type WorkflowActionHandler<TItem> = (
  id: string | number,
  item: TItem,
  notes?: string
) => Promise<boolean>;

/**
 * Map of handler keys to handler functions
 * @template TItem - The entity item type
 */
export type WorkflowHandlers<TItem> = Record<string, WorkflowActionHandler<TItem>>;

/**
 * Workflow action definition for use in EntityManager
 * @template TItem - The entity item type
 */
export type WorkflowAction<TItem> = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick: (item: TItem) => void | Promise<void>;
  permission?: string;
  isVisible?: (item: TItem) => boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  isLoading?: boolean;
  isDisabled?: boolean;
  disabledReason?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  // 🔹 Enhancement: Structured confirmation config for future UI upgrades
  confirm?: {
    title: string;
    description: string;
  };
};

/**
 * Options for building workflow actions
 * @template TStatus - The status enum or type (must be a valid object key)
 * @template TItem - The entity item type
 */
export type BuildWorkflowActionsOptions<TStatus extends string | number | symbol, TItem extends Record<string, unknown>> = {
  workflow: WorkflowConfig<TStatus, TItem>;
  handlers: WorkflowHandlers<TItem>;
  loadingActions: Map<string | number, LoadingState>;
  currentStatus?: TStatus;
  itemId?: string | number;
};
