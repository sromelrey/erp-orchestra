"use client";

import { useGetTenantByIdQuery } from "@/store/api/tenantsApi";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2 } from "lucide-react";
import { TenantDetailsTab } from "./tabs/tenant-details-tab";
import { TenantUsersTab } from "./tabs/tenant-users-tab";
import { TenantModulesTab } from "./tabs/tenant-modules-tab";

export default function TenantPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: tenant, isLoading, error } = useGetTenantByIdQuery(id);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading tenant details...</div>;
  }

  if (error || !tenant) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load tenant details.
        <br />
        <Button variant="link" onClick={() => router.push("/tenants")}>
          Go back to Tenants list
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/tenants")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
                <p className="text-sm text-muted-foreground">{tenant.slug}.orchestra.com</p>
            </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="users">Tenant Admins</TabsTrigger>
          <TabsTrigger value="modules">Module Access</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <TenantDetailsTab tenant={tenant} />
        </TabsContent>
        <TabsContent value="users">
            <TenantUsersTab tenantId={id} />
        </TabsContent>
        <TabsContent value="modules">
          <TenantModulesTab tenant={tenant} />
        </TabsContent>
        {/* Placeholder for future tabs */}
        {/* <TabsContent value="billing">Billing Info</TabsContent> */}
      </Tabs>
    </div>
  );
}
