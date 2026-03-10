"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Permission } from "@/types"

interface PermissionContentProps {
  role: any
  selectedModule: string | null
  onModuleSelect: (module: string) => void
  isFullscreen: boolean
}

export function PermissionContent({ role, selectedModule, onModuleSelect, isFullscreen }: PermissionContentProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeFilters, setActiveFilters] = React.useState({
    actionTypes: [] as string[],
    resources: [] as string[],
  })

  // Mock permissions data - in real app, this would come from API
  const allPermissions: Permission[] = React.useMemo(() => {
    if (!role?.rolePermissions) return []
    return role.rolePermissions.map((rp: any) => rp.permission)
  }, [role?.rolePermissions])

  // Filter permissions based on search and filters
  const filteredPermissions = React.useMemo(() => {
    let filtered = allPermissions

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(permission =>
        permission.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.action.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply action type filter
    if (activeFilters.actionTypes.length > 0) {
      filtered = filtered.filter(permission =>
        activeFilters.actionTypes.includes(permission.action)
      )
    }

    // Apply resource filter
    if (activeFilters.resources.length > 0) {
      filtered = filtered.filter(permission =>
        activeFilters.resources.includes(permission.resource)
      )
    }

    // Group by selected module
    if (selectedModule) {
      filtered = filtered.filter(permission => permission.module === selectedModule)
    }

    return filtered
  }, [allPermissions, searchQuery, activeFilters, selectedModule])

  // Group filtered permissions by action type
  const actionGroups = React.useMemo(() => {
    if (!selectedModule) return {}

    const modulePermissions = filteredPermissions.filter(p => p.module === selectedModule)
    
    return modulePermissions.reduce((acc, permission) => {
      const actionType = permission.action
      if (!acc[actionType]) {
        acc[actionType] = []
      }
      acc[actionType].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
  }, [filteredPermissions, selectedModule])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleActionFilterToggle = (actionType: string) => {
    setActiveFilters(prev => ({
      ...prev,
      actionTypes: prev.actionTypes.includes(actionType)
        ? prev.actionTypes.filter(t => t !== actionTypes)
        : [...prev.actionTypes, actionTypes]
    }))
  }

  const handleResourceFilterToggle = (resource: string) => {
    setActiveFilters(prev => ({
      ...prev,
      resources: prev.resources.includes(resource)
        ? prev.resources.filter(r => r !== resource)
        : [...prev.resources, resource]
    }))
  }

  const clearFilters = () => {
    setActiveFilters({ actionTypes: [], resources: [] })
  }

  const getActionBadgeClasses = (action: string) => {
    switch (action.toLowerCase()) {
      case 'view':
      case 'read':
        return 'bg-sky-100 text-sky-700 border-sky-200'
      case 'create':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'update':
      case 'edit':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'delete':
      case 'remove':
        return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'manage':
      case 'admin':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Search and Filter Bar */}
      <div className="border-b bg-card p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="h-10 w-full" placeholder="Search permissions..." />
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
        
        {/* Action Type Filters */}
        <div className="flex flex-wrap gap-2">
          {['view', 'create', 'update', 'delete', 'manage'].map(action => (
            <Button
              key={action}
              variant={activeFilters.actionTypes.includes(action) ? "default" : "outline"}
              size="sm"
              onClick={() => handleActionFilterToggle(action)}
              className={cn(
                "capitalize",
                activeFilters.actionTypes.includes(action) && getActionBadgeClasses(action)
              )}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Type Tabs */}
      <Tabs defaultValue="view" className="w-full">
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
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {permissions.map(permission => (
                <div
                  key={permission.id}
                  className="p-4 border rounded-lg bg-card hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center",
                      getActionBadgeClasses(permission.action)
                    )}>
                      <span className="text-xs font-bold uppercase">
                        {permission.action.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {permission.name || `${permission.action} ${permission.resource}`}
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
