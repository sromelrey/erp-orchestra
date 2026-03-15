import {
  EmployeeCompensation,
  EmployeeDeduction,
  PaymentFrequency,
  DeductionType,
  DeductionFrequency,
} from "@/store/api/compensationApi";
import { Employee } from "@/types";

export interface DraftCompensation {
  id?: number;
  baseSalary?: number;
  hourlyRate?: number;
  overtimeRate?: number;
  currency?: string;
  paymentFrequency?: PaymentFrequency;
  effectiveDate?: string;
  endDate?: string;
  changeReason?: string;
}

export interface DraftDeduction {
  id?: number;
  name: string;
  type: DeductionType;
  amount?: number;
  percentage?: number;
  frequency: DeductionFrequency;
  effectiveDate?: string;
  endDate?: string;
  description?: string;
}

export interface EmployeeInlineEdits {
  compensation?: DraftCompensation;
  deductions?: DraftDeduction[];
}

export interface InlineEditsState {
  dirtyByEmployeeId: Record<number, EmployeeInlineEdits>;
  errorsByEmployeeId: Record<
    number,
    {
      compensation?: string;
      deductions?: string[];
    }
  >;
  savingByEmployeeId: Record<number, boolean>;
  originalDataByEmployeeId: Record<
    number,
    {
      compensation?: EmployeeCompensation;
      deductions?: EmployeeDeduction[];
    }
  >;
}

export interface UseInlineEditsReturn {
  state: InlineEditsState;
  updateEmployeeCompensation: (
    employeeId: number,
    updates: Partial<DraftCompensation>,
  ) => void;
  updateEmployeeDeduction: (
    employeeId: number,
    deductionIndex: number,
    updates: Partial<DraftDeduction>,
  ) => void;
  addEmployeeDeduction: (employeeId: number) => void;
  removeEmployeeDeduction: (employeeId: number, deductionIndex: number) => void;
  clearEmployeeEdits: (employeeId: number) => void;
  getEmployeeEdits: (employeeId: number) => EmployeeInlineEdits | undefined;
  isEmployeeDirty: (employeeId: number) => boolean;
  getDirtyEmployeeIds: () => number[];
  validateEmployeeEdits: (employeeId: number) => boolean;
  setEmployeeError: (
    employeeId: number,
    error: string,
    field?: "compensation" | "deductions",
    index?: number,
  ) => void;
  clearEmployeeErrors: (employeeId: number) => void;
  setEmployeeSaving: (employeeId: number, isSaving: boolean) => void;
  initializeEmployeeData: (
    employeeId: number,
    compensation?: EmployeeCompensation,
    deductions?: EmployeeDeduction[],
  ) => void;
}

export interface EmployeeInlineEditorProps {
  employee: Employee;
  isEditing: boolean;
  onToggleEdit: () => void;
  isDirty: boolean;
  hasErrors: boolean;
  isSaving: boolean;
}

export interface CompensationInlineEditorProps {
  employeeId: number;
  compensation: DraftCompensation;
  isEditing: boolean;
  onUpdate: (updates: Partial<DraftCompensation>) => void;
  error?: string;
}

export interface DeductionsInlineEditorProps {
  employeeId: number;
  deductions: DraftDeduction[];
  isEditing: boolean;
  onUpdate: (deductionIndex: number, updates: Partial<DraftDeduction>) => void;
  onAdd: () => void;
  onRemove: (deductionIndex: number) => void;
  errors?: string[];
}
