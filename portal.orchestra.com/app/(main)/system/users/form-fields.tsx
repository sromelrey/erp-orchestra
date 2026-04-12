import { FormField, FormFieldOption } from "@/components/entity-manager/types";
import { User } from '@/types';

export interface FormFieldsContext {
  roleOptions: FormFieldOption[];
  isProcessing?: boolean;
  currentOpenItem?: User | null;
  isCreate?: boolean;
}

export const getFormFields = (context: FormFieldsContext): FormField[] => {
  const { roleOptions, isProcessing, currentOpenItem, isCreate } = context;

  const isEditable = !currentOpenItem || currentOpenItem.status !== 'BANNED';

  const baseFields: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      width: "full",
      disabled: isProcessing || !isCreate,
      placeholder: "user@example.com",
    },
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      width: "half",
      disabled: isProcessing || !isEditable,
      placeholder: "John",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      width: "half",
      disabled: isProcessing || !isEditable,
      placeholder: "Doe",
    },
    {
      name: "password",
      label: "Password",
      type: "text",
      required: isCreate,
      width: "full",
      disabled: true,
      placeholder: "Default: password123",
      defaultValue: "password123",
      description: "Default password is set to 'password123'. Users can change it after login.",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      width: "half",
      disabled: isProcessing || !isEditable,
      options: [
        { value: "ACTIVE", label: "Active" },
        { value: "INACTIVE", label: "Inactive" },
        { value: "BANNED", label: "Banned" },
      ],
      defaultValue: "ACTIVE",
    },
    {
      name: "isTenantAdmin",
      label: "Tenant Admin",
      type: "checkbox",
      required: false,
      width: "half",
      disabled: isProcessing || !isEditable,
      description: "Grant tenant admin privileges to this user",
    },
    {
      name: "roleIds",
      label: "Roles",
      type: "select",
      required: true,
      width: "full",
      disabled: isProcessing || !isEditable,
      options: roleOptions,
      placeholder: "Select one or more roles",
    },
  ];

  return baseFields;
};

// Export for EntityManager compatibility
export const userFormFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "text",
    required: true,
    width: "full",
    placeholder: "user@example.com",
  },
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
    width: "half",
    placeholder: "John",
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
    width: "half",
    placeholder: "Doe",
  },
  {
    name: "password",
    label: "Password",
    type: "text",
    required: false,
    width: "full",
    disabled: true,
    placeholder: "Default: password123",
    defaultValue: "password123",
    description: "Default password is set to 'password123'. Users can change it after login.",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    width: "half",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "BANNED", label: "Banned" },
    ],
    defaultValue: "ACTIVE",
  },
  {
    name: "isTenantAdmin",
    label: "Tenant Admin",
    type: "checkbox",
    required: false,
    width: "half",
    description: "Grant tenant admin privileges to this user",
  },
  {
    name: "roleIds",
    label: "Roles",
    type: "select",
    required: true,
    width: "full",
    options: [], // Will be populated dynamically
    placeholder: "Select one or more roles",
  },
];
