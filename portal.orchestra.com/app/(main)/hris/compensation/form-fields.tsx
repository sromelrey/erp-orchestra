import { FormField } from "@/components/entity-manager";
import { PaymentFrequency } from "@/store/api/compensationApi";

export const formFields: FormField[] = [
  {
    name: "baseSalary",
    label: "Base Salary",
    type: "number",
    placeholder: "Enter base salary in pesos",
    required: false,
  },
  {
    name: "hourlyRate",
    label: "Hourly Rate",
    type: "number",
    placeholder: "Enter hourly rate in pesos",
    required: false,
  },
  {
    name: "overtimeRate",
    label: "Overtime Rate",
    type: "number",
    placeholder: "Enter overtime rate (e.g., 1.5)",
    required: false,
    defaultValue: "1.5",
  },
  {
    name: "currency",
    label: "Currency",
    type: "select",
    options: [
      { label: "USD", value: "USD" },
      { label: "EUR", value: "EUR" },
      { label: "GBP", value: "GBP" },
      { label: "JPY", value: "JPY" },
      { label: "CAD", value: "CAD" },
    ],
    defaultValue: "USD",
  },
  {
    name: "paymentFrequency",
    label: "Payment Frequency",
    type: "select",
    options: [
      { label: "Weekly", value: PaymentFrequency.WEEKLY },
      { label: "Bi-Weekly", value: PaymentFrequency.BI_WEEKLY },
      { label: "Semi-Monthly", value: PaymentFrequency.SEMI_MONTHLY },
      { label: "Monthly", value: PaymentFrequency.MONTHLY },
    ],
    defaultValue: PaymentFrequency.MONTHLY,
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
    name: "changeReason",
    label: "Change Reason",
    type: "textarea",
    placeholder: "Reason for this compensation change",
    required: false,
  },
];
