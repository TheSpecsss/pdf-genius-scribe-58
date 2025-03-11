
import React from "react";
import { FileText } from "lucide-react";

const TemplateHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary/10 p-2">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
        PDF
      </div>
    </div>
  );
};

export default TemplateHeader;
