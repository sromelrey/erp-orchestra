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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeductionType, DeductionFrequency } from '@/store/api/compensationApi';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { DeductionsInlineEditorProps } from './types';

export function EmployeeDeductionsInlineEditor({
  employeeId,
  deductions,
  isEditing,
  onUpdate,
  onAdd,
  onRemove,
  errors,
}: DeductionsInlineEditorProps) {
  const handleFieldChange = (
    deductionIndex: number,
    field: string,
    value: string | number | undefined
  ) => {
    onUpdate(deductionIndex, { [field]: value });
  };

  const deductionTypeOptions = [
    { value: DeductionType.FIXED, label: 'Fixed', variant: 'default' as const },
    {
      value: DeductionType.PERCENTAGE,
      label: 'Percentage',
      variant: 'secondary' as const,
    },
    {
      value: DeductionType.RECURRING,
      label: 'Recurring',
      variant: 'outline' as const,
    },
    {
      value: DeductionType.VARIABLE,
      label: 'Variable',
      variant: 'destructive' as const,
    },
  ];

  const deductionFrequencyOptions = [
    { value: DeductionFrequency.ONE_TIME, label: 'One-Time' },
    { value: DeductionFrequency.MONTHLY, label: 'Monthly' },
    { value: DeductionFrequency.QUARTERLY, label: 'Quarterly' },
    { value: DeductionFrequency.ANNUALLY, label: 'Annually' },
  ];

  const getTypeConfig = (type: DeductionType) => {
    return deductionTypeOptions.find((option) => option.value === type) || deductionTypeOptions[0];
  };

  return (
    <Card className="border-none shadow-sm bg-white/70">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            📋 Deductions
            {deductions.length > 0 && <Badge variant="outline">{deductions.length}</Badge>}
          </span>
          {isEditing && (
            <Button onClick={onAdd} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Deduction
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errors && errors.length > 0 && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span>Please fix the following errors:</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {deductions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {isEditing ? (
              <div>
                <p>No deductions configured</p>
                <p className="text-sm">Click &quot;Add Deduction&quot; to get started</p>
              </div>
            ) : (
              <p>No deductions configured</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {deductions.map((deduction, index) => (
              <div key={index} className="rounded-lg p-4 bg-gray-50 ring-1 ring-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={getTypeConfig(deduction.type).variant}>
                      {getTypeConfig(deduction.type).label}
                    </Badge>
                    {deduction.name && <span className="font-medium">{deduction.name}</span>}
                  </div>
                  {isEditing && (
                    <Button
                      onClick={() => onRemove(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`deduction-name-${employeeId}-${index}`}>Name</Label>
                    <Input
                      id={`deduction-name-${employeeId}-${index}`}
                      type="text"
                      value={deduction.name || ''}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      placeholder="e.g., SSS, PhilHealth"
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`deduction-type-${employeeId}-${index}`}>Type</Label>
                    <Select
                      value={deduction.type}
                      onValueChange={(value) => handleFieldChange(index, 'type', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {deductionTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`deduction-frequency-${employeeId}-${index}`}>Frequency</Label>
                    <Select
                      value={deduction.frequency}
                      onValueChange={(value) => handleFieldChange(index, 'frequency', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {deductionFrequencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {deduction.type === DeductionType.FIXED ||
                  deduction.type === DeductionType.RECURRING ? (
                    <div>
                      <Label htmlFor={`deduction-amount-${employeeId}-${index}`}>Amount</Label>
                      <Input
                        id={`deduction-amount-${employeeId}-${index}`}
                        type="number"
                        value={deduction.amount || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            'amount',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        placeholder="0.00"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  ) : null}

                  {deduction.type === DeductionType.PERCENTAGE ? (
                    <div>
                      <Label htmlFor={`deduction-percentage-${employeeId}-${index}`}>
                        Percentage (%)
                      </Label>
                      <Input
                        id={`deduction-percentage-${employeeId}-${index}`}
                        type="number"
                        value={deduction.percentage || ''}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            'percentage',
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        placeholder="0"
                        min="0"
                        max="100"
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  ) : null}

                  <div>
                    <Label htmlFor={`deduction-effective-date-${employeeId}-${index}`}>
                      Effective Date
                    </Label>
                    <Input
                      id={`deduction-effective-date-${employeeId}-${index}`}
                      type="date"
                      value={deduction.effectiveDate || ''}
                      onChange={(e) => handleFieldChange(index, 'effectiveDate', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`deduction-end-date-${employeeId}-${index}`}>End Date</Label>
                    <Input
                      id={`deduction-end-date-${employeeId}-${index}`}
                      type="date"
                      value={deduction.endDate || ''}
                      onChange={(e) =>
                        handleFieldChange(index, 'endDate', e.target.value || undefined)
                      }
                      placeholder="Leave empty for ongoing"
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <Label htmlFor={`deduction-description-${employeeId}-${index}`}>
                      Description
                    </Label>
                    <Input
                      id={`deduction-description-${employeeId}-${index}`}
                      type="text"
                      value={deduction.description || ''}
                      onChange={(e) =>
                        handleFieldChange(index, 'description', e.target.value || undefined)
                      }
                      placeholder="Optional description"
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
