'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeOnboardingState } from '../EmployeeOnboardingWizard';

interface StepDeductionsProps {
  data: EmployeeOnboardingState;
  updateData: (updates: Partial<EmployeeOnboardingState>) => void;
}

export function StepDeductions({ data, updateData }: StepDeductionsProps) {
  const handleChange =
    (field: keyof EmployeeOnboardingState['deductions']) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateData({
        deductions: {
          ...data.deductions,
          [field]: Number(e.target.value) || 0,
        },
      });
    };

  const totalDeductions = (Object.values(data.deductions) as (number | undefined)[]).reduce(
    (sum: number, amount: number | undefined) => sum + (amount || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg">
        <p className="text-sm text-amber-700">
          <strong>Optional Step:</strong> Configure monthly deductions. You can skip this step if no
          deductions apply.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sss">SSS (₱)</Label>
          <Input
            id="sss"
            type="number"
            value={data.deductions.sss || ''}
            onChange={handleChange('sss')}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="philHealth">PhilHealth (₱)</Label>
          <Input
            id="philHealth"
            type="number"
            value={data.deductions.philHealth || ''}
            onChange={handleChange('philHealth')}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="pagIbig">Pag-IBIG (₱)</Label>
          <Input
            id="pagIbig"
            type="number"
            value={data.deductions.pagIbig || ''}
            onChange={handleChange('pagIbig')}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="tax">Tax (₱)</Label>
          <Input
            id="tax"
            type="number"
            value={data.deductions.tax || ''}
            onChange={handleChange('tax')}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="loans">Loans (₱)</Label>
          <Input
            id="loans"
            type="number"
            value={data.deductions.loans || ''}
            onChange={handleChange('loans')}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="other">Other Deductions (₱)</Label>
          <Input
            id="other"
            type="number"
            value={data.deductions.other || ''}
            onChange={handleChange('other')}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {totalDeductions > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-medium text-red-900 mb-2">Total Monthly Deductions</h4>
          <p className="text-lg font-bold text-red-600">₱{totalDeductions.toLocaleString()}</p>
          <p className="text-sm text-red-700 mt-1">
            This amount will be deducted from the employee&rsquo;s salary each month.
          </p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> You can leave all fields empty and return to this step later from
          the employee&rsquo;s compensation page.
        </p>
      </div>
    </div>
  );
}
