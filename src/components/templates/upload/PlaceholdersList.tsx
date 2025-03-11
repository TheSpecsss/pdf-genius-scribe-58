
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PlaceholdersListProps {
  placeholders: string[];
  title?: string;
  editable?: boolean;
  onRemove?: (placeholder: string) => void;
  maxHeight?: string;
  className?: string;
}

const PlaceholdersList: React.FC<PlaceholdersListProps> = ({
  placeholders,
  title = "Detected Placeholders",
  editable = false,
  onRemove,
  maxHeight = "max-h-32",
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (placeholders.length === 0) {
    return null;
  }
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label>{title}</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => setIsCollapsed(prev => !prev)}
        >
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      
      <div className={cn(
        "border rounded-md p-3 overflow-y-auto transition-all duration-300",
        maxHeight,
        isCollapsed ? "h-0 p-0 opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <ul className="space-y-1">
          {placeholders.map((placeholder, index) => (
            <li 
              key={index} 
              className={cn(
                "flex items-center justify-between text-sm animate-fade-in", 
                { "opacity-0": isCollapsed }
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="truncate">{placeholder}</span>
              </div>
              
              {editable && onRemove && (
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemove(placeholder)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaceholdersList;
