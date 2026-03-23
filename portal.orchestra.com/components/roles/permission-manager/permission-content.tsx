'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Permission } from '@/types';
import { PermissionContentProps } from './types';

/**
 * PermissionContent - Main content area for permission management
 *
 * Features:
 * - Real-time search across permissions
 * - Filter by action types (View, Create, Update, Delete, Manage)
 * - Group permissions by action type in tabs
 * - Visual permission cards with icons and descriptions
 *
 * @param role - The role being managed
 * @param selectedModule - Currently selected module name
 * @param isFullscreen - Whether the interface is in fullscreen mode
 */
export function PermissionContent({ role, selectedModule, isFullscreen }: PermissionContentProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeActionTypes, setActiveActionTypes] = React.useState<string[]>([]);

  // Mock permissions data - in real app, this would come from API
  const allPermissions: Permission[] = React.useMemo(() => {
    if (!role?.rolePermissions) return [];
    return role.rolePermissions.map((rp: { permission: Permission }) => rp.permission);
  }, [role.rolePermissions]);

  // Filter permissions based on search and filters
  const filteredPermissions = React.useMemo(() => {
    let filtered = allPermissions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (permission) =>
          permission.slug?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
          permission.action.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply action type filter
    if (activeActionTypes.length > 0) {
      filtered = filtered.filter((permission) => activeActionTypes.includes(permission.action));
    }

    // Apply module filter
    if (selectedModule) {
      filtered = filtered.filter((permission) => permission.module === selectedModule);
    }

    return filtered;
  }, [allPermissions, searchQuery, activeActionTypes, selectedModule]);

  // Group filtered permissions by action type
  const actionGroups = React.useMemo(() => {
    if (!selectedModule) return {};

    const modulePermissions = filteredPermissions.filter((p) => p.module === selectedModule);

    return modulePermissions.reduce(
      (acc, permission) => {
        const actionType = permission.action;
        if (!acc[actionType]) {
          acc[actionType] = [];
        }
        acc[actionType].push(permission);
        return acc;
      },
      {} as Record<string, Permission[]>
    );
  }, [filteredPermissions, selectedModule]);

  const handleActionFilterToggle = (actionType: string) => {
    setActiveActionTypes((prev) =>
      prev.includes(actionType) ? prev.filter((t) => t !== actionType) : [...prev, actionType]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveActionTypes([]);
  };

  const getActionBadgeClasses = (action: string) => {
    switch (action.toLowerCase()) {
      case 'view':
      case 'read':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'create':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'update':
      case 'edit':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'delete':
      case 'remove':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'manage':
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Search and Filter Bar */}
      <div className="border-b bg-card p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Action Type Filters */}
        <div className="flex flex-wrap gap-2">
          {['view', 'create', 'update', 'delete', 'manage'].map((action) => (
            <Button
              key={action}
              variant={activeActionTypes.includes(action) ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleActionFilterToggle(action)}
              className={cn(
                'capitalize',
                activeActionTypes.includes(action) && getActionBadgeClasses(action)
              )}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1">
        {!selectedModule ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a Module</h3>
              <p className="text-muted-foreground max-w-md">
                Choose a module from the sidebar to view and manage its permissions.
              </p>
            </div>
          </div>
        ) : Object.keys(actionGroups).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <X className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Permissions Found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || activeActionTypes.length > 0
                  ? 'Try adjusting your search or filters to find permissions.'
                  : 'No permissions available for this module.'}
              </p>
            </div>
          </div>
        ) : (
          /* Action Type Tabs */
          <Tabs defaultValue={Object.keys(actionGroups)[0]} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(actionGroups).map(([action, permissions]) => (
                <TabsTrigger key={action} value={action} className="capitalize">
                  <div className="flex items-center gap-2">
                    <span>{action}</span>
                    <Badge variant="outline" className="text-xs">
                      {permissions.length}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(actionGroups).map(([action, permissions]) => (
              <TabsContent key={action} value={action} className="mt-4">
                <ScrollArea className="h-[400px]">
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    }}
                  >
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="p-4 border rounded-lg bg-card hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-5 h-5 rounded border flex items-center justify-center',
                              getActionBadgeClasses(permission.action)
                            )}
                          >
                            <span className="text-xs font-bold uppercase">
                              {permission.action.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {permission.slug || `${permission.action} ${permission.resource}`}
                            </h4>
                            {permission.description && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
