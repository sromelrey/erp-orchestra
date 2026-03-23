import { useState, useCallback } from 'react';
import {
  EmployeeCompensation,
  EmployeeDeduction,
  DeductionType,
  DeductionFrequency,
} from '@/store/api/compensationApi';
import { InlineEditsState, UseInlineEditsReturn, DraftCompensation, DraftDeduction } from './types';

const initialState: InlineEditsState = {
  dirtyByEmployeeId: {},
  errorsByEmployeeId: {},
  savingByEmployeeId: {},
  originalDataByEmployeeId: {},
};

export function useInlineEdits(): UseInlineEditsReturn {
  const [state, setState] = useState<InlineEditsState>(initialState);

  const updateEmployeeCompensation = useCallback(
    (employeeId: number, updates: Partial<DraftCompensation>) => {
      setState((prev) => {
        const currentEdits = prev.dirtyByEmployeeId[employeeId] || {};
        const updatedEdits = {
          ...currentEdits,
          compensation: {
            ...currentEdits.compensation,
            ...updates,
          },
        };

        return {
          ...prev,
          dirtyByEmployeeId: {
            ...prev.dirtyByEmployeeId,
            [employeeId]: updatedEdits,
          },
        };
      });
    },
    []
  );

  const updateEmployeeDeduction = useCallback(
    (employeeId: number, deductionIndex: number, updates: Partial<DraftDeduction>) => {
      setState((prev) => {
        const currentEdits = prev.dirtyByEmployeeId[employeeId] || {};
        const currentDeductions = currentEdits.deductions || [];

        const updatedDeductions = [...currentDeductions];
        if (updatedDeductions[deductionIndex]) {
          updatedDeductions[deductionIndex] = {
            ...updatedDeductions[deductionIndex],
            ...updates,
          };
        }

        return {
          ...prev,
          dirtyByEmployeeId: {
            ...prev.dirtyByEmployeeId,
            [employeeId]: {
              ...currentEdits,
              deductions: updatedDeductions,
            },
          },
        };
      });
    },
    []
  );

  const addEmployeeDeduction = useCallback((employeeId: number) => {
    setState((prev) => {
      const currentEdits = prev.dirtyByEmployeeId[employeeId] || {};
      const currentDeductions = currentEdits.deductions || [];

      const newDeduction: DraftDeduction = {
        name: '',
        type: DeductionType.FIXED,
        amount: 0,
        frequency: DeductionFrequency.MONTHLY,
        effectiveDate: new Date().toISOString().split('T')[0],
      };

      return {
        ...prev,
        dirtyByEmployeeId: {
          ...prev.dirtyByEmployeeId,
          [employeeId]: {
            ...currentEdits,
            deductions: [...currentDeductions, newDeduction],
          },
        },
      };
    });
  }, []);

  const removeEmployeeDeduction = useCallback((employeeId: number, deductionIndex: number) => {
    setState((prev) => {
      const currentEdits = prev.dirtyByEmployeeId[employeeId] || {};
      const currentDeductions = currentEdits.deductions || [];

      const updatedDeductions = currentDeductions.filter((_, index) => index !== deductionIndex);

      return {
        ...prev,
        dirtyByEmployeeId: {
          ...prev.dirtyByEmployeeId,
          [employeeId]: {
            ...currentEdits,
            deductions: updatedDeductions,
          },
        },
      };
    });
  }, []);

  const clearEmployeeEdits = useCallback((employeeId: number) => {
    setState((prev) => {
      const newDirtyByEmployeeId = { ...prev.dirtyByEmployeeId };
      delete newDirtyByEmployeeId[employeeId];

      const newErrorsByEmployeeId = { ...prev.errorsByEmployeeId };
      delete newErrorsByEmployeeId[employeeId];

      return {
        ...prev,
        dirtyByEmployeeId: newDirtyByEmployeeId,
        errorsByEmployeeId: newErrorsByEmployeeId,
      };
    });
  }, []);

  const getEmployeeEdits = useCallback(
    (employeeId: number) => {
      return state.dirtyByEmployeeId[employeeId];
    },
    [state.dirtyByEmployeeId]
  );

  const isEmployeeDirty = useCallback(
    (employeeId: number) => {
      return !!state.dirtyByEmployeeId[employeeId];
    },
    [state.dirtyByEmployeeId]
  );

  const getDirtyEmployeeIds = useCallback(() => {
    return Object.keys(state.dirtyByEmployeeId).map(Number);
  }, [state.dirtyByEmployeeId]);

  const validateEmployeeEdits = useCallback(
    (employeeId: number) => {
      const edits = state.dirtyByEmployeeId[employeeId];
      if (!edits) return true;

      const errors: { compensation?: string; deductions?: string[] } = {};

      // Validate compensation
      if (edits.compensation) {
        const comp = edits.compensation;
        if (!comp.effectiveDate) {
          errors.compensation = 'Effective date is required';
        }
        if (comp.baseSalary !== undefined && comp.baseSalary < 0) {
          errors.compensation = 'Base salary cannot be negative';
        }
        if (comp.hourlyRate !== undefined && comp.hourlyRate < 0) {
          errors.compensation = 'Hourly rate cannot be negative';
        }
      }

      // Validate deductions
      if (edits.deductions) {
        const deductionErrors: string[] = [];
        edits.deductions.forEach((deduction, index) => {
          if (!deduction.name) {
            deductionErrors.push(`Deduction ${index + 1}: Name is required`);
          }
          if (deduction.amount !== undefined && deduction.amount < 0) {
            deductionErrors.push(`Deduction ${index + 1}: Amount cannot be negative`);
          }
          if (
            deduction.percentage !== undefined &&
            (deduction.percentage < 0 || deduction.percentage > 100)
          ) {
            deductionErrors.push(`Deduction ${index + 1}: Percentage must be between 0 and 100`);
          }
          if (!deduction.effectiveDate) {
            deductionErrors.push(`Deduction ${index + 1}: Effective date is required`);
          }
        });
        if (deductionErrors.length > 0) {
          errors.deductions = deductionErrors;
        }
      }

      setState((prev) => ({
        ...prev,
        errorsByEmployeeId: {
          ...prev.errorsByEmployeeId,
          [employeeId]: errors,
        },
      }));

      return Object.keys(errors).length === 0;
    },
    [state.dirtyByEmployeeId]
  );

  const setEmployeeError = useCallback(
    (employeeId: number, error: string, field?: 'compensation' | 'deductions', index?: number) => {
      setState((prev) => {
        const currentErrors = prev.errorsByEmployeeId[employeeId] || {};

        if (field === 'deductions' && index !== undefined) {
          const deductionErrors = currentErrors.deductions || [];
          const newDeductionErrors = [...deductionErrors];
          newDeductionErrors[index] = error;

          return {
            ...prev,
            errorsByEmployeeId: {
              ...prev.errorsByEmployeeId,
              [employeeId]: {
                ...currentErrors,
                deductions: newDeductionErrors,
              },
            },
          };
        } else if (field) {
          return {
            ...prev,
            errorsByEmployeeId: {
              ...prev.errorsByEmployeeId,
              [employeeId]: {
                ...currentErrors,
                [field]: error,
              },
            },
          };
        }

        return prev;
      });
    },
    []
  );

  const clearEmployeeErrors = useCallback((employeeId: number) => {
    setState((prev) => {
      const newErrorsByEmployeeId = { ...prev.errorsByEmployeeId };
      delete newErrorsByEmployeeId[employeeId];

      return {
        ...prev,
        errorsByEmployeeId: newErrorsByEmployeeId,
      };
    });
  }, []);

  const setEmployeeSaving = useCallback((employeeId: number, isSaving: boolean) => {
    setState((prev) => ({
      ...prev,
      savingByEmployeeId: {
        ...prev.savingByEmployeeId,
        [employeeId]: isSaving,
      },
    }));
  }, []);

  const initializeEmployeeData = useCallback(
    (employeeId: number, compensation?: EmployeeCompensation, deductions?: EmployeeDeduction[]) => {
      setState((prev) => ({
        ...prev,
        originalDataByEmployeeId: {
          ...prev.originalDataByEmployeeId,
          [employeeId]: {
            compensation,
            deductions,
          },
        },
      }));
    },
    []
  );

  return {
    state,
    updateEmployeeCompensation,
    updateEmployeeDeduction,
    addEmployeeDeduction,
    removeEmployeeDeduction,
    clearEmployeeEdits,
    getEmployeeEdits,
    isEmployeeDirty,
    getDirtyEmployeeIds,
    validateEmployeeEdits,
    setEmployeeError,
    clearEmployeeErrors,
    setEmployeeSaving,
    initializeEmployeeData,
  };
}
