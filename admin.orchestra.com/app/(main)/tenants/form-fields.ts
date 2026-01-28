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
      { label: "Starter", value: "Starter" },
      { label: "Professional", value: "Professional" },
      { label: "Enterprise", value: "Enterprise" },
    ],
    defaultValue: "Starter",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "active" },
      { label: "Suspended", value: "suspended" },
      { label: "Trial", value: "trial" }, 
    ],
    defaultValue: "active",
  },
];
