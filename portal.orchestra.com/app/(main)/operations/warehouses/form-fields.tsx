import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Warehouse Name",
    type: "text",
    placeholder: "Enter warehouse name",
    required: true,
  },
  {
    name: "code",
    label: "Warehouse Code",
    type: "text",
    placeholder: "e.g., WH001",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter warehouse description",
  },
  {
    name: "isDefault",
    label: "Is Default",
    type: "select",
    options: [
      { label: "No", value: "false" },
      { label: "Yes", value: "true" },
    ],
    defaultValue: "false",
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
  },
];
