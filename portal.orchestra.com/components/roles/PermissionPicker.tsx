import { Permission } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface PermissionPickerProps {
  permissions: Permission[];
  selectedPermissionIds: number[];
  onChange: (permissionIds: number[]) => void;
}

// Converts a snake_case/kebab-case technical string to Title Case.
// e.g. "employee_profile" -> "Employee Profile", "hris" -> "HRIS"
function toTitleCase(str: string): string {
  const ACRONYMS = new Set(['hris', 'crm', 'erp', 'pos', 'api', 'ui', 'id']);
  return str
    .split(/[_\-\s]+/)
    .map((word) =>
      ACRONYMS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ');
}

// Returns a human-readable label for a permission, e.g.:
// resource="employee", action="view" -> "View Employee"
function formatPermissionLabel(resource: string, action: string): string {
  return `${toTitleCase(action)} ${toTitleCase(resource)}`;
}

// Returns Tailwind classes for a badge based on the action type.
function getActionBadgeClasses(action: string): string {
  switch (action.toLowerCase()) {
    case 'create':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
    case 'update':
    case 'edit':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
    case 'delete':
    case 'remove':
      return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800';
    case 'manage':
    case 'admin':
      return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'view':
    case 'read':
      return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}

export function PermissionPicker({
  permissions,
  selectedPermissionIds,
  onChange,
}: PermissionPickerProps) {
  // Group permissions by module
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleToggle = (permissionId: number) => {
    const newSelected = selectedPermissionIds.includes(permissionId)
      ? selectedPermissionIds.filter((id) => id !== permissionId)
      : [...selectedPermissionIds, permissionId];
    onChange(newSelected);
  };

  const handleSelectAllModule = (
    module: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // Prevent Accordion from toggling
    e.preventDefault();

    const modulePermissions = groupedPermissions[module];
    const modulePermissionIds = modulePermissions.map((p) => p.id);
    const allSelected = modulePermissionIds.every((id) =>
      selectedPermissionIds.includes(id)
    );

    if (allSelected) {
      onChange(
        selectedPermissionIds.filter((id) => !modulePermissionIds.includes(id))
      );
    } else {
      const newSelected = [
        ...selectedPermissionIds,
        ...modulePermissionIds.filter(
          (id) => !selectedPermissionIds.includes(id)
        ),
      ];
      onChange(newSelected);
    }
  };

  // Build an array of module names where some or all permissions are selected
  // so the accordion opens them by default and they are visible.
  const getDefaultValue = () => {
    const openModules: string[] = [];
    Object.entries(groupedPermissions).forEach(([module, modulePermissions]) => {
      const modulePermissionIds = modulePermissions.map((p) => p.id);
      const someSelected = modulePermissionIds.some((id) =>
        selectedPermissionIds.includes(id)
      );
      if (someSelected) {
        openModules.push(module);
      }
    });
    // Default to opening everything if nothing is selected (brand new role)
    if (openModules.length === 0) {
      return Object.keys(groupedPermissions);
    }
    return openModules;
  };

  return (
    <div className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={getDefaultValue()}
        className="w-full space-y-4"
      >
        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => {
          const modulePermissionIds = modulePermissions.map((p) => p.id);
          const allSelected = modulePermissionIds.every((id) =>
            selectedPermissionIds.includes(id)
          );
          const someSelected =
            !allSelected &&
            modulePermissionIds.some((id) => selectedPermissionIds.includes(id));
          const selectedCount = modulePermissionIds.filter((id) =>
            selectedPermissionIds.includes(id)
          ).length;

          return (
            <AccordionItem
              value={module}
              key={module}
              className="border rounded-lg bg-card px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold tracking-wide uppercase text-foreground">
                      {toTitleCase(module)}
                    </span>
                    {someSelected && (
                      <Badge
                        variant="outline"
                        className="text-xs font-normal text-muted-foreground"
                      >
                        {selectedCount} of {modulePermissions.length} selected
                      </Badge>
                    )}
                    {allSelected && (
                      <Badge
                        variant="outline"
                        className="text-xs font-normal bg-primary/10 text-primary border-primary/30"
                      >
                        All selected
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs shrink-0 z-10 hover:bg-muted"
                    onClick={(e) => handleSelectAllModule(module, e)}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modulePermissions.map((permission) => {
                    const isChecked = selectedPermissionIds.includes(
                      permission.id
                    );
                    return (
                      <Label
                        key={permission.id}
                        htmlFor={`permission-${permission.id}`}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20'
                            : 'bg-muted/10 border-border hover:bg-muted/40 hover:border-primary/20'
                        }`}
                      >
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={isChecked}
                          onCheckedChange={() => handleToggle(permission.id)}
                          className="mt-0.5 shrink-0 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                        />
                        <div className="grid gap-1.5 leading-none min-w-0">
                          <span className="text-sm font-medium leading-none select-none">
                            {formatPermissionLabel(
                              permission.resource,
                              permission.action
                            )}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-medium px-1.5 py-0 border ${getActionBadgeClasses(permission.action)}`}
                            >
                              {toTitleCase(permission.action)}
                            </Badge>
                            {permission.description && (
                              <p className="text-xs text-muted-foreground/80 truncate">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
