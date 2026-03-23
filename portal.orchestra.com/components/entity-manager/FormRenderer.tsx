import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { FormField, FormMode } from './types';
import { cn } from '@/lib/utils';

interface FormRendererProps {
  fields: FormField[];
  formData: Record<string, string | number | boolean | undefined>;
  formMode: FormMode | null;
  onFieldChange: (name: string, value: string | number | boolean) => void;
}

export function FormRenderer({ fields, formData, formMode, onFieldChange }: FormRendererProps) {
  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';
    const isDisabled = formMode === 'view' || field.disabled;

    switch (field.type) {
      case 'select':
        return (
          <SearchableSelect
            options={(field.options as any) || []}
            value={String(value || field.defaultValue || '')}
            onValueChange={(val) => onFieldChange(field.name, val)}
            disabled={isDisabled}
            placeholder={field.placeholder || 'Select an option...'}
          />
        );
      case 'textarea':
        return (
          <textarea
            id={field.name}
            value={String(value)}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={cn(
              'flex min-h-[120px] w-full rounded-xl border border-input bg-white/50 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-white hover:border-gray-300 resize-none',
              isDisabled && 'bg-gray-50 text-gray-500'
            )}
          />
        );
      default:
        if (field.suffix) {
          return (
            <div className="flex shadow-sm rounded-xl">
              <Input
                id={field.name}
                type={field.type}
                value={String(value)}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                disabled={isDisabled}
                className={cn(
                  'rounded-r-none h-11 bg-white/50 border-input transition-all duration-200 hover:bg-white hover:border-gray-300 focus-visible:bg-white',
                  isDisabled && 'bg-gray-50 text-gray-500'
                )}
              />
              <div className="flex items-center rounded-r-xl border border-l-0 border-input bg-muted/50 px-4 text-sm text-gray-500 font-medium">
                {field.suffix}
              </div>
            </div>
          );
        }
        return (
          <Input
            id={field.name}
            type={field.type}
            value={String(value)}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            disabled={isDisabled}
            className={cn(
              'h-11 rounded-xl bg-white/50 border-input shadow-sm transition-all duration-200 hover:bg-white hover:border-gray-300 focus-visible:bg-white',
              isDisabled && 'bg-gray-50 text-gray-500'
            )}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((field) => (
        <div
          key={field.name}
          className={cn('grid gap-2', field.width === 'half' ? 'col-span-1' : 'col-span-2')}
        >
          <label
            htmlFor={field.name}
            className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 ml-1"
          >
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
