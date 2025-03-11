
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PlaceholderFieldProps {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  aiSuggestion?: string;
  fontInfo?: React.CSSProperties;
  isLoading?: boolean;
}

const PlaceholderField: React.FC<PlaceholderFieldProps> = ({
  name,
  value,
  onChange,
  aiSuggestion,
  fontInfo,
  isLoading = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const displayName = name
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  
  const handleUseAISuggestion = () => {
    if (aiSuggestion) {
      onChange(name, aiSuggestion);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">
          {displayName}
        </Label>
        {aiSuggestion && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={handleUseAISuggestion}
                  disabled={isLoading}
                >
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Use AI Suggestion
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI suggests: {aiSuggestion}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="relative">
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={`transition-all duration-200 ${
            isFocused ? "ring-2 ring-primary/20 border-primary/30" : ""
          } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          style={isFocused || !fontInfo ? {} : fontInfo}
          placeholder={aiSuggestion || `Enter ${displayName.toLowerCase()}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
        />
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceholderField;
