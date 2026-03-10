import { FormField } from "@/components/entity-manager";
import { PayPeriodStatus } from "@/store/api/payPeriodsApi";

export const formFields: FormField[] = [
  {
    name: "name",
    label: "Pay Period Name",
    type: "text",
    placeholder: "e.g., March 2026 - First Half",
    required: true,
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: Object.values(PayPeriodStatus).map(status => ({
      label: status as string,
      value: status as string
    })),
    defaultValue: PayPeriodStatus.OPEN,
    required: true,
  },
];
