'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetEmployeeByIdQuery } from '@/store/api/employeesApi';
import {
  useGetEmployeeCompensationQuery,
  useGetEmployeeDeductionsQuery,
} from '@/store/api/compensationApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Briefcase, MapPin, Building2, DollarSign } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Skeleton } from '@/components/ui/skeleton';

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: employee, isLoading, isError } = useGetEmployeeByIdQuery(id);
  const { data: compensationData } = useGetEmployeeCompensationQuery(Number(id));
  const { data: deductionsData } = useGetEmployeeDeductionsQuery(Number(id));

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Employee not found</h2>
        <p className="text-muted-foreground mt-2">
          The employee you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission
          to view them.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push('/hris/employees')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <PermissionGuard permission="hris.employee.view">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/hris/employees')}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {employee.employeeCode || 'No Employee Code'}
            </p>
          </div>
          <div className="ml-auto">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                employee.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {employee.status || 'ACTIVE'}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-lg font-semibold border-b pb-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </div>
            <dl className="space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Email</dt>
                <dd className="font-semibold">{employee.email || 'Not Provided'}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Phone</dt>
                <dd className="font-semibold">{employee.phone || 'Not Provided'}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Emergency Contact</dt>
                <dd className="font-semibold">{employee.emergencyContact || 'Not Provided'}</dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">System Account</dt>
                <dd className="font-semibold">{employee.userId ? 'Provisioned' : 'None'}</dd>
              </div>
            </dl>
          </div>

          {/* Organizational Employment */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-lg font-semibold border-b pb-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Employment Details
            </div>
            <dl className="space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Department
                </dt>
                <dd className="font-semibold">
                  {employee.department ? employee.department.name : 'Unassigned'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Designation
                </dt>
                <dd className="font-semibold">
                  {employee.designation ? employee.designation.name : 'Unassigned'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Branch
                </dt>
                <dd className="font-semibold">
                  {employee.branch ? employee.branch.name : 'Unassigned'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium flex items-center gap-2">
                  <User className="h-4 w-4" /> Reports To
                </dt>
                <dd className="font-semibold">
                  {employee.manager
                    ? `${employee.manager.firstName} ${employee.manager.lastName}`
                    : 'No Manager'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Hire Date</dt>
                <dd className="font-semibold">
                  {employee.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString()
                    : 'Not Provided'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Compensation Section */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-lg font-semibold border-b pb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Compensation & Deductions
            </div>
            <dl className="space-y-4 text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Base Salary</dt>
                <dd className="font-semibold">
                  {compensationData && compensationData.length > 0
                    ? `₱${compensationData[0]?.baseSalary?.toLocaleString() || 'N/A'}`
                    : 'Not Set'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Hourly Rate</dt>
                <dd className="font-semibold">
                  {compensationData && compensationData.length > 0
                    ? `₱${compensationData[0]?.hourlyRate?.toLocaleString() || 'N/A'}`
                    : 'Not Set'}
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <dt className="text-muted-foreground font-medium">Active Deductions</dt>
                <dd className="font-semibold">
                  {deductionsData ? deductionsData.filter((d) => d.isActive).length : 0}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
}
