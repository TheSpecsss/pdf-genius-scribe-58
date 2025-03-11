
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { TemplateMetadata } from "@/lib/pdf";
import TemplateCard from "./TemplateCard";
import { Search } from "lucide-react";

interface TemplateListProps {
  templates: TemplateMetadata[];
}

const TemplateList: React.FC<TemplateListProps> = ({ templates }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 glass-input"
        />
      </div>
      
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <FileSearch className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            We couldn't find any templates matching your search. Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};

// Add missing icon definition
const FileSearch: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <circle cx="11.5" cy="14.5" r="2.5" />
    <path d="M13.25 16.25L15 18" />
  </svg>
);

export default TemplateList;
