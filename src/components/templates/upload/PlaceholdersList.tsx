
import React from "react";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface PlaceholdersListProps {
  placeholders: string[];
}

const PlaceholdersList: React.FC<PlaceholdersListProps> = ({ placeholders }) => {
  if (placeholders.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <Label>Detected Placeholders</Label>
      <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
        <ul className="space-y-1">
          {placeholders.map((placeholder, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              {placeholder}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaceholdersList;
