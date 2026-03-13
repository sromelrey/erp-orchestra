import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "jobName",
    label: "Job Name",
    type: "text",
    placeholder: "Enter job name",
    required: true,
    disabled: true, // Job name is system-generated
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Success", value: "SUCCESS" },
      { label: "Failed", value: "FAILED" },
      { label: "Partial", value: "PARTIAL" },
    ],
    disabled: true, // Status is system-generated
  },
  {
    name: "processedCount",
    label: "Processed Count",
    type: "number",
    placeholder: "0",
    disabled: true, // Count is system-generated
  },
  {
    name: "errorCount",
    label: "Error Count",
    type: "number",
    placeholder: "0",
    disabled: true, // Count is system-generated
  },
  {
    name: "startedAt",
    label: "Started At",
    type: "text",
    disabled: true, // Timestamp is system-generated
  },
  {
    name: "completedAt",
    label: "Completed At",
    type: "text",
    disabled: true, // Timestamp is system-generated
  },
  {
    name: "errorMessage",
    label: "Error Message",
    type: "textarea",
    placeholder: "No errors",
    disabled: true, // Error message is system-generated
  },
];
