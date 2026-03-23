import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string | any) => {
    let errorMessage = 'An unexpected error occurred.';

    if (typeof message === 'string') {
      errorMessage = message;
    } else if (message?.data?.message) {
      // API error response structure: { data: { message: "..." } }
      errorMessage = message.data.message;
    } else if (message?.message) {
      // Generic Error object
      errorMessage = message.message;
    }

    sonnerToast.error(errorMessage);
  },
  info: (message: string) => {
    sonnerToast.info(message);
  },
  warning: (message: string) => {
    sonnerToast.warning(message);
  },
};
