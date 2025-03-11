
import React from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormFieldProps {
  label: string;
}

const FormField = ({ label }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">{label}</div>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
          <Zap className="h-3.5 w-3.5 text-primary" />
          AI Fill
        </Button>
      </div>
      <div className="h-9 rounded-md bg-white/50 border border-gray-200 px-3 py-2 text-sm animate-pulse" />
    </div>
  );
};

export default FormField;
