
import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  isAnalyzing: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isAnalyzing }) => {
  if (!isAnalyzing) return null;
  
  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
      <span className="text-sm">Analyzing PDF...</span>
    </div>
  );
};

export default LoadingIndicator;
