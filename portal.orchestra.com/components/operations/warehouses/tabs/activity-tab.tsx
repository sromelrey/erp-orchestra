"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle } from "lucide-react";

interface ActivityTabProps {
  warehouseId: string;
}

export function ActivityTab({ }: ActivityTabProps) {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 p-6">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
        <span className="text-muted-foreground">
          Activity logging features will be implemented in a future update.
          This will include audit trails, location changes, and warehouse activities.
        </span>
      </CardContent>
    </Card>
  );
}
