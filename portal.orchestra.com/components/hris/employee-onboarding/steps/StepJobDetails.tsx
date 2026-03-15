"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeOnboardingState } from "../EmployeeOnboardingWizard";
import { Department, Designation, Branch } from "@/types";

interface StepJobDetailsProps {
  data: EmployeeOnboardingState;
  updateData: (updates: Partial<EmployeeOnboardingState>) => void;
  dropdownData: {
    departments: Department[];
    designations: Designation[];
    branches: Branch[];
  };
}

export function StepJobDetails({
  data,
  updateData,
  dropdownData,
}: StepJobDetailsProps) {
  const handleChange =
    (field: keyof EmployeeOnboardingState["jobDetails"]) => (value: string) => {
      updateData({
        jobDetails: {
          ...data.jobDetails,
          [field]: value,
        },
      });
    };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="employeeCode">Employee Code</Label>
        <Input
          id="employeeCode"
          type="text"
          value={data.jobDetails.employeeCode}
          onChange={(e) => handleChange("employeeCode")(e.target.value)}
          placeholder="EMP-001 (Optional)"
        />
      </div>

      <div>
        <Label htmlFor="hireDate">Hire Date *</Label>
        <Input
          id="hireDate"
          type="date"
          value={data.jobDetails.hireDate}
          onChange={(e) => handleChange("hireDate")(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department</Label>
          <Select
            value={data.jobDetails.departmentId || ""}
            onValueChange={handleChange("departmentId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="designation">Designation</Label>
          <Select
            value={data.jobDetails.designationId || ""}
            onValueChange={handleChange("designationId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.designations.map((desig) => (
                <SelectItem key={desig.id} value={desig.id.toString()}>
                  {desig.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="branch">Branch</Label>
          <Select
            value={data.jobDetails.branchId || ""}
            onValueChange={handleChange("branchId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {dropdownData.branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={data.jobDetails.status}
            onValueChange={(value: "ACTIVE" | "INACTIVE") =>
              handleChange("status")(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="employmentType">Employment Type</Label>
        <Select
          value={data.jobDetails.employmentType || ""}
          onValueChange={handleChange("employmentType")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select employment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FULL_TIME">Full Time</SelectItem>
            <SelectItem value="PART_TIME">Part Time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="INTERN">Intern</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
