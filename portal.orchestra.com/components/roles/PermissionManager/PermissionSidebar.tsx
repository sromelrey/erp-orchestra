"use client";

import * as React from "react";
import { Cross } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Permission } from "@/types";

interface PermissionSidebarProps {
  modules: Record<
    string,
    {
      module: string;
      permissions: Array<Permission>;
      selectedCount: number;
      totalCount: number;
    }
  >;
  selectedModule: string | null;
  onModuleSelect: (module: string) => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function PermissionSidebar({
  modules,
  selectedModule,
  onModuleSelect,
  onToggleFullscreen,
  isFullscreen,
}: PermissionSidebarProps) {
  return (
    <div className="w-64 bg-card border-r border-b h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Modules
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFullscreen}
            className="lg:hidden"
          >
            {isFullscreen ? <Cross className="h-4 w-4" /> : "Fullscreen"}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {Object.entries(modules).map(([module, data]) => {
          const isSelected = selectedModule === module;
          const selectionPercentage =
            data.totalCount > 0
              ? (data.selectedCount / data.totalCount) * 100
              : 0;

          return (
            <div key={module} className="p-2">
              <button
                onClick={() => onModuleSelect(module)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent hover:text-accent-foreground border-border",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{module}</span>
                    {data.selectedCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {data.selectedCount}/{data.totalCount}
                      </Badge>
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
