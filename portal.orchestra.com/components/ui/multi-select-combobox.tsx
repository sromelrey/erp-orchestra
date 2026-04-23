'use client';

import React, { useState } from 'react';
import { Combobox, ComboboxChips, ComboboxChip, ComboboxChipsInput, ComboboxContent, ComboboxValue } from '@/components/ui/combobox';

export interface MultiSelectItem {
  [key: string]: number | string | unknown;
  quantity?: number;
}

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectComboboxProps {
  value: MultiSelectItem[];
  onChange: (value: MultiSelectItem[]) => void;
  options: MultiSelectOption[];
  disabled?: boolean;
  idKey?: string; // default 'id'
  placeholder?: string;
}

export function MultiSelectCombobox({
  value,
  onChange,
  options,
  disabled = false,
  idKey = 'id',
  placeholder = 'Select items',
}: MultiSelectComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItems = Array.isArray(value) ? value : [];
  const selectedItemIds = selectedItems.map((item) => String(item[idKey as keyof MultiSelectItem] as number));

  return (
    <div className="space-y-2">
      <Combobox
        multiple
        open={isOpen}
        onOpenChange={setIsOpen}
        items={options?.map((o) => o.label) as string[] || []}
        defaultValue={selectedItemIds.map(id =>
          options?.find(o => o.value === String(id))?.label || ''
        ).filter(Boolean)}
        onValueChange={(labels) => {
          const newItems = labels.map((label) => {
            const option = options?.find(o => o.label === label);
            const existing = selectedItems.find((item) =>
              item[idKey as keyof MultiSelectItem] === Number(option?.value)
            );
            return existing || { [idKey]: Number(option?.value), quantity: 1 } as MultiSelectItem;
          });
          onChange(newItems);

          // Close dropdown when all items are selected
          if (options && newItems.length === options.length) {
            setIsOpen(false);
          }
        }}
        disabled={disabled}
      >
        <ComboboxChips className="w-full">
          <ComboboxValue
            render={(values: string[]) => (
              <>
                {values.map((v) => {
                  return (
                    <ComboboxChip key={v} value={v}>
                      {v}
                    </ComboboxChip>
                  )
                })}
                {(!options || values.length < options.length) && (
                  <ComboboxChipsInput placeholder={placeholder} disabled={disabled} />
                )}
              </>
            )}
          />
        </ComboboxChips>
        <ComboboxContent />
      </Combobox>
    </div>
  );
}
