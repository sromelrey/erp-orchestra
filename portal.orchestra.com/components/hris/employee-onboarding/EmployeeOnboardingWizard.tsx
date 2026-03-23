'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { StepProgress } from './StepProgress';
import { EmployeeSummarySidebar } from './EmployeeSummarySidebar';
import { StepPersonalInfo } from './steps/StepPersonalInfo';
import { StepJobDetails } from './steps/StepJobDetails';
import { StepWorkSchedule } from './steps/StepWorkSchedule';
import { StepCompensation } from './steps/StepCompensation';
import { StepDeductions } from './steps/StepDeductions';
import { StepReview } from './steps/StepReview';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCreateEmployeeMutation } from '@/store/api/employeesApi';
import {
  useCreateEmployeeCompensationMutation,
  useCreateEmployeeDeductionMutation,
  PaymentFrequency,
  DeductionType,
  DeductionFrequency,
} from '@/store/api/compensationApi';
import { useGetDepartmentsQuery } from '@/store/api/departmentsApi';
import { useGetDesignationsQuery } from '@/store/api/designationsApi';
import { useGetBranchesQuery } from '@/store/api/branchesApi';
import { Department, Designation, Branch } from '@/types';

export interface EmployeeOnboardingState {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    birthdate?: string;
    address?: string;
  };
  jobDetails: {
    employeeCode: string;
    departmentId?: string;
    designationId?: string;
    branchId?: string;
    hireDate: string;
    employmentType?: string;
    status: 'ACTIVE' | 'INACTIVE';
    managerId?: string;
  };
  workSchedule: {
    workDays: string[];
    startTime: string;
    endTime: string;
  };
  compensation: {
    basicSalary: number;
    allowances?: number;
    payFrequency: 'weekly' | 'bi-weekly' | 'semi-monthly' | 'monthly';
    effectiveDate: string;
  };
  deductions: {
    sss?: number;
    philHealth?: number;
    pagIbig?: number;
    tax?: number;
    loans?: number;
    other?: number;
  };
}

interface StepComponentProps {
  data: EmployeeOnboardingState;
  updateData: (updates: Partial<EmployeeOnboardingState>) => void;
  dropdownData: {
    departments: Department[];
    designations: Designation[];
    branches: Branch[];
  };
}

interface Step {
  id: string;
  label: string;
  component: React.ComponentType<StepComponentProps>;
  optional?: boolean;
}

const steps: Step[] = [
  { id: 'personal', label: 'Personal Info', component: StepPersonalInfo },
  { id: 'job', label: 'Job Details', component: StepJobDetails },
  { id: 'schedule', label: 'Work Schedule', component: StepWorkSchedule },
  { id: 'compensation', label: 'Compensation', component: StepCompensation },
  {
    id: 'deductions',
    label: 'Deductions',
    component: StepDeductions,
    optional: true,
  },
  { id: 'review', label: 'Review', component: StepReview },
];

