"use client";

import * as React from "react";
import { X, Search, Filter, CheckSquare, Square, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PermissionSidebar } from "./PermissionSidebar";
import { PermissionContent } from "./PermissionContentNew";

interface PermissionManagerProps {
  role: any;
  onClose: () => void;
}

export function PermissionManager({ role, onClose }: PermissionManagerProps) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [selectedModule, setSelectedModule] = React.useState<string | null>(
    null,
  );

  const handleModuleSelect = (module: string) => {
    setSelectedModule(module);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsSheetOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Mobile/Tablet - Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>Manage Permissions - {role?.name}</SheetTitle>
            <Button variant="ghost" size="sm" onClick={handleToggleFullscreen}>
              <Square className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <PermissionContent
            role={role}
            selectedModule={selectedModule}
            onModuleSelect={handleModuleSelect}
            isFullscreen={false}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop - Full Screen */}
      <div className="hidden lg:flex h-full">
        <PermissionSidebar
          modules={{}}
          selectedModule={selectedModule}
          onModuleSelect={handleModuleSelect}
          onToggleFullscreen={handleToggleFullscreen}
          isFullscreen={isFullscreen}
        />
        <div className="flex-1 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h1 className="text-xl font-semibold">Manage Permissions</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span>Permissions</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSheetOpen(true)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" onClick={handleClose}>
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
            <PermissionContent
              role={role}
              selectedModule={selectedModule}
              onModuleSelect={handleModuleSelect}
              isFullscreen={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}
