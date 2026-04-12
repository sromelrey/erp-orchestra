'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { FormField, FormFieldOption, FormMode } from './types';

interface NestedArrayFieldProps {
  value: unknown[];
  onChange: (items: unknown[]) => void;
  field: FormField;
  isDisabled: boolean;
  formMode?: FormMode | null;
}

export function NestedArrayField({ value, onChange, field, isDisabled, formMode }: NestedArrayFieldProps) {
  const items = useMemo(() => (value || []) as Record<string, string | number>[], [value]);
  const config = field.nestedArrayConfig;
  const [rawInputValues, setRawInputValues] = useState<Record<string, string>>({});
  const [dependentOptions, setDependentOptions] = useState<Record<string, FormFieldOption[]>>({});
  const [loadingColumns, setLoadingColumns] = useState<Record<string, boolean>>({});
  const fetchedKeysRef = useRef<Set<string>>(new Set());

  // State for dual views
  const [viewMode, setViewMode] = useState<'form' | 'table'>('table');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Record<string, string | number> | null>(null);
  const [newItem, setNewItem] = useState<Record<string, string | number> | null>(null);

  // Handle dependent columns
  useEffect(() => {
    if (!config) return;

    // Don't fetch options in view mode
    if (formMode === 'view') {
      return;
    }

    config.columns.forEach(col => {
      if (col.dependsOn && col.getOptions) {
        // Handle existing items
        items.forEach((item, index) => {
          const dependencyValue = item[col.dependsOn!];
          const itemKey = `${index}-${col.key}`;

          // Skip if we already fetched options for this item
          if (fetchedKeysRef.current.has(itemKey)) {
            return;
          }

          if (dependencyValue !== undefined && dependencyValue !== '') {
            // Mark as fetched immediately to prevent duplicate calls
            fetchedKeysRef.current.add(itemKey);
            setLoadingColumns(prev => ({ ...prev, [itemKey]: true }));

            const optionsPromise = col.getOptions!(dependencyValue);

            if (optionsPromise instanceof Promise) {
              optionsPromise.then(options => {
                setDependentOptions(prev => ({ ...prev, [itemKey]: options }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              }).catch(error => {
                  console.error(`[NestedArrayField] Error fetching options for ${col.key} in item ${index}:`, error);
                setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              });
            } else {
              setDependentOptions(prev => ({ ...prev, [itemKey]: optionsPromise }));
            }
          } else {
            setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
          }
        });

        // Handle new item
        if (newItem) {
          const dependencyValue = newItem[col.dependsOn!];
          const itemKey = `new-${col.key}`;

          if (dependencyValue !== undefined && dependencyValue !== '') {
            setLoadingColumns(prev => ({ ...prev, [itemKey]: true }));

            const optionsPromise = col.getOptions!(dependencyValue);

            if (optionsPromise instanceof Promise) {
              optionsPromise.then(options => {
                setDependentOptions(prev => ({ ...prev, [itemKey]: options }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              }).catch(error => {
                console.error(`[NestedArrayField] Error fetching options for ${col.key} in new item:`, error);
                setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              });
            } else {
              setDependentOptions(prev => ({ ...prev, [itemKey]: optionsPromise }));
            }
          } else {
            setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
          }
        }

        // Handle editing item
        if (editingItem) {
          const dependencyValue = editingItem[col.dependsOn!];
          const itemKey = `edit-${col.key}`;

          if (dependencyValue !== undefined && dependencyValue !== '') {
            setLoadingColumns(prev => ({ ...prev, [itemKey]: true }));

            const optionsPromise = col.getOptions!(dependencyValue);

            if (optionsPromise instanceof Promise) {
              optionsPromise.then(options => {
                setDependentOptions(prev => ({ ...prev, [itemKey]: options }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              }).catch(error => {
                console.error(`[NestedArrayField] Error fetching options for ${col.key} in editing item:`, error);
                setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              });
            } else {
              setDependentOptions(prev => ({ ...prev, [itemKey]: optionsPromise }));
            }
          } else {
            setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
          }
        }
      }
    });
  }, [items, config, newItem, editingItem, formMode]);

  if (!config) return null;

  const getRawKey = (context: string, key: string) => `${context}-${key}`;

  const addItem = () => {
    const newItem: Record<string, string | number> = {};
    config.columns.forEach(col => {
      newItem[col.key] = col.type === 'number' ? 0 : '';
    });
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, key: string, fieldValue: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [key]: fieldValue };
    onChange(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  // Functions for dual view
  const startAddItem = () => {
    const newItemData: Record<string, string | number> = {};
    config.columns.forEach(col => {
      newItemData[col.key] = col.type === 'number' ? 0 : '';
    });
    setNewItem(newItemData);
    setViewMode('form');
  };

  const startEditItem = (index: number) => {
    setEditingIndex(index);
    setEditingItem({ ...items[index] });
    setViewMode('form');
  };

  const saveNewItem = () => {
    if (newItem) {
      // Validate required fields
      const requiredFields = config.columns.filter(col => col.required);
      const missingRequired = requiredFields.filter(col => {
        const value = newItem[col.key];
        return value === undefined || value === null || value === '';
      });

      if (missingRequired.length > 0) {
        // Don't add item with missing required fields
        console.warn('[NestedArrayField] Missing required fields:', missingRequired.map(f => f.key));
        return;
      }

      // Check for duplicates based on itemId (or other key fields)
      const isDuplicate = items.some((existingItem) => {
        // Check if all key fields match
        const keyFields = config.columns.filter(col => col.required).map(col => col.key);
        return keyFields.every(field => existingItem[field] === newItem[field]);
      });

      if (isDuplicate) {
        // Don't add duplicate item
        console.warn('[NestedArrayField] Skipping duplicate item:', newItem);
      } else {
        onChange([...items, newItem]);
      }
      setNewItem(null);
      setViewMode('table');
    }
  };

  const saveEditItem = () => {
    if (editingIndex !== null && editingItem) {
      // Validate required fields
      const requiredFields = config.columns.filter(col => col.required);
      const missingRequired = requiredFields.filter(col => {
        const value = editingItem[col.key];
        return value === undefined || value === null || value === '';
      });

      if (missingRequired.length > 0) {
        // Don't save item with missing required fields
        console.warn('[NestedArrayField] Missing required fields:', missingRequired.map(f => f.key));
        return;
      }

      const updatedItems = [...items];
      updatedItems[editingIndex] = editingItem;
      onChange(updatedItems);
      setEditingIndex(null);
      setEditingItem(null);
      setViewMode('table');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setNewItem(null);
    setViewMode('table');
  };

  const updateEditingItem = (key: string, value: string | number) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [key]: value });
    }
  };

  const updateNewItem = (key: string, value: string | number) => {
    if (newItem) {
      setNewItem({ ...newItem, [key]: value });
    }
  };

  const renderCell = (item: Record<string, string | number>, col: { key: string; label: string; type: string; options?: FormFieldOption[]; width?: 'full' | 'half'; dependsOn?: string; getOptions?: (value: string | number) => Promise<FormFieldOption[]> | FormFieldOption[]; allowNegative?: boolean; allowDecimal?: boolean; decimalScale?: number }, index: number) => {
    const cellValue = item[col.key] ?? '';
    const itemKey = `${index}-${col.key}`;
    const isLoading = loadingColumns[itemKey] || false;
    const options = col.dependsOn ? (dependentOptions[itemKey] || []) : (col.options || []);

    if (col.type === 'select') {
      return (
        <Select
          value={String(cellValue)}
          onValueChange={(val) => updateItem(index, col.key, val)}
          disabled={isDisabled || isLoading}
        >
          <SelectTrigger className="h-7 text-xs border-gray-200">
            <SelectValue placeholder={isLoading ? "..." : col.label} />
          </SelectTrigger>
          <SelectContent className="max-h-40">
            {Array.isArray(options) && options.map((option: FormFieldOption) => (
              <SelectItem key={option.value} value={String(option.value)} className="text-xs">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (col.type === 'number') {
      const rawKey = getRawKey(String(index), col.key);
      const displayValue = rawInputValues[rawKey] ?? String(cellValue);
      return (
        <Input
          type="text"
          inputMode={col.allowDecimal !== false ? 'decimal' : 'numeric'}
          value={displayValue}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '' || raw === '-' || (col.allowNegative && raw === '-') || /^-?\d*\.?\d*$/.test(raw)) {
              setRawInputValues(prev => ({ ...prev, [rawKey]: raw }));
              if (raw !== '' && raw !== '-' && raw !== '.') {
                const num = parseFloat(raw);
                if (!isNaN(num)) updateItem(index, col.key, num);
              }
            }
          }}
          onBlur={() => {
            const raw = rawInputValues[rawKey];
            if (raw === undefined) return;
            const num = parseFloat(raw);
            const finalNum = isNaN(num) ? 0 : (col.decimalScale !== undefined ? parseFloat(num.toFixed(col.decimalScale)) : num);
            setRawInputValues(prev => { const next = { ...prev }; delete next[rawKey]; return next; });
            updateItem(index, col.key, finalNum);
          }}
          disabled={isDisabled}
          className={`h-7 text-xs border-gray-200 ${
            col.width === 'full' ? 'w-full' :
            col.width === 'half' ? 'w-1/2 max-w-[50%]' : 'w-full'
          }`}
          placeholder={col.allowNegative ? `e.g. ${col.key === 'quantityAdjusted' ? '-5' : '0'}` : col.label}
        />
      );
    }

    return (
      <Input
        type={col.type}
        value={String(cellValue)}
        onChange={(e) => {
          updateItem(index, col.key, e.target.value);
        }}
        disabled={isDisabled}
        className={`h-7 text-xs border-gray-200 ${
          col.width === 'full' ? 'w-full' :
          col.width === 'half' ? 'w-1/2 max-w-[50%]' : 'w-full'
        }`}
        placeholder={col.label}
      />
    );
  };

  // Form view for adding/editing items
  const renderFormView = () => {
    const isEditing = editingIndex !== null;
    const currentItem = isEditing ? editingItem : newItem;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.columns.map((col) => {
            const itemKey = isEditing ? `edit-${col.key}` : `new-${col.key}`;
            const isLoading = loadingColumns[itemKey] || false;
            const options = col.dependsOn ? (dependentOptions[itemKey] || []) : (col.options || []);
            const currentValue = currentItem ? currentItem[col.key] : '';
            
            return (
              <div key={col.key} className={`space-y-1 ${
                col.width === 'full' ? 'col-span-2' : 'col-span-1'
              }`} style={col.width === 'full' ? { gridColumn: '1 / -1' } : undefined}>
                <Label className="text-xs font-medium">
                  {col.label}
                  {col.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {col.type === 'select' ? (
                  <Select
                    value={String(currentValue)}
                    onValueChange={(val) => {
                      if (isEditing) {
                        updateEditingItem(col.key, val);
                      } else {
                        updateNewItem(col.key, val);
                      }
                    }}
                    disabled={isDisabled || isLoading}
                  >
                    <SelectTrigger className={`h-8 text-xs ${
                      col.width === 'full' ? 'w-full' : 
                      col.width === 'half' ? 'w-1/2 max-w-[50%]' : 'w-full'
                    }`}>
                      <SelectValue placeholder={isLoading ? "Loading..." : `Select ${col.label}`} />
                    </SelectTrigger>
                    <SelectContent className="max-h-40">
                      {Array.isArray(options) && options.map((option: FormFieldOption) => (
                        <SelectItem key={option.value} value={String(option.value)} className="text-xs">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : col.type === 'number' ? (
                  <Input
                    type="text"
                    inputMode={col.allowDecimal !== false ? 'decimal' : 'numeric'}
                    value={(() => {
                      const rawKey = getRawKey(isEditing ? 'edit' : 'new', col.key);
                      return rawInputValues[rawKey] ?? String(currentValue ?? '');
                    })()}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const rawKey = getRawKey(isEditing ? 'edit' : 'new', col.key);
                      if (raw === '' || raw === '-' || /^-?\d*\.?\d*$/.test(raw)) {
                        setRawInputValues(prev => ({ ...prev, [rawKey]: raw }));
                        if (raw !== '' && raw !== '-' && raw !== '.') {
                          const num = parseFloat(raw);
                          if (!isNaN(num)) {
                            if (isEditing) updateEditingItem(col.key, num);
                            else updateNewItem(col.key, num);
                          }
                        }
                      }
                    }}
                    onBlur={() => {
                      const rawKey = getRawKey(isEditing ? 'edit' : 'new', col.key);
                      const raw = rawInputValues[rawKey];
                      if (raw === undefined) return;
                      const num = parseFloat(raw);
                      const finalNum = isNaN(num) ? 0 : (col.decimalScale !== undefined ? parseFloat(num.toFixed(col.decimalScale)) : num);
                      setRawInputValues(prev => { const next = { ...prev }; delete next[rawKey]; return next; });
                      if (isEditing) updateEditingItem(col.key, finalNum);
                      else updateNewItem(col.key, finalNum);
                    }}
                    disabled={isDisabled}
                    className={`h-8 text-xs ${
                      col.width === 'full' ? 'w-full' :
                      col.width === 'half' ? 'w-1/2 max-w-[50%]' : 'w-full'
                    }`}
                    placeholder={col.allowNegative ? `e.g. ${col.key === 'quantityAdjusted' ? '-5' : '0'}` : col.label}
                  />
                ) : (
                  <Input
                    type={col.type}
                    value={String(currentValue ?? '')}
                    onChange={(e) => {
                      if (isEditing) updateEditingItem(col.key, e.target.value);
                      else updateNewItem(col.key, e.target.value);
                    }}
                    disabled={isDisabled}
                    className={`h-8 text-xs ${
                      col.width === 'full' ? 'w-full' :
                      col.width === 'half' ? 'w-1/2 max-w-[50%]' : 'w-full'
                    }`}
                    placeholder={col.label}
                  />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex gap-2 pt-2">
          {isEditing ? (
            <>
              <Button
                onClick={saveEditItem}
                disabled={isDisabled}
                className="h-8 px-3 text-xs"
                size="sm"
              >
                Save
              </Button>
              <Button
                onClick={cancelEdit}
                disabled={isDisabled}
                variant="outline"
                className="h-8 px-3 text-xs"
                size="sm"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={saveNewItem}
                disabled={isDisabled}
                className="h-8 px-3 text-xs"
                size="sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add {config.itemLabel || 'Item'}
              </Button>
              <Button
                onClick={cancelEdit}
                disabled={isDisabled}
                variant="outline"
                className="h-8 px-3 text-xs"
                size="sm"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Table view for displaying items
  const renderTableView = () => {
    return (
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-gray-300 rounded-md bg-gray-50/50">
            <p className="text-gray-500 text-sm">
              {config.emptyMessage || `No ${config.itemsLabel || 'items'} added yet.`}
            </p>
            <Button
              onClick={startAddItem}
              disabled={isDisabled}
              className="mt-3 h-8 px-3 text-xs"
              variant="outline"
              size="sm"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add {config.itemLabel || 'Item'}
            </Button>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden bg-white">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    {config.columns.map((col) => (
                      <th key={col.key} className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left font-medium text-gray-700 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50/50">
                      {config.columns.map((col) => (
                        <td key={col.key} className="px-3 py-2">
                          {col.type === 'select' ? 
                            (col.options?.find(opt => opt.value === item[col.key])?.label || item[col.key]) :
                            String(item[col.key] || '')
                          }
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <Button
                            onClick={() => startEditItem(index)}
                            disabled={isDisabled}
                            className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50"
                            variant="ghost"
                            size="sm"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => removeItem(index)}
                            disabled={isDisabled}
                            className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                            variant="ghost"
                            size="sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-xs text-gray-500">
                {items.length} {config.itemsLabel || 'items'}
              </span>
              <Button
                onClick={startAddItem}
                disabled={isDisabled}
                className="h-7 px-2 text-xs"
                variant="outline"
                size="sm"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex gap-1">
          <Button
            onClick={() => setViewMode(viewMode === 'form' ? 'table' : 'form')}
            disabled={isDisabled}
            className="h-7 px-2 text-xs"
            variant="ghost"
            size="sm"
          >
            {viewMode === 'form' ? <Eye className="w-3 h-3" /> : <Edit className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {viewMode === 'form' ? renderFormView() : renderTableView()}
    </div>
  );
}
