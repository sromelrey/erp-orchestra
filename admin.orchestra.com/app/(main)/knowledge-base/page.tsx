import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Layers, Package } from "lucide-react";

export default function KnowledgeBasePage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Core concepts and documentation for the Orchestrator ERP system.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Tenants Section */}
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>
              Organizations using the ERP platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>What is a Tenant?</strong>
              <br />
              A tenant represents a distinct organization or client that uses the
              Orchestrator ERP. Each tenant is isolated from others, ensuring data
              privacy and security.
            </p>
            <p>
              <strong>Key Attributes:</strong>
              <ul className="ml-4 list-disc">
                <li>Unique Identifier (UUID)</li>
                <li>Domain/Subdomain</li>
                <li>Subscription Plan</li>
                <li>Enabled Modules</li>
              </ul>
            </p>
          </CardContent>
        </Card>

        {/* Plans Section */}
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Plans</CardTitle>
            <CardDescription>
              Subscription tiers and feature access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>What are Plans?</strong>
              <br />
              Plans define the subscription levels available to tenants (e.g.,
              Free, Basic, Pro, Enterprise). They determine the cost and potential
              limitations of the service.
            </p>
            <p>
              <strong>Usage:</strong>
              <br />
              Plans are used to bundle specific sets of features or modules and
              apply usage quotas (e.g., max users, max storage).
            </p>
          </CardContent>
        </Card>

        {/* System Modules Section */}
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>System Modules</CardTitle>
            <CardDescription>
              Functional components of the ERP.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>What are Modules?</strong>
              <br />
              Modules are the core functional blocks of the ERP system. They can be organized hierarchically to represent complex systems.
            </p>
            <p>
              <strong>Module Types:</strong>
              <ul className="ml-4 list-disc">
                <li>
                  <strong>Top-Level Module (MODULE):</strong> A main system area (e.g., HRIS, Accounting).
                </li>
                <li>
                  <strong>Sub-Module (SUB_MODULE):</strong> A specific functional area within a top-level module (e.g., Leave Management under HRIS).
                </li>
              </ul>
            </p>
            <p>
              <strong>Hierarchy:</strong>
              <br />
               Modules can have parent-child relationships, allowing for structured organization of features.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
