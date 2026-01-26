import { FormField } from "@/components/entity-manager";

// Form fields configuration
export const formFields: FormField[] = [
  {
    name: "name",
    label: "Tenant Name",
    type: "text",
    placeholder: "Acme Corp",
    required: true,
  },
  {
    name: "subdomain",
    label: "Subdomain",
    type: "text",
    placeholder: "acme",
    required: true,
    suffix: ".orchestra.com",
  },
  {
    name: "plan",
    label: "Plan",
    type: "select",
    options: [
      { label: "Basic", value: "Basic" },
      { label: "Pro", value: "Pro" },
      { label: "Enterprise", value: "Enterprise" },
    ],
    defaultValue: "Basic",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Suspended", value: "suspended" },
    ],
    defaultValue: "pending",
  },
];
