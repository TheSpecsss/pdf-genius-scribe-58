
import React from "react";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center w-full mt-4 mb-2">
      {steps.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                currentStep > step.id 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : currentStep === step.id 
                    ? "border-primary text-primary" 
                    : "border-muted-foreground text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <CircleCheck className="h-4 w-4" />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <span 
              className={cn(
                "text-xs mt-1", 
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.name}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div 
              className={cn(
                "h-[2px] flex-1 mx-1",
                currentStep > i + 1 ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
