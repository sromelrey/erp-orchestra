"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeOnboardingState } from "../EmployeeOnboardingWizard";

interface StepCompensationProps {
  data: EmployeeOnboardingState;
  updateData: (updates: Partial<EmployeeOnboardingState>) => void;
}

export function StepCompensation({ data, updateData }: StepCompensationProps) {
  const handleChange =
    (field: keyof EmployeeOnboardingState["compensation"]) =>
    (value: string | number) => {
      updateData({
        compensation: {
          ...data.compensation,
          [field]:
            field === "basicSalary" || field === "allowances"
              ? Number(value)
              : value,
        },
      });
    };

  const handleInputChange =
    (field: keyof EmployeeOnboardingState["compensation"]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      handleChange(field)(value);
    };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="basicSalary">Basic Salary * (₱)</Label>
        <Input
          id="basicSalary"
          type="number"
          value={data.compensation.basicSalary || ""}
          onChange={handleInputChange("basicSalary")}
          placeholder="Enter basic salary in pesos"
          min="0"
          step="0.01"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          Monthly basic salary amount
        </p>
      </div>

      <div>
        <Label htmlFor="allowances">Allowances (₱)</Label>
        <Input
          id="allowances"
          type="number"
          value={data.compensation.allowances || ""}
          onChange={handleInputChange("allowances")}
          placeholder="Enter total allowances"
          min="0"
          step="0.01"
        />
        <p className="text-sm text-gray-500 mt-1">
          Total monthly allowances (display only, not saved)
        </p>
      </div>

      <div>
        <Label htmlFor="payFrequency">Payment Frequency</Label>
        <Select
          value={data.compensation.payFrequency}
          onValueChange={(
            value: EmployeeOnboardingState["compensation"]["payFrequency"],
          ) => handleChange("payFrequency")(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
            <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="effectiveDate">Effective Date *</Label>
        <Input
          id="effectiveDate"
          type="date"
          value={data.compensation.effectiveDate}
          onChange={handleInputChange("effectiveDate")}
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          When this compensation becomes effective
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Gross Monthly Salary</h4>
        <p className="text-lg font-bold text-blue-900">
          ₱
          {(
            (data.compensation.basicSalary || 0) +
            (data.compensation.allowances || 0)
          ).toLocaleString()}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Basic: ₱{(data.compensation.basicSalary || 0).toLocaleString()} +
          Allowances: ₱{(data.compensation.allowances || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
