/**
 * Standard error response structure from the API
 */
export interface ApiError {
  data?: {
    message?: string;
    error?: string;
    details?: unknown;
  };
  status?: number;
  message?: string;
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('data' in error || 'message' in error || 'status' in error)
  );
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.data?.message || error.data?.error || error.message || 'An error occurred';
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
}
