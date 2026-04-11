'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SliderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  isProcessing?: boolean; // For workflow action processing (locks form)
  isReadOnly?: boolean; // Disable submit button when form is read-only
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  width?: string; // Can be percentage like "60%" or fixed like "xl"
}

export function SliderForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  onSubmit,
  onCancel,
  isLoading = false,
  isProcessing = false,
  isReadOnly = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  className,
  header,
  footer,
  side = 'right',
  width,
}: SliderFormProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (isProcessing) return;
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          'w-full flex flex-col h-full',
          // Handle percentage-based widths
          width && !width.includes('%') ? `sm:max-w-[${width}]` : 'sm:max-w-md',
          width && width.includes('%') ? 'max-w-none!' : '',
          className
        )}
        style={width && width.includes('%') ? { width: width } : undefined}
      >
        <SheetHeader className="pb-4">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        {header && (
          <div className="px-6 pb-4">
            {header}
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4">{children}</div>

        {(footer !== undefined || onSubmit || onCancel) && (
          <SheetFooter className="pt-4 border-t mt-auto">
            {footer ? (
              footer
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  {cancelLabel}
                </Button>
                {onSubmit && (
                  <Button onClick={onSubmit} disabled={isLoading || isReadOnly}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {submitLabel}
                  </Button>
                )}
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
