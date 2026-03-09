"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { Command } from "cmdk";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Option {
  label: string;
  value: string | number;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option...",
  disabled = false,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full h-11 justify-between rounded-xl bg-white/50 border-input shadow-sm transition-all duration-200 hover:bg-white hover:border-gray-300 focus:ring-2 focus:ring-ring focus:ring-offset-2 font-normal",
            !value && "text-muted-foreground",
            disabled && "bg-gray-50 text-gray-500 opacity-100 cursor-not-allowed",
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-(--radix-popover-trigger-width) min-w-[200px] p-0 rounded-xl border bg-white shadow-xl animate-in fade-in-0 zoom-in-95 overflow-hidden z-100"
          align="start"
          sideOffset={4}
        >
          <Command className="flex flex-col h-full max-h-[300px]">
            <div className="flex items-center border-b px-3 sticky top-0 bg-white z-10">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Search..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              {value && !disabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange("");
                    setOpen(false);
                  }}
                  className="ml-2 p-1 rounded-full hover:bg-gray-100 text-muted-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <Command.List className="overflow-y-auto overflow-x-hidden p-1">
              <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </Command.Empty>
              <Command.Group>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onValueChange(String(option.value));
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2.5 text-sm outline-none hover:bg-primary/5 data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition-colors",
                      value === option.value && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 transition-all duration-200",
                        value === option.value ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
