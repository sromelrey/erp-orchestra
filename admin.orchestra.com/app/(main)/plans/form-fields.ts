import { FormField } from "@/components/entity-manager";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Plan Name",
    type: "text",
    placeholder: "e.g. Enterprise",
    required: true,
  },
  {
    name: "monthlyPrice",
    label: "Monthly Price",
    type: "number",
    placeholder: "0.00",
    required: true,
    description: "Price in USD",
  },
  {
    name: "maxUsers",
    label: "Max Users",
    type: "number",
    placeholder: "e.g. 10",
    required: true,
    description: "Maximum number of allowed users",
  },
];
