import { FormField } from "@/components/entity-manager";

export const roleFormFields: FormField[] = [
  {
    name: "name",
    label: "Role Name",
    type: "text",
    required: true,
    placeholder: "e.g., Manager",
    width: "full",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: false,
    placeholder: "Describe the role's purpose and responsibilities",
    width: "full",
  },
];