export function EmployeeOnboardingWizard() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [onboardingData, setOnboardingData] = useState<EmployeeOnboardingState>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthdate: '',
      address: '',
    },
    jobDetails: {
      employeeCode: '',
      departmentId: '',
      designationId: '',
      branchId: '',
      hireDate: '',
      employmentType: '',
      status: 'ACTIVE',
      managerId: '',
    },
    workSchedule: {
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      startTime: '09:00',
      endTime: '17:00',
    },
    compensation: {
      basicSalary: 0,
      allowances: 0,
      payFrequency: 'monthly',
      effectiveDate: '',
    },
    deductions: {
      sss: 0,
      philHealth: 0,
      pagIbig: 0,
      tax: 0,
      loans: 0,
      other: 0,
    },
  });

  // Fetch dropdown data
  const { data: departmentsData } = useGetDepartmentsQuery({});
  const { data: designationsData } = useGetDesignationsQuery({});
  const { data: branchesData } = useGetBranchesQuery({});

  // API mutations
  const [createEmployee] = useCreateEmployeeMutation();
  const [createCompensation] = useCreateEmployeeCompensationMutation();
  const [createDeduction] = useCreateEmployeeDeductionMutation();

  const updateData = (updates: Partial<EmployeeOnboardingState>) => {
    setOnboardingData((prev) => ({ ...prev, ...updates }));
  };

  const validateCurrentStep = (): boolean => {
    const currentStep = steps[currentStepIndex];

    switch (currentStep.id) {
      case 'personal':
        return !!(
          onboardingData.personalInfo.firstName &&
          onboardingData.personalInfo.lastName &&
          onboardingData.personalInfo.email
        );
      case 'job':
        return !!onboardingData.jobDetails.hireDate;
      case 'schedule':
        return !!(
          onboardingData.workSchedule.workDays.length > 0 &&
          onboardingData.workSchedule.startTime &&
          onboardingData.workSchedule.endTime
        );
      case 'compensation':
        return !!(
          onboardingData.compensation.basicSalary > 0 && onboardingData.compensation.payFrequency
        );
      case 'deductions':
        return true; // Optional step
      case 'review':
        return true; // Review step doesn't need validation
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      toast.error('Please complete all required fields before continuing.');
      return;
    }

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleConfirm = async () => {
    if (!validateCurrentStep()) {
      toast.error('Please review and complete all required information.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create Employee
      const employeeData = {
        firstName: onboardingData.personalInfo.firstName,
        lastName: onboardingData.personalInfo.lastName,
        email: onboardingData.personalInfo.email,
        phone: onboardingData.personalInfo.phone,
        employeeCode: onboardingData.jobDetails.employeeCode,
        departmentId: onboardingData.jobDetails.departmentId
          ? Number(onboardingData.jobDetails.departmentId)
          : undefined,
        designationId: onboardingData.jobDetails.designationId
          ? Number(onboardingData.jobDetails.designationId)
          : undefined,
        branchId: onboardingData.jobDetails.branchId
          ? Number(onboardingData.jobDetails.branchId)
          : undefined,
        hireDate: new Date(onboardingData.jobDetails.hireDate).toISOString(),
        status: onboardingData.jobDetails.status,
        managerId: onboardingData.jobDetails.managerId
          ? Number(onboardingData.jobDetails.managerId)
          : undefined,
        createUserAccount: false,
      };

      const employeeResult = await createEmployee(employeeData).unwrap();
      toast.success('Employee created successfully!');

      const employeeId = employeeResult.id;

      // 2. Create Compensation
      try {
        const compensationData = {
          baseSalary: onboardingData.compensation.basicSalary,
          overtimeRate: 1.5, // Default
          currency: 'PHP',
          paymentFrequency:
            PaymentFrequency[
              onboardingData.compensation.payFrequency
                .toUpperCase()
                .replace('-', '_') as keyof typeof PaymentFrequency
            ],
          effectiveDate: onboardingData.compensation.effectiveDate,
          changeReason: 'Employee onboarding',
        };

        await createCompensation({
          employeeId,
          body: compensationData,
        }).unwrap();
        toast.success('Compensation setup completed!');
      } catch (compError) {
        toast.warning(
          'Employee created but compensation setup failed. You can configure it later.'
        );
        console.error('Compensation creation failed:', compError);
      }

      // 3. Create Deductions (only for non-zero values)
      const deductionsToCreate = [
        { name: 'SSS', amount: onboardingData.deductions.sss },
        { name: 'PhilHealth', amount: onboardingData.deductions.philHealth },
        { name: 'PagIBIG', amount: onboardingData.deductions.pagIbig },
        { name: 'Tax', amount: onboardingData.deductions.tax },
        { name: 'Loans', amount: onboardingData.deductions.loans },
        { name: 'Other', amount: onboardingData.deductions.other },
      ].filter((deduction) => deduction.amount && deduction.amount > 0);

      if (deductionsToCreate.length > 0) {
        try {
          await Promise.all(
            deductionsToCreate.map((deduction) =>
              createDeduction({
                employeeId,
                body: {
                  name: deduction.name,
                  type: DeductionType.FIXED,
                  amount: deduction.amount,
                  frequency: DeductionFrequency.MONTHLY,
                  effectiveDate: onboardingData.compensation.effectiveDate,
                  description: `${deduction.name} deduction`,
                },
              }).unwrap()
            )
          );
          toast.success('Deductions setup completed!');
        } catch (dedError) {
          toast.warning(
            'Employee created but deductions setup failed. You can configure it later.'
          );
          console.error('Deductions creation failed:', dedError);
        }
      }

      // Redirect to employee profile
      router.push(`/hris/employees/${employeeId}`);
    } catch (error) {
      console.error('Employee creation failed:', error);
      toast.error('Failed to create employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = steps[currentStepIndex];
  const CurrentStepComponent = currentStep.component;

  const dropdownData = {
    departments: departmentsData?.data || [],
    designations: designationsData?.data || [],
    branches: branchesData?.data || [],
  };

  return (
    <div className="grid grid-row-1 lg:grid-row-2 gap-8">
      {/* Main Content */}
      <StepProgress
        steps={steps}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
      />
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep.label}
                  {currentStep.optional && (
                    <span className="text-sm font-normal text-muted-foreground">(Optional)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CurrentStepComponent
                  data={onboardingData}
                  updateData={updateData}
                  dropdownData={dropdownData}
                />
              </CardContent>
            </Card>
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStepIndex === 0}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStepIndex < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={!validateCurrentStep()}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Confirm & Create Employee
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <EmployeeSummarySidebar data={onboardingData} />
          </div>
        </div>

        {/* Navigation */}
      </div>
    </div>
  );
}
