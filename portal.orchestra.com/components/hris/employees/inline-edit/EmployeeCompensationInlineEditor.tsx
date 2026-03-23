'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentFrequency } from '@/store/api/compensationApi';
import { CompensationInlineEditorProps } from './types';

export function EmployeeCompensationInlineEditor({
  employeeId,
  compensation,
  isEditing,
  onUpdate,
  error,
}: CompensationInlineEditorProps) {
  const handleFieldChange = (field: string, value: string | number | undefined) => {
    onUpdate({ [field]: value });
  };

  const paymentFrequencyOptions = [
    { value: PaymentFrequency.WEEKLY, label: 'Weekly' },
    { value: PaymentFrequency.BI_WEEKLY, label: 'Bi-Weekly' },
    { value: PaymentFrequency.SEMI_MONTHLY, label: 'Semi-Monthly' },
    { value: PaymentFrequency.MONTHLY, label: 'Monthly' },
  ];

  const employeeIdStr = employeeId.toString();

  return (
    <Card className="border-none shadow-sm bg-white/70">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">💰 Compensation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor={`base-salary-${employeeIdStr}`}>Base Salary</Label>
            <Input
              id={`base-salary-${employeeIdStr}`}
              type="number"
              value={compensation.baseSalary || ''}
              onChange={(e) =>
                handleFieldChange('baseSalary', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="0.00"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`hourly-rate-${employeeIdStr}`}>Hourly Rate</Label>
            <Input
              id={`hourly-rate-${employeeIdStr}`}
              type="number"
              value={compensation.hourlyRate || ''}
              onChange={(e) =>
                handleFieldChange('hourlyRate', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="0.00"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`overtime-rate-${employeeIdStr}`}>Overtime Rate</Label>
            <Input
              id={`overtime-rate-${employeeIdStr}`}
              type="number"
              value={compensation.overtimeRate || ''}
              onChange={(e) =>
                handleFieldChange(
                  'overtimeRate',
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="1.5"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`currency-${employeeIdStr}`}>Currency</Label>
            <Input
              id={`currency-${employeeIdStr}`}
              type="text"
              value={compensation.currency || 'PHP'}
              onChange={(e) => handleFieldChange('currency', e.target.value)}
              placeholder="PHP"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`payment-frequency-${employeeIdStr}`}>Payment Frequency</Label>
            <Select
              value={compensation.paymentFrequency || PaymentFrequency.MONTHLY}
              onValueChange={(value) => handleFieldChange('paymentFrequency', value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {paymentFrequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`effective-date-${employeeIdStr}`}>Effective Date</Label>
            <Input
              id={`effective-date-${employeeIdStr}`}
              type="date"
              value={compensation.effectiveDate || ''}
              onChange={(e) => handleFieldChange('effectiveDate', e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`end-date-${employeeIdStr}`}>End Date</Label>
            <Input
              id={`end-date-${employeeIdStr}`}
              type="date"
              value={compensation.endDate || ''}
              onChange={(e) => handleFieldChange('endDate', e.target.value || undefined)}
              placeholder="Leave empty for ongoing"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <Label htmlFor={`change-reason-${employeeIdStr}`}>Change Reason</Label>
            <Input
              id={`change-reason-${employeeIdStr}`}
              type="text"
              value={compensation.changeReason || ''}
              onChange={(e) => handleFieldChange('changeReason', e.target.value || undefined)}
              placeholder="Reason for change (optional)"
              disabled={!isEditing}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
