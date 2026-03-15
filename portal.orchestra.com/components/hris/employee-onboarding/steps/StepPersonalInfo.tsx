"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeOnboardingState } from "../EmployeeOnboardingWizard";
import { Department, Designation, Branch } from "@/types";

interface StepPersonalInfoProps {
  data: EmployeeOnboardingState;
  updateData: (updates: Partial<EmployeeOnboardingState>) => void;
  dropdownData: {
    departments: Department[];
    designations: Designation[];
    branches: Branch[];
  };
}

export function StepPersonalInfo({ data, updateData }: StepPersonalInfoProps) {
  const handleChange =
    (field: keyof EmployeeOnboardingState["personalInfo"]) =>
    (value: string) => {
      updateData({
        personalInfo: {
          ...data.personalInfo,
          [field]: value,
        },
      });
    };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            type="text"
            value={data.personalInfo.firstName}
            onChange={(e) => handleChange("firstName")(e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            type="text"
            value={data.personalInfo.lastName}
            onChange={(e) => handleChange("lastName")(e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={data.personalInfo.email}
          onChange={(e) => handleChange("email")(e.target.value)}
          placeholder="Enter email address"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={data.personalInfo.phone || ""}
            onChange={(e) => handleChange("phone")(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <Label htmlFor="birthdate">Birthdate</Label>
          <Input
            id="birthdate"
            type="date"
            value={data.personalInfo.birthdate || ""}
            onChange={(e) => handleChange("birthdate")(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={data.personalInfo.address || ""}
          onChange={(e) => handleChange("address")(e.target.value)}
          placeholder="Enter address"
          rows={3}
        />
      </div>
    </div>
  );
}
