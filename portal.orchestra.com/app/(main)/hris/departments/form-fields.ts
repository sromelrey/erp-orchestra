import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Department Name",
    type: "text",
    placeholder: "e.g., Human Resources",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Brief description of the department's role...",
    required: false,
  },
  {
    name: "is_active",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
    defaultValue: "true",
  },
];
