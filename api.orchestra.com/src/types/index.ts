import { User } from '@/entities/system/user.entity';

export * from './email.type';

/**
 * Environment enumeration for application configuration.
 * Defines the supported runtime environments for the application.
 */
export enum Env {
  /** Production environment with optimized settings */
  Prod = 'production',
  /** Development environment with debugging features enabled */
  Dev = 'development',
}

/**
 * Extended Express Request interface that includes authenticated principal data.
 *
 * This interface extends the standard Express Request to include the authenticated
 * user principal, making it available throughout request handling.
 *
 * @template Data - The type of principal data (defaults to User entity)
 */
export interface UpdatedRequest<Data extends User = User> extends Request {
  /** The authenticated user principal associated with this request */
  principal: Data;
}

/**
 * Response type for single delete operations.
 * Indicates whether the deletion was successful.
 */
export type DeleteResponse = { deleted: boolean };

/**
 * Response type for bulk delete operations.
 * Indicates the number of items that were successfully deleted.
 */
export type BulkDeleteResponse = { deletions: number };
