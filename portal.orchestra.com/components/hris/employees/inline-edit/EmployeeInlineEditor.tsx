'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { Employee } from '@/types';
import { EmployeeCompensation, EmployeeDeduction } from '@/store/api/compensationApi';
import {
  EmployeeInlineEditorProps,
  DraftCompensation,
  DraftDeduction,
  EmployeeInlineEdits,
} from './types';
import { EmployeeCompensationInlineEditor } from './EmployeeCompensationInlineEditor';
import { EmployeeDeductionsInlineEditor } from './EmployeeDeductionsInlineEditor';

interface EmployeeInlineEditorPropsExtended extends EmployeeInlineEditorProps {
  compensation?: EmployeeCompensation | DraftCompensation;
  deductions?: EmployeeDeduction[] | DraftDeduction[];
  onCompensationUpdate: (updates: Partial<DraftCompensation>) => void;
  onDeductionUpdate: (index: number, updates: Partial<DraftDeduction>) => void;
  onDeductionAdd: () => void;
  onDeductionRemove: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
  errors?: {
    compensation?: string;
    deductions?: string[];
  };
  inlineEdits: {
    getEmployeeEdits: (employeeId: number) => EmployeeInlineEdits | undefined;
  };
}

export function EmployeeInlineEditor({
  employee,
  isEditing,
  onToggleEdit,
  isDirty,
  hasErrors,
  isSaving,
  compensation,
  deductions,
  onCompensationUpdate,
  onDeductionUpdate,
  onDeductionAdd,
  onDeductionRemove,
  onSave,
  onCancel,
  errors,
  inlineEdits,
}: EmployeeInlineEditorPropsExtended) {
  // Use derived state instead of separate local state to avoid cascading renders
  const edits = inlineEdits.getEmployeeEdits(employee.id);
  const localCompensation = edits?.compensation || compensation;
  const localDeductions = edits?.deductions || deductions || [];

  const handleCompensationUpdate = (updates: Partial<DraftCompensation>) => {
    onCompensationUpdate(updates);
  };

  const handleDeductionUpdate = (index: number, updates: Partial<DraftDeduction>) => {
    onDeductionUpdate(index, updates);
  };

  const handleDeductionAdd = () => {
    onDeductionAdd();
  };

  const handleDeductionRemove = (index: number) => {
    onDeductionRemove(index);
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return `₱${amount.toLocaleString()}`;
  };

  const calculateTotalDeductions = () => {
    return localDeductions
      .filter((d) => {
        // Handle missing isActive property safely
        const deduction = d as EmployeeDeduction;
        return deduction.isActive !== false;
      })
      .reduce((total, d) => {
        if (d.amount) return total + d.amount;
        if (d.percentage && localCompensation?.baseSalary) {
          return total + (localCompensation.baseSalary * d.percentage) / 100;
        }
        return total;
      }, 0);
  };

  const calculateNetPay = () => {
    if (!localCompensation?.baseSalary) return undefined;
    const gross = localCompensation.baseSalary;
    const deductions = calculateTotalDeductions();
    return gross - deductions;
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <Card className="border-none shadow-sm bg-white/70">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {employee.email} • {employee.department?.name || 'No Department'}
                </p>
              </div>

              {/* Status badges */}
              <div className="flex items-center gap-2">
                {isDirty && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Unsaved Changes
                  </Badge>
                )}
                {hasErrors && (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Errors
                  </Badge>
                )}
                {isSaving && (
                  <Badge variant="secondary">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Saving...
                  </Badge>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button onClick={onToggleEdit} size="sm" variant="outline" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={onCancel}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button
                    onClick={onSave}
                    size="sm"
                    className="gap-2"
                    disabled={isSaving || hasErrors}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick summary */}
          {!isEditing && localCompensation && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Base Salary</div>
                <div className="font-semibold">{formatCurrency(localCompensation.baseSalary)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Total Deductions</div>
                <div className="font-semibold">{formatCurrency(calculateTotalDeductions())}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Net Pay</div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(calculateNetPay())}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Pay Frequency</div>
                <div className="font-semibold capitalize">
                  {localCompensation.paymentFrequency || 'N/A'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compensation Editor */}
      {isEditing ? (
        <EmployeeCompensationInlineEditor
          employeeId={employee.id}
          compensation={localCompensation || {}}
          isEditing={isEditing}
          onUpdate={handleCompensationUpdate}
          error={errors?.compensation}
        />
      ) : localCompensation ? (
        <EmployeeCompensationInlineEditor
          employeeId={employee.id}
          compensation={localCompensation}
          isEditing={isEditing}
          onUpdate={() => {}}
        />
      ) : null}

      {/* Deductions Editor */}
      {isEditing ? (
        <EmployeeDeductionsInlineEditor
          employeeId={employee.id}
          deductions={localDeductions}
          isEditing={isEditing}
          onUpdate={handleDeductionUpdate}
          onAdd={handleDeductionAdd}
          onRemove={handleDeductionRemove}
          errors={errors?.deductions}
        />
      ) : (
        <EmployeeDeductionsInlineEditor
          employeeId={employee.id}
          deductions={localDeductions}
          isEditing={isEditing}
          onUpdate={() => {}}
          onAdd={() => {}}
          onRemove={() => {}}
        />
      )}
    </div>
  );
}
