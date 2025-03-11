
import React from "react";

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
      {error}
    </div>
  );
};

export default ErrorDisplay;
