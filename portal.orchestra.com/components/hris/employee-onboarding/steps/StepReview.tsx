"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeeOnboardingState } from "../EmployeeOnboardingWizard";

interface StepReviewProps {
  data: EmployeeOnboardingState;
}

export function StepReview({ data }: StepReviewProps) {
  const { personalInfo, jobDetails, compensation, deductions } = data;

  const totalDeductions = Object.values(deductions).reduce(
    (sum, amount) => sum + (amount || 0),
    0,
  );

  const netSalary =
    (compensation.basicSalary || 0) +
    (compensation.allowances || 0) -
    totalDeductions;

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-700">
          <strong>Review Complete:</strong> Please confirm all information
          before creating the employee record.
        </p>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Full Name:
              </span>
              <p className="text-sm">
                {personalInfo.firstName} {personalInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-sm">{personalInfo.email}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Phone:</span>
              <p className="text-sm">{personalInfo.phone || "Not provided"}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Birthdate:
              </span>
              <p className="text-sm">
                {personalInfo.birthdate
                  ? new Date(personalInfo.birthdate).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
          </div>
          {personalInfo.address && (
            <div>
              <span className="text-sm font-medium text-gray-500">
                Address:
              </span>
              <p className="text-sm">{personalInfo.address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Employee Code:
              </span>
              <p className="text-sm">{jobDetails.employeeCode}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <Badge
                variant={
                  jobDetails.status === "ACTIVE" ? "default" : "secondary"
                }
              >
                {jobDetails.status}
              </Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Hire Date:
              </span>
              <p className="text-sm">
                {new Date(jobDetails.hireDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Employment Type:
              </span>
              <p className="text-sm">
                {jobDetails.employmentType?.replace("_", " ") ||
                  "Not specified"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Department:
              </span>
              <p className="text-sm">
                {jobDetails.departmentId
                  ? `ID: ${jobDetails.departmentId}`
                  : "Not assigned"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Designation:
              </span>
              <p className="text-sm">
                {jobDetails.designationId
                  ? `ID: ${jobDetails.designationId}`
                  : "Not assigned"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Branch:</span>
              <p className="text-sm">
                {jobDetails.branchId
                  ? `ID: ${jobDetails.branchId}`
                  : "Not assigned"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compensation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Compensation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Basic Salary:
              </span>
              <p className="text-sm font-semibold text-green-600">
                ₱{(compensation.basicSalary || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Allowances:
              </span>
              <p className="text-sm">
                ₱{(compensation.allowances || 0).toLocaleString()} (display
                only)
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Pay Frequency:
              </span>
              <p className="text-sm capitalize">
                {compensation.payFrequency?.replace("-", " ") ||
                  "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Effective Date:
              </span>
              <p className="text-sm">
                {compensation.effectiveDate
                  ? new Date(compensation.effectiveDate).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {totalDeductions === 0 ? (
            <p className="text-sm text-gray-600">No deductions configured</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(deductions).map(([key, amount]) => {
                if (!amount || amount === 0) return null;
                const label =
                  key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, " $1");
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm text-gray-600">{label}:</span>
                    <span className="text-sm font-medium">
                      ₱{amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-4">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-900">
                    Total Monthly Deductions:
                  </span>
                  <span className="text-gray-900">
                    ₱{totalDeductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">Final Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-blue-700">
                Monthly Gross:
              </span>
              <p className="text-lg font-bold text-blue-900">
                ₱
                {(
                  (compensation.basicSalary || 0) +
                  (compensation.allowances || 0)
                ).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">
                Monthly Deductions:
              </span>
              <p className="text-lg font-bold text-red-600">
                ₱{totalDeductions.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">
                Monthly Net:
              </span>
              <p className="text-lg font-bold text-green-600">
                ₱{netSalary.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-4">
            <strong>What happens next:</strong> Clicking &rdquo;Confirm & Create
            Employee&rdquo; will create the employee record and associated
            compensation/deductions, then redirect to the employee&rdquo;s
            profile page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
