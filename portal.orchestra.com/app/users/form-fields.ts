import { FormField } from "@/components/entity-manager";

// NOTE: The role options will typically be fetched dynamically. 
// For now, we use placeholders.
const roleOptions = [
  { label: "Administrator", value: "1" },
  { label: "Editor", value: "2" },
  { label: "Viewer", value: "3" },
];

export const userFormFields: FormField[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    required: true,
    placeholder: "e.g., John Doe",
    width: "half",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "e.g., john.doe@example.com",
    width: "half",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "New password (only on create)",
    description: "Required for new users. Leave blank to keep current password on edit.",
    width: "half",
  },
  {
    name: "roleId",
    label: "Role",
    type: "select",
    required: true,
    options: roleOptions,
    width: "half",
  },
  // Status field is managed internally or set by the backend, 
  // but we can add it for completeness if needed for edits.
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    defaultValue: "active",
    width: "half",
  },
];
