import { FormField } from "@/components/entity-manager";

// To make this dynamic, you might need a factory function in page.tsx 
// to inject options from the respective APIs. 
// For now, we define the structure here.
export const formFields: FormField[] = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    placeholder: "e.g., Jane",
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    placeholder: "e.g., Doe",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "jane.doe@company.com",
    required: false,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "+1234567890",
    required: false,
  },
  {
    name: "employeeCode",
    label: "Employee Code",
    type: "text",
    placeholder: "EMP-001 (Optional)",
    required: false,
  },
  {
    name: "hireDate",
    label: "Hire Date",
    type: "date",
    required: false,
  },
  {
    name: "departmentId",
    label: "Department",
    type: "select",
    options: [], // Injected dynamically in page.tsx
    required: false,
  },
  {
    name: "designationId",
    label: "Designation",
    type: "select",
    options: [], // Injected dynamically in page.tsx
    required: false,
  },
  {
    name: "branchId",
    label: "Branch",
    type: "select",
    options: [], // Injected dynamically in page.tsx
    required: false,
  },
  {
    name: "managerId",
    label: "Reports To (Manager)",
    type: "select",
    options: [], // Injected dynamically in page.tsx
    required: false,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
      { label: "Archived", value: "ARCHIVED" },
    ],
    defaultValue: "ACTIVE",
  },
  // We can represent the boolean properly if EntityManager supports switch/checkbox.
  // Assuming "select" for true/false for broad compatibility with the current standard.
  {
    name: "createUserAccount",
    label: "Provision System Account?",
    type: "select",
    options: [
      { label: "Yes", value: "true" },
      { label: "No (HR Record Only)", value: "false" },
    ],
    defaultValue: "false",
  },
];
