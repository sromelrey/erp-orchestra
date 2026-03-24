"use client";

import { Building2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapacityInfo } from "@/types/operations";

interface WarehouseCapacityCardProps {
  capacity: CapacityInfo;
  warehouseName?: string;
  className?: string;
}

export function WarehouseCapacityCard({
  capacity,
  className,
}: WarehouseCapacityCardProps) {
  // warehouseName is available in props if needed for future use
  const isNearCapacity = capacity.utilizationPercentage >= 90;
  const isHighUtilization = capacity.utilizationPercentage >= 75;

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Capacity Overview</CardTitle>
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Utilization */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Utilization</span>
              <span className={isNearCapacity ? "text-destructive" : ""}>
                {capacity.utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isNearCapacity ? "bg-red-500" : "bg-primary"
                }`}
                style={{ width: `${capacity.utilizationPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {capacity.usedCapacity.toLocaleString()} of {capacity.totalCapacity.toLocaleString()} units
            </p>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {capacity.availableCapacity.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {capacity.usedCapacity.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">In Use</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {capacity.locationBreakdown.length}
              </p>
              <p className="text-xs text-muted-foreground">Locations</p>
            </div>
          </div>

          {/* Alert for High Utilization */}
          {isHighUtilization && (
            <div className={`flex items-center gap-2 p-2 rounded-md ${
              isNearCapacity ? "bg-destructive/10 text-destructive" : "bg-yellow-50 text-yellow-800"
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs">
                {isNearCapacity 
                  ? "Critical: Warehouse is at near-full capacity"
                  : "Warning: Warehouse utilization is high"
                }
              </p>
            </div>
          )}

          {/* Top Utilized Locations */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Utilized Locations</p>
            <div className="space-y-1">
              {capacity.locationBreakdown
                .sort((a, b) => (b.usedCapacity / b.totalCapacity) - (a.usedCapacity / a.totalCapacity))
                .slice(0, 3)
                .map((location) => {
                  const utilization = (location.usedCapacity / location.totalCapacity) * 100;
                  return (
                    <div key={location.locationId} className="flex justify-between text-xs">
                      <span className="truncate mr-2">{location.locationName}</span>
                      <span className={utilization >= 90 ? "text-destructive" : "text-muted-foreground"}>
                        {utilization.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
