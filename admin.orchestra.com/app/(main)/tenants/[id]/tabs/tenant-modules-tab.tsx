"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Box } from "lucide-react";

interface TenantModulesTabProps {
  tenant: any;
}

export function TenantModulesTab({ tenant }: TenantModulesTabProps) {
  // Assuming tenant.plan.modules or we fetch plan modules separately
  // For now, let's assume we can get module info from the tenant's plan object if available
  // or purely hypothetical if data structure isn't fully ready. 
  // Based on your seed, plans have modules linked. 
  
  // Since we updated findAll/findOne to include 'plan', we likely need to ensure 'plan' includes 'modules'.
  // We didn't explicitly load plan.modules in the backend service update (joined 'plan' but not 'plan.modules').
  // Let's assume for now we might need to update the backend to fetch plan modules, or display what we have.
  
  // If plan modules are not yet loaded, we can just show the plan name.
  
  const planName = tenant?.plan?.name || "Unknown Plan";
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-primary" />
                    Subscription Plan: {planName}
                </CardTitle>
                <CardDescription>
                    Modules available under the {planName} plan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 border rounded-lg bg-muted/50 text-center text-muted-foreground">
                    Module list will appear here once linked in the API response.
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
