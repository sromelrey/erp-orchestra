'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EmployeeOnboardingWizard } from '@/components/hris/employee-onboarding/EmployeeOnboardingWizard';

export default function EmployeeOnboardingPage() {
  return (
    <PermissionGuard permission="hris.employee.manage">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Employee Onboarding</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Guide HR through the complete employee setup process
          </p>
        </div>
        <EmployeeOnboardingWizard />
      </div>
    </PermissionGuard>
  );
}
