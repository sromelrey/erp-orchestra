"use client";

import { Badge } from "@/components/ui/badge";

interface StepProgressProps {
  steps: readonly { id: string; label: string; optional?: boolean }[];
  currentStepIndex: number;
  completedSteps: Set<number>;
}

export function StepProgress({ steps, currentStepIndex, completedSteps }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStepIndex;
          const isOptional = step.optional;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>

              {/* Step Label */}
              <div className="ml-2">
                <div className={`text-sm font-medium ${isCurrent ? "text-blue-600" : "text-gray-600"}`}>
                  {step.label}
                  {isOptional && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Optional
                    </Badge>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 ml-4 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
