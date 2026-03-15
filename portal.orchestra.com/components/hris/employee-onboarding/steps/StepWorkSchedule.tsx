"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

interface WorkScheduleData {
  workDays: string[];
  startTime: string;
  endTime: string;
}

interface EmployeeOnboardingData {
  workSchedule?: WorkScheduleData;
}

interface DropdownData {
  departments: { id: number; name: string }[];
  designations: { id: number; name: string }[];
  branches: { id: number; name: string }[];
}

interface StepWorkScheduleProps {
  data: EmployeeOnboardingData;
  updateData: (updates: Partial<EmployeeOnboardingData>) => void;
  dropdownData: DropdownData;
}

const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const timeOptions = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
];

export function StepWorkSchedule({ data, updateData }: StepWorkScheduleProps) {
  const [workDays, setWorkDays] = useState<string[]>(
    data.workSchedule?.workDays || [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ],
  );
  const [startTime, setStartTime] = useState(
    data.workSchedule?.startTime || "09:00",
  );
  const [endTime, setEndTime] = useState(data.workSchedule?.endTime || "17:00");

  const handleDayToggle = (dayId: string, checked: boolean) => {
    const newWorkDays = checked
      ? [...workDays, dayId]
      : workDays.filter((d) => d !== dayId);

    setWorkDays(newWorkDays);
    updateData({
      workSchedule: {
        workDays: newWorkDays,
        startTime,
        endTime,
      },
    });
  };

  type TimeField = "startTime" | "endTime";

  const handleTimeChange = (field: TimeField, value: string) => {
    if (field === "startTime") {
      setStartTime(value);
    } else {
      setEndTime(value);
    }

    updateData({
      workSchedule: {
        workDays,
        startTime: field === "startTime" ? value : startTime,
        endTime: field === "endTime" ? value : endTime,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Configure the employee's work schedule and hours.
      </div>

      {/* Work Days Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Work Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox
                  id={day.id}
                  checked={workDays.includes(day.id)}
                  onCheckedChange={(checked) =>
                    handleDayToggle(day.id, checked as boolean)
                  }
                />
                <Label htmlFor={day.id} className="text-sm font-medium">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Working Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <select
                id="start-time"
                value={startTime}
                onChange={(e) => handleTimeChange("startTime", e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <select
                id="end-time"
                value={endTime}
                onChange={(e) => handleTimeChange("endTime", e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {workDays.length > 0 && (
            <div className="mt-4 p-4 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Schedule Summary:</strong> {workDays.length} day(s) per
                week, from {startTime} to {endTime}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
