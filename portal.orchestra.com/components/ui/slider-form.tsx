"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SliderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  footer?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  width?: string;
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
  submitLabel = "Save",
  cancelLabel = "Cancel",
  className,
  footer,
  side = "right",
  width,
}: SliderFormProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "w-full sm:max-w-md flex flex-col h-full", 
          width && `sm:max-w-[${width}]`,
          className
        )}
      >
        <SheetHeader className="pb-4">
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {children}
        </div>

        {(footer !== undefined || onSubmit || onCancel) && (
          <SheetFooter className="pt-4 border-t mt-auto">
            {footer ? (
              footer
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                {onSubmit && (
                  <Button onClick={onSubmit} disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
