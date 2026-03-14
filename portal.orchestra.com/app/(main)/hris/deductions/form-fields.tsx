import { FormField } from "@/components/entity-manager";
import { DeductionType, DeductionFrequency } from "@/store/api/compensationApi";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Deduction Name",
    type: "text",
    placeholder: "Enter deduction name",
    required: true,
  },
  {
    name: "type",
    label: "Deduction Type",
    type: "select",
    options: [
      { label: "Fixed Amount", value: DeductionType.FIXED },
      { label: "Percentage", value: DeductionType.PERCENTAGE },
      { label: "Recurring", value: DeductionType.RECURRING },
      { label: "Variable", value: DeductionType.VARIABLE },
    ],
    defaultValue: DeductionType.FIXED,
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter fixed amount in pesos",
    required: false,
  },
  {
    name: "percentage",
    label: "Percentage",
    type: "number",
    placeholder: "Enter percentage (e.g., 5.5 for 5.5%)",
    required: false,
  },
  {
    name: "frequency",
    label: "Frequency",
    type: "select",
    options: [
      { label: "One-Time", value: DeductionFrequency.ONE_TIME },
      { label: "Monthly", value: DeductionFrequency.MONTHLY },
      { label: "Quarterly", value: DeductionFrequency.QUARTERLY },
      { label: "Annually", value: DeductionFrequency.ANNUALLY },
    ],
    defaultValue: DeductionFrequency.MONTHLY,
  },
  {
    name: "effectiveDate",
    label: "Effective Date",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    placeholder: "Leave empty for ongoing",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter deduction description",
    required: false,
  },
];
