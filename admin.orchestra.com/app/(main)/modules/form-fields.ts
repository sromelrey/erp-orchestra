import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Module Name",
    type: "text",
    placeholder: "e.g. Human Resources",
    required: true,
  },
  {
    name: "code",
    label: "Module Code",
    type: "text",
    placeholder: "e.g. HRIS",
    required: true,
    description: "Unique code (UPPERCASE_UNDERSCORE)",
  },
  {
    name: "type",
    label: "Module Type",
    type: "select",
    options: [
      { label: "Module", value: "MODULE" },
      { label: "Sub-Module", value: "SUB_MODULE" },
    ],
    defaultValue: "MODULE",
    required: false,
    description: "Top-level module or sub-module",
  },
  {
    name: "parentId",
    label: "Parent Module",
    type: "text",
    placeholder: "Parent module ID (for sub-modules)",
    required: false,
    description: "Leave empty for top-level modules",
  },
  {
    name: "isActive",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ],
    defaultValue: "true",
    required: true,
  },
];
