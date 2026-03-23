'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-medium',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          success:
            'group-[.toaster]:!bg-emerald-50 group-[.toaster]:!text-emerald-900 group-[.toaster]:!border-emerald-200',
          error:
            'group-[.toaster]:!bg-rose-50 group-[.toaster]:!text-rose-900 group-[.toaster]:!border-rose-200',
          warning:
            'group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-900 group-[.toaster]:!border-amber-200',
          info: 'group-[.toaster]:!bg-sky-50 group-[.toaster]:!text-sky-900 group-[.toaster]:!border-sky-200',
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600" />,
        info: <InfoIcon className="size-5 text-sky-600" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600" />,
        error: <OctagonXIcon className="size-5 text-rose-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-primary" />,
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
