"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { FormField, FormMode, FormFieldOption } from './types';
import { cn } from '@/lib/utils';
import { NestedArrayField } from './NestedArrayField';

interface FormRendererProps {
  fields: FormField[];
  formData: Record<string, string | number | boolean | undefined | unknown[]>;
  formMode: FormMode | null;
  onFieldChange: (name: string, value: string | number | boolean | unknown[]) => void;
  isProcessing?: boolean; // For workflow action processing (locks form)
}

export function FormRenderer({ fields, formData, formMode, onFieldChange, isProcessing = false }: FormRendererProps) {
  const [dependentOptions, setDependentOptions] = useState<Record<string, FormFieldOption[]>>({});
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});
  const lastFetchedDependencyValues = useRef<Record<string, unknown>>({});

  // Handle dependent fields
  useEffect(() => {
    fields.forEach(field => {
      if (field.dependsOn && field.getOptions) {
        const dependencyValue = formData[field.dependsOn];
        const lastValue = lastFetchedDependencyValues.current[field.name];
        
        // Only fetch if dependency value has changed
        if (dependencyValue !== lastValue && dependencyValue !== undefined && dependencyValue !== '' && !Array.isArray(dependencyValue)) {
          const typedValue = dependencyValue as string | number | boolean;
          if (typeof typedValue === 'boolean') return;
          
          // Update last fetched value
          lastFetchedDependencyValues.current[field.name] = dependencyValue;
          
          setLoadingFields(prev => ({ ...prev, [field.name]: true }));
          
          const optionsPromise = field.getOptions(typedValue);
          if (optionsPromise instanceof Promise) {
            optionsPromise.then(options => {
              console.log(`Setting options for ${field.name}:`, options);
              setDependentOptions(prev => ({ ...prev, [field.name]: options }));
              setLoadingFields(prev => ({ ...prev, [field.name]: false }));
            }).catch(error => {
              console.error(`Error fetching options for ${field.name}:`, error);
              setLoadingFields(prev => ({ ...prev, [field.name]: false }));
            });
          } else {
            setDependentOptions(prev => ({ ...prev, [field.name]: optionsPromise }));
          }
        } else if (dependencyValue === undefined || dependencyValue === '' || Array.isArray(dependencyValue)) {
          setDependentOptions(prev => ({ ...prev, [field.name]: [] }));
        }
      }
    });
  }, [fields, formData]);
  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? (field.type === 'checkbox' ? field.defaultValue : '');
    const isDisabled = formMode === 'view' || field.disabled || isProcessing;
    // Skip array fields for non-nested-array types
    if (field.type !== 'nested-array' && Array.isArray(value)) {
      return null;
    }

    switch (field.type) {
      case 'nested-array':
        const arrayValue = Array.isArray(value) ? value : [];
        return (
          <div className="col-span-full">
            <NestedArrayField
              value={arrayValue}
              onChange={(items: unknown[]) => onFieldChange(field.name, items)}
              field={field}
              isDisabled={isDisabled || false}
              formMode={formMode}
            />
          </div>
        );
      case 'custom':
        // @ts-expect-error - Custom render function
        return field.render ? field.render({ value, onChange: (val: string | number | boolean) => onFieldChange(field.name, val), formData, field, isDisabled }) : null;
      case 'select':
        const options = field.dependsOn ? (dependentOptions[field.name] || []) : (field.options || []);
        const isLoading = loadingFields[field.name] || false;
        return (
          <SearchableSelect
            options={options}
            value={String(value || field.defaultValue || '')}
            onValueChange={(val) => onFieldChange(field.name, val)}
            disabled={isDisabled || isLoading}
            isLoading={isLoading}
            placeholder={isLoading ? "Loading..." : (field.placeholder || 'Select an option...')}
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
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id={field.name}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onFieldChange(field.name, checked)}
              disabled={isDisabled}
            />
            <label 
              htmlFor={field.name} 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.placeholder || 'Enable'}
            </label>
          </div>
        );
      default:
        // For non-checkbox fields, ensure value is string or number
        // Exclude boolean and array values as they should be handled by specific field types
        if (typeof value === 'boolean' || Array.isArray(value)) {
          return null;
        }
        const inputValue = field.type === 'number' ? (value || '') : String(value || '');
        if (field.suffix) {
          return (
            <div className="flex shadow-sm rounded-xl">
              <Input
                id={field.name}
                type={field.type}
                value={inputValue}
                onChange={(e) => {
                  const newValue = field.type === 'number' 
                    ? (e.target.value === '' ? '' : Number(e.target.value))
                    : e.target.value;
                  onFieldChange(field.name, newValue);
                }}
                placeholder={field.placeholder}
                disabled={isDisabled}
                step={field.type === 'number' ? 'any' : undefined}
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
            value={inputValue}
            onChange={(e) => {
              const newValue = field.type === 'number' 
                ? (e.target.value === '' ? '' : Number(e.target.value))
                : e.target.value;
              onFieldChange(field.name, newValue);
            }}
            placeholder={field.placeholder}
            disabled={isDisabled}
            step={field.type === 'number' ? 'any' : undefined}
            className={cn(
              'h-11 rounded-xl bg-white/50 border-input shadow-sm transition-all duration-200 hover:bg-white hover:border-gray-300 focus-visible:bg-white',
              isDisabled && 'bg-gray-50 text-gray-500'
            )}
          />
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div
          key={field.name}
          className={cn(
            'grid gap-2',
            field.type === 'nested-array' ? 'col-span-full md:col-span-2' : 
            (field.width === 'half' ? 'col-span-1' : 'col-span-full md:col-span-2')
          )}
        >
          {field.type !== 'nested-array' && (
            <label
              htmlFor={field.name}
              className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 ml-1"
            >
              {field.label}
            </label>
          )}
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
