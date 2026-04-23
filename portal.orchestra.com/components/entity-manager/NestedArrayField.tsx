'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Combobox, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxContent, ComboboxValue } from '@/components/ui/combobox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Trash2, Plus, Edit, Eye, Check, AlertCircle } from 'lucide-react';
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
  // State for tabs (default to 'pricing' tab)
  const [activeTab, setActiveTab] = useState('pricing');

  const getRawKey = (context: string, key: string) => `${context}-${key}`;

  const updateItem = useCallback((index: number, key: string, fieldValue: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [key]: fieldValue };
    onChange(updatedItems);
  }, [items, onChange]);

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  // Functions for dual view
  const startAddItem = () => {
    if (!config) return;
    const newItemData: Record<string, string | number> = {};
    // Handle both sections and columns
    const allColumns = config.sections 
      ? config.sections.flatMap(section => section.columns)
      : (config.columns || []);
    allColumns.forEach(col => {
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
    if (!config) return;
    if (newItem) {
      // Handle both sections and columns
      const allColumns = config.sections 
        ? config.sections.flatMap(section => section.columns)
        : (config.columns || []);
      
      // Validate required fields
      const requiredFields = allColumns.filter(col => col.required);
      const missingRequired = requiredFields.filter(col => {
        const value = newItem[col.key];
        return value === undefined || value === null || value === '';
      });

      if (missingRequired.length > 0) {
        // Don't add item with missing required fields
        console.warn('[NestedArrayField] Missing required fields:', missingRequired.map(f => f.key));
        return;
      }

      onChange([...items, newItem]);
      setNewItem(null);
      setViewMode('table');
    }
  };

  const saveEditItem = () => {
    if (!config) return;
    if (editingIndex !== null && editingItem) {
      // Handle both sections and columns
      const allColumns = config.sections 
        ? config.sections.flatMap(section => section.columns)
        : (config.columns || []);
      
      // Validate required fields
      const requiredFields = allColumns.filter(col => col.required);
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
    setActiveTab('pricing');
    setViewMode('table');
  };

  const updateEditingItem = useCallback((key: string, value: string | number) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [key]: value });
    }
  }, [editingItem]);

  const updateNewItem = useCallback((key: string, value: string | number) => {
    if (newItem) {
      setNewItem({ ...newItem, [key]: value });
    }
  }, [newItem]);

  // Handle smart defaults (auto-fill UOM when item is selected)
  useEffect(() => {
    if (!config) return;

    // Handle both sections and columns
    const allColumns = config.sections 
      ? config.sections.flatMap(section => section.columns)
      : (config.columns || []);

    // Find itemId and unitOfMeasureId columns
    const itemIdColumn = allColumns.find(col => col.key === 'itemId');
    const uomColumn = allColumns.find(col => col.key === 'unitOfMeasureId');

    if (!itemIdColumn || !uomColumn) return;

    const handleItemChange = (item: Record<string, string | number> | null) => {
      if (!item) return;

      const itemId = item[itemIdColumn.key];
      const currentUom = item[uomColumn.key];

      // Only auto-fill if UOM is empty and item is selected
      if (itemId && !currentUom && itemIdColumn.options) {
        // Try to find default UOM from item data
        // This is a placeholder - actual implementation would need item data with default UOM
        console.log('[NestedArrayField] Item selected, would auto-fill UOM:', itemId);
      }
    };

    // Handle new item
    if (newItem) {
      handleItemChange(newItem);
    }

    // Handle editing item
    if (editingItem) {
      handleItemChange(editingItem);
    }
  }, [newItem, editingItem, config]);

  // Handle dependent columns
  useEffect(() => {
    if (!config) return;

    // Don't fetch options in view mode
    if (formMode === 'view') {
      return;
    }

    // Handle both sections, columns, and tabs
    const allColumns = config.sections
      ? config.sections.flatMap(section => section.columns)
      : config.columns
        ? config.columns
        : (config.tabs?.flatMap(tab => tab.columns) || []);

    allColumns.forEach(col => {
      if (col.dependsOn && col.getOptions) {
        // Handle existing items
        items.forEach((item, index) => {
          const dependencyValue = item[col.dependsOn!];
          const itemKey = `${index}-${col.key}-${dependencyValue}`;

          // Skip if we already fetched options for this item with this dependency value
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
                // Auto-set the value if there's only one option and the field is currently empty
                if (options.length === 1 && !item[col.key]) {
                  updateItem(index, col.key, options[0].value);
                }
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              }).catch(error => {
                  console.error(`[NestedArrayField] Error fetching options for ${col.key} in item ${index}:`, error);
                setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              });
            } else {
              setDependentOptions(prev => ({ ...prev, [itemKey]: optionsPromise }));
              // Auto-set the value if there's only one option and the field is currently empty
              if (optionsPromise.length === 1 && !item[col.key]) {
                updateItem(index, col.key, optionsPromise[0].value);
              }
            }
          } else {
            setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
          }
        });

        // Handle new item
        if (newItem) {
          const dependencyValue = newItem[col.dependsOn!];
          const itemKey = `new-${col.key}-${dependencyValue}`;

          if (dependencyValue !== undefined && dependencyValue !== '') {
            setLoadingColumns(prev => ({ ...prev, [itemKey]: true }));

            const optionsPromise = col.getOptions!(dependencyValue);

            if (optionsPromise instanceof Promise) {
              optionsPromise.then(options => {
                setDependentOptions(prev => ({ ...prev, [itemKey]: options }));
                // Auto-set the value if there's only one option and the field is currently empty
                if (options.length === 1 && !newItem[col.key]) {
                  updateNewItem(col.key, options[0].value);
                }
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              }).catch(error => {
                console.error(`[NestedArrayField] Error fetching options for ${col.key} in new item:`, error);
                setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              });
            } else {
              setDependentOptions(prev => ({ ...prev, [itemKey]: optionsPromise }));
              // Auto-set the value if there's only one option and the field is currently empty
              if (optionsPromise.length === 1 && !newItem[col.key]) {
                updateNewItem(col.key, optionsPromise[0].value);
              }
            }
          } else {
            setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
          }
        }

        // Handle editing item
        if (editingItem) {
          const dependencyValue = editingItem[col.dependsOn!];
          const itemKey = `edit-${col.key}-${dependencyValue}`;

          if (dependencyValue !== undefined && dependencyValue !== '') {
            setLoadingColumns(prev => ({ ...prev, [itemKey]: true }));

            const optionsPromise = col.getOptions!(dependencyValue);

            if (optionsPromise instanceof Promise) {
              optionsPromise.then(options => {
                setDependentOptions(prev => ({ ...prev, [itemKey]: options }));
                // Auto-set the value if there's only one option and the field is currently empty
                if (options.length === 1 && !editingItem[col.key]) {
                  updateEditingItem(col.key, options[0].value);
                }
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              }).catch(error => {
                console.error(`[NestedArrayField] Error fetching options for ${col.key} in editing item:`, error);
                setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
                setLoadingColumns(prev => ({ ...prev, [itemKey]: false }));
              });
            } else {
              setDependentOptions(prev => ({ ...prev, [itemKey]: optionsPromise }));
              // Auto-set the value if there's only one option and the field is currently empty
              if (optionsPromise.length === 1 && !editingItem[col.key]) {
                updateEditingItem(col.key, optionsPromise[0].value);
              }
            }
          } else {
            setDependentOptions(prev => ({ ...prev, [itemKey]: [] }));
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, config, newItem, editingItem, formMode]);

  if (!config) return null;

  // Form view for adding/editing items
  const renderFormView = () => {
    const isEditing = editingIndex !== null;
    const currentItem = isEditing ? editingItem : newItem;

    // Helper function to render a single column
    const renderColumn = (col: {
      key: string;
      label: string;
      type: 'text' | 'number' | 'select' | 'date' | 'custom' | 'combobox';
      options?: FormFieldOption[];
      required?: boolean;
      width?: 'full' | 'half';
      disabled?: boolean;
      dependsOn?: string;
      getOptions?: (dependencyValue: string | number) => Promise<FormFieldOption[]> | FormFieldOption[];
      allowNegative?: boolean;
      allowDecimal?: boolean;
      decimalScale?: number;
      render?: (props: {
        value: unknown;
        onChange: (value: string | number | unknown) => void;
        item: Record<string, string | number | unknown>;
        itemIndex: number;
        column: unknown;
        isDisabled: boolean;
      }) => React.ReactNode;
      multiple?: boolean;
    }) => {
      const dependencyValue = col.dependsOn && currentItem ? currentItem[col.dependsOn] : undefined;
      const itemKey = isEditing
        ? `edit-${col.key}-${dependencyValue}`
        : `new-${col.key}-${dependencyValue}`;
      const isLoading = loadingColumns[itemKey] || false;
      const options = col.dependsOn ? (dependentOptions[itemKey] || []) : (col.options || []);
      const currentValue = currentItem ? currentItem[col.key] : '';
      const isColumnDisabled = isDisabled || col.disabled || isLoading;

      return (
        <div key={col.key} className={`space-y-1 ${
          col.width === 'full' ? 'col-span-2' : 'col-span-1'
        }`} style={col.width === 'full' ? { gridColumn: '1 / -1' } : undefined}>
          <Label className="text-xs font-medium">
            {col.label}
            {col.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {col.type === 'custom' && col.render ? (
            col.render({
              value: currentValue,
              onChange: (val: string | number | unknown) => {
                if (isEditing) {
                  updateEditingItem(col.key, val as string | number);
                } else {
                  updateNewItem(col.key, val as string | number);
                }
              },
              item: currentItem || {},
              itemIndex: isEditing ? editingIndex! : -1,
              column: col,
              isDisabled: isColumnDisabled,
            })
          ) : col.type === 'combobox' ? (
            <Combobox
              multiple={col.multiple}
              items={Array.isArray(options) ? options.map((o: FormFieldOption) => String(o.value)) as string[] : []}
              defaultValue={Array.isArray(currentValue) ? currentValue as string[] : currentValue ? [String(currentValue)] : []}
              onValueChange={(val) => {
                const newValue = col.multiple ? val : val[0]
                if (isEditing) {
                  updateEditingItem(col.key, newValue as string | number);
                } else {
                  updateNewItem(col.key, newValue as string | number);
                }
              }}
              disabled={isColumnDisabled}
            >
              <ComboboxChips className="w-full">
                <ComboboxValue
                  render={(values: string[]) => (
                    <>
                      {values.map((v) => {
                        const option = options?.find((o: FormFieldOption) => String(o.value) === v);
                        return (
                          <ComboboxChip key={v} value={v}>
                            {option?.label || v}
                          </ComboboxChip>
                        )
                      })}
                      <ComboboxChipsInput placeholder={isLoading ? "Loading..." : `Select ${col.label}`} disabled={isColumnDisabled} />
                    </>
                  )}
                />
              </ComboboxChips>
              <ComboboxContent />
            </Combobox>
          ) : col.type === 'select' ? (
            <Select
              value={String(currentValue)}
              onValueChange={(val) => {
                if (isEditing) {
                  updateEditingItem(col.key, val);
                } else {
                  updateNewItem(col.key, val);
                }
              }}
              disabled={isColumnDisabled}
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
              disabled={isColumnDisabled}
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
              disabled={isColumnDisabled}
              className={`h-8 text-xs ${
                col.width === 'full' ? 'w-full' :
                col.width === 'half' ? 'w-1/2 max-w-[50%]' : 'w-full'
              }`}
              placeholder={col.label}
            />
          )}
        </div>
      );
    };

    // Check if using tabs or sections
    const useTabsLayout = config.useTabs && config.topRowColumns && config.tabs;
    const hasSections = config.sections && config.sections.length > 0;
    const columnsToRender = hasSections ? [] : (config.columns || []);

    // Helper function to check if tab has missing required fields
    const getTabStatus = (tab: { columns: Array<{ key: string; required?: boolean }> }) => {
      const requiredColumns = tab.columns.filter(col => col.required);
      const hasMissingRequired = requiredColumns.some(col => {
        const value = currentItem?.[col.key];
        return value === undefined || value === null || value === '';
      });
      return hasMissingRequired ? 'missing' : 'complete';
    };

    return (
      <>
        {useTabsLayout ? (
          <div className="space-y-3">
            {/* Top row - always visible */}
            <div className="space-y-3">
              {/* Row 1: Item (full width) */}
              {config.topRowColumns?.slice(0, 1).map((col) => (
                <div key={col.key} className="w-full">
                  {renderColumn(col)}
                </div>
              ))}
              {/* Row 2: Quantity, UOM, Unit Price (3 columns) */}
              <div className="grid grid-cols-3 gap-3 items-end">
                {config.topRowColumns?.slice(1).map((col) => renderColumn(col))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {config.tabs?.map((tab) => {
                  const status = getTabStatus(tab);
                  return (
                    <TabsTrigger key={tab.value} value={tab.value} className="text-xs gap-1">
                      {tab.label}
                      {status === 'complete' && (
                        <Check className="w-3 h-3 text-green-500" />
                      )}
                      {status === 'missing' && (
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {config.tabs?.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="space-y-3 mt-3">
                  <div className={`grid grid-cols-1 md:grid-cols-${tab.gridCols || 2} gap-3`}>
                    {tab.columns.map((col) => renderColumn(col))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ) : hasSections ? (
          // Render sections with headers (fallback for non-tab layouts)
          <div className="space-y-4">
            {config.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border rounded-lg p-4 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {section.columns.map((col) => renderColumn(col))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Render columns without sections (fallback)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {columnsToRender.map((col) => renderColumn(col))}
          </div>
        )}
        
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
      </>
    );
  };

  // Table view for displaying items
  const renderTableView = () => {
    // Handle sections, columns, and tabs for table view
    const allColumns = config.sections
      ? config.sections.flatMap(section => section.columns)
      : config.columns
        ? config.columns
        : config.tabs
          ? [...(config.topRowColumns || []), ...config.tabs.flatMap(tab => tab.columns)]
          : [];

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
                    {allColumns.map((col) => (
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
                      {allColumns.map((col) => (
                        <td key={col.key} className="px-3 py-2">
                          {col.type === 'custom' && col.render ? (
                            col.render({
                              value: item[col.key],
                              onChange: () => {},
                              item,
                              itemIndex: index,
                              column: col,
                              isDisabled: true,
                            })
                          ) : col.type === 'select' ?
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
