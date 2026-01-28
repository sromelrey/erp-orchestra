"use client";

import { useUpdateTenantMutation } from "@/store/api/tenantsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "@/lib/toast";

interface TenantDetailsTabProps {
  tenant: any;
}

export function TenantDetailsTab({ tenant }: TenantDetailsTabProps) {
  const [updateTenant, { isLoading }] = useUpdateTenantMutation();
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "", // mapped to slug
    status: "trial",
    plan: "",
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || "",
        subdomain: tenant.slug || "",
        status: tenant.status || "trial",
        plan: tenant.plan?.name || "",
      });
    }
  }, [tenant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSave = async () => {
    try {
      await updateTenant({
        id: tenant.id,
        body: formData,
      }).unwrap();
      toast.success("Tenant updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update tenant");
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Core details about the tenant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Acme Corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdomain (Slug)</Label>
              <Input
                id="subdomain"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="acme-corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={handleStatusChange} className="w-full">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <Input 
                    id="plan" 
                    name="plan" 
                    disabled
                    value={formData.plan} 
                    onChange={handleChange}
                    placeholder="Plan Name (e.g. Enterprise)"
                />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
