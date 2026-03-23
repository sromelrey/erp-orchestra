'use client';

import * as React from 'react';
import { X, Search, Save, CheckSquare, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PermissionManagerProps } from './types';
import { PermissionMatrix } from './permission-matrix';
import { usePermissionMatrix } from './hooks/use-permission-matrix';
import { Role, Permission } from '@/types';
import { useAssignPermissionsMutation } from '@/store/api/rolesApi';

/**
 * PermissionManager - Modern SaaS-style permission management interface
 *
 * Features:
 * - Permission matrix layout for quick scanning
 * - Bulk operations (Select All/Clear All)
 * - Real-time search and filtering
 * - Module-based organization with progress indicators
 * - Color-coded permission toggles
 * - Modern SaaS aesthetic (Stripe/Linear/Vercel style)
 *
 * @param role - The role object being managed (contains rolePermissions)
 * @param onClose - Callback function when the permission dialog closes
 *
 * @example
 * ```tsx
 * <PermissionManager
 *   role={selectedRole}
 *   onClose={() => setIsPermissionDialogOpen(false)}
 * />
 * ```
 */
export function PermissionManager({
  title,
  subtitle,
  description,
  allPermissions,
  initialSelectedPermissions = [],
  onSave,
  onClose,
  isSaving = false,
}: PermissionManagerProps) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  // Use the permission matrix hook for state management
  const {
    groupedPermissions,
    selectedPermissions,
    searchQuery,
    setSearchQuery,
    permissionStats,
    handleTogglePermission,
    handleBulkSelect,
    handleBulkClear,
  } = usePermissionMatrix(initialSelectedPermissions, allPermissions);

  const handleClose = () => {
    setIsSheetOpen(false);
    onClose?.();
  };

  const handleSave = async () => {
    try {
      await onSave(Array.from(selectedPermissions));
    } catch (error) {
      console.error('Failed to save permissions:', error);
    }
  };

  return (
    <>
      {/* Mobile/Tablet - Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full min-w-[800px] max-w-[90vw] overflow-hidden">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{title}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsSheetOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <PermissionMatrixContent
            title={title}
            subtitle={subtitle}
            description={description}
            allPermissions={allPermissions}
            groupedPermissions={groupedPermissions}
            selectedPermissions={selectedPermissions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            permissionStats={permissionStats}
            handleTogglePermission={handleTogglePermission}
            handleBulkSelect={handleBulkSelect}
            handleBulkClear={handleBulkClear}
            onSave={handleSave}
            onClose={handleClose}
            isSaving={isSaving}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop - Full Screen */}
      <div className="hidden lg:flex h-full w-full">
        <div className="flex-1 min-h-0 overflow-hidden">
          <PermissionMatrixContent
            title={title}
            subtitle={subtitle}
            description={description}
            allPermissions={allPermissions}
            groupedPermissions={groupedPermissions}
            selectedPermissions={selectedPermissions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            permissionStats={permissionStats}
            handleTogglePermission={handleTogglePermission}
            handleBulkSelect={handleBulkSelect}
            handleBulkClear={handleBulkClear}
            onSave={handleSave}
            onClose={handleClose}
            isSaving={isSaving}
          />
        </div>
      </div>
    </>
  );
}

/**
 * PermissionMatrixContent - Shared content component for both sheet and desktop views
 */
interface PermissionMatrixContentProps {
  title: string;
  subtitle?: string;
  description?: string;
  allPermissions: Permission[];
  groupedPermissions: Record<
    string,
    Array<{
      resource: string;
      permissions: Permission[];
    }>
  >;
  selectedPermissions: Set<string>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  permissionStats: {
    total: number;
    enabled: number;
    byModule: Record<string, number>;
  };
  handleTogglePermission: (slug: string) => void;
  handleBulkSelect: () => void;
  handleBulkClear: () => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
}

function PermissionMatrixContent({
  title,
  subtitle,
  description,
  allPermissions,
  groupedPermissions,
  selectedPermissions,
  searchQuery,
  setSearchQuery,
  permissionStats,
  handleTogglePermission,
  handleBulkSelect,
  handleBulkClear,
  onSave,
  onClose,
  isSaving,
}: PermissionMatrixContentProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-6 space-y-4 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">{title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium text-foreground">{subtitle}</span>
              <span className="text-muted-foreground">•</span>
              <p className="text-sm text-muted-foreground">
                {permissionStats.enabled} of {permissionStats.total} enabled
              </p>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground max-w-2xl line-clamp-2">{description}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkClear} className="h-9">
              <Square className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button variant="outline" size="sm" onClick={handleBulkSelect} className="h-9">
              <CheckSquare className="h-4 w-4 mr-2" />
              Select All
            </Button>
            <Button onClick={onSave} className="h-9 bg-primary" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-9">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="secondary">{permissionStats.enabled} permissions enabled</Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <PermissionMatrix
          groupedPermissions={groupedPermissions}
          selectedPermissions={selectedPermissions}
          onTogglePermission={handleTogglePermission}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
