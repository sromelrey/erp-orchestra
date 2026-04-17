"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationTreeNode } from "@/types/operations";

interface LocationTreeViewProps {
  locations: LocationTreeNode[];
  onLocationSelect?: (location: LocationTreeNode) => void;
  selectedLocationId?: string;
  className?: string;
}

export function LocationTreeView({
  locations,
  onLocationSelect,
  selectedLocationId,
  className,
}: LocationTreeViewProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: LocationTreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedLocationId === node.id;
    const utilization = node.capacity && node.currentStock !== undefined
      ? (node.currentStock / node.capacity) * 100
      : 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
            hover:bg-accent transition-colors
            ${isSelected ? "bg-accent" : ""}
          `}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => onLocationSelect?.(node)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{node.name}</p>
              <p className="text-xs text-muted-foreground">{node.code}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {node.type}
            </Badge>
            
            {node.capacity && node.currentStock !== undefined && (
              <div className="flex items-center gap-1 min-w-0">
                <Package className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {node.currentStock}/{node.capacity}
                </span>
              </div>
            )}
          </div>
        </div>

        {node.capacity && (
          <div 
            className="px-2 pb-1"
            style={{ paddingLeft: `${level * 16 + 40}px` }}
          >
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all" 
                style={{ width: `${utilization}%` }}
              />
            </div>
          </div>
        )}

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {locations.map((location) => renderNode(location))}
    </div>
  );
}
