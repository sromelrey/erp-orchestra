"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeeOnboardingState } from "./EmployeeOnboardingWizard";

interface EmployeeSummarySidebarProps {
  data: EmployeeOnboardingState;
}

export function EmployeeSummarySidebar({ data }: EmployeeSummarySidebarProps) {
  const { personalInfo, jobDetails, compensation, deductions } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const hasDeductions = Object.values(deductions).some(value => value && value > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Employee Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Personal Info */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">PERSONAL INFO</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Name:</span> {personalInfo.firstName} {personalInfo.lastName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {personalInfo.email || 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> {personalInfo.phone || 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Birthdate:</span> {personalInfo.birthdate ? formatDate(personalInfo.birthdate) : 'Not set'}
              </p>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">JOB DETAILS</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Employee Code:</span> {jobDetails.employeeCode || 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Hire Date:</span> {jobDetails.hireDate ? formatDate(jobDetails.hireDate) : 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>{' '}
                <Badge variant={jobDetails.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {jobDetails.status}
                </Badge>
              </p>
              <p className="text-sm">
                <span className="font-medium">Employment Type:</span> {jobDetails.employmentType || 'Not set'}
              </p>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">COMPENSATION</h4>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">Basic Salary:</span> {compensation.basicSalary ? formatCurrency(compensation.basicSalary) : 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Allowances:</span> {compensation.allowances ? formatCurrency(compensation.allowances) : 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Pay Frequency:</span> {compensation.payFrequency || 'Not set'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Effective Date:</span> {compensation.effectiveDate ? formatDate(compensation.effectiveDate) : 'Not set'}
              </p>
            </div>
          </div>

          {/* Deductions */}
          {hasDeductions && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">DEDUCTIONS</h4>
              <div className="space-y-1">
                {deductions.sss && deductions.sss > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">SSS:</span> {formatCurrency(deductions.sss)}
                  </p>
                )}
                {deductions.philHealth && deductions.philHealth > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">PhilHealth:</span> {formatCurrency(deductions.philHealth)}
                  </p>
                )}
                {deductions.pagIbig && deductions.pagIbig > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Pag-IBIG:</span> {formatCurrency(deductions.pagIbig)}
                  </p>
                )}
                {deductions.tax && deductions.tax > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Tax:</span> {formatCurrency(deductions.tax)}
                  </p>
                )}
                {deductions.loans && deductions.loans > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Loans:</span> {formatCurrency(deductions.loans)}
                  </p>
                )}
                {deductions.other && deductions.other > 0 && (
                  <p className="text-sm">
                    <span className="font-medium">Other:</span> {formatCurrency(deductions.other)}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
