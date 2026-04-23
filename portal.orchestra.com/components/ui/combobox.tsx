"use client"

import * as React from "react"
import { Command } from "cmdk"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ComboboxContext = React.createContext<{
  selectedValues: string[]
  handleSelect: (value: string) => void
  handleRemove: (value: string) => void
  multiple?: boolean
  items?: readonly string[]
  disabled?: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
} | null>(null)

interface ComboboxProps {
  children: React.ReactNode
  multiple?: boolean
  items?: readonly string[]
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Combobox = ({ children, multiple, items, defaultValue, value, onValueChange, disabled, open: controlledOpen, onOpenChange }: ComboboxProps) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue || value || [])
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleSetIsOpen = React.useCallback((open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalOpen(open)
    }
  }, [onOpenChange])

  const handleSelect = (selectedValue: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(selectedValue)
        ? selectedValues.filter((v) => v !== selectedValue)
        : [...selectedValues, selectedValue]
      setSelectedValues(newValues)
      onValueChange?.(newValues)
    } else {
      setSelectedValues([selectedValue])
      onValueChange?.([selectedValue])
      handleSetIsOpen(false) // Close dropdown for single selection
    }
  }

  const handleRemove = (valueToRemove: string) => {
    if (multiple) {
      const newValues = selectedValues.filter((v) => v !== valueToRemove)
      setSelectedValues(newValues)
      onValueChange?.(newValues)
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleSetIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleSetIsOpen])

  return (
    <ComboboxContext.Provider value={{ selectedValues, handleSelect, handleRemove, multiple, items, disabled, isOpen, setIsOpen: handleSetIsOpen }}>
      <div ref={containerRef} className="relative w-full min-w-0">
        <Command className="w-full min-w-0">
          {children}
        </Command>
      </div>
    </ComboboxContext.Provider>
  )
}

const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { anchor?: React.RefObject<HTMLDivElement> }
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(ComboboxContext)
  
  if (!context?.isOpen) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-64 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        "border-border/50 bg-background/95 backdrop-blur-sm",
        "w-full min-w-0",
        className
      )}
      {...props}
    >
      {children || (
        <>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {context?.items?.map((item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </>
      )}
    </div>
  )
})
ComboboxContent.displayName = "ComboboxContent"

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("py-6 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
))
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-1", className)}
    {...props}
  >
    {children}
  </div>
))
ComboboxList.displayName = "ComboboxList"

const ComboboxItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(ComboboxContext)
  const isSelected = context?.selectedValues.includes(value)
  
  return (
    <div
      ref={ref}
      data-value={value}
      data-selected={isSelected}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm",
        "transition-colors duration-150 ease-in-out",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground focus:outline-none",
        "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        "data-[selected=true]:hover:bg-primary/90 data-[selected=true]:hover:text-primary-foreground",
        className
      )}
      onClick={() => context?.handleSelect(value)}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {isSelected && (
        <svg className="h-4 w-4 ml-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  )
})
ComboboxItem.displayName = "ComboboxItem"

const ComboboxValue = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    render?: (values: string[]) => React.ReactNode
  }
>(({ children, render, className, ...props }, ref) => {
  const context = React.useContext(ComboboxContext)
  return (
    <div ref={ref} className={cn("flex flex-wrap gap-2", className)} {...props}>
      {render ? render(context?.selectedValues || []) : children}
    </div>
  )
})
ComboboxValue.displayName = "ComboboxValue"

const ComboboxChips = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(ComboboxContext)

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-wrap gap-2 p-2.5 border rounded-lg",
        "border-input bg-background",
        "hover:border-border/80 cursor-pointer",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20",
        "transition-all duration-200 ease-in-out",
        "min-h-[42px]",
        className
      )}
      onClick={() => !context?.disabled && context?.setIsOpen(!context.isOpen)}
      {...props}
    />
  )
})
ComboboxChips.displayName = "ComboboxChips"

const ComboboxChip = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { value: string; onRemove?: () => void }
>(({ className, value, onRemove, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-medium",
      "bg-primary text-primary-foreground border-primary/20",
      "shadow-sm",
      "transition-all duration-150 ease-in-out",
      "hover:bg-primary/90 hover:shadow-md",
      className
    )}
    onClick={(e) => e.stopPropagation()}
    {...props}
  >
    {children || value}
    {onRemove && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className={cn(
          "ml-1 rounded-full p-0.5 transition-colors",
          "hover:bg-primary-foreground/20",
          "focus-visible:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        )}
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </span>
))
ComboboxChip.displayName = "ComboboxChip"

const ComboboxChipsInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(ComboboxContext)

  return (
    <input
      ref={ref}
      className={cn(
        "flex-1 min-w-[120px] bg-transparent outline-none text-sm",
        "placeholder:text-muted-foreground/70",
        "focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        context?.setIsOpen(true)
      }}
      {...props}
    />
  )
})
ComboboxChipsInput.displayName = "ComboboxChipsInput"

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
}
