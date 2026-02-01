import { FormField } from "@/components/entity-manager";

export const userFormFields: FormField[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "e.g., John",
    width: "half",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    placeholder: "e.g., Doe",
    width: "half",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
    placeholder: "e.g., john.doe@example.com",
    width: "full",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter password",
    width: "full",
    defaultValue: "password123",
    description: "Default password is 'password123'",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
    ],
    defaultValue: "ACTIVE",
    width: "full",
  },
];

