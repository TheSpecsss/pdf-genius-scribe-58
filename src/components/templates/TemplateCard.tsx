
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { TemplateMetadata } from "@/lib/pdf";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface TemplateCardProps {
  template: TemplateMetadata;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <Card className="card-hover overflow-hidden transition-all duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {template.name}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{format(template.createdAt, "MMM d, yyyy")}</span>
        </div>
      </CardHeader>
      
      <CardContent className="py-4 flex-grow">
        <div className="relative aspect-[2/3] w-full mb-4 overflow-hidden rounded-md bg-muted">
          <img
            src={template.previewUrl}
            alt={template.name}
            className="object-cover w-full h-full transition-all hover:scale-105 duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {template.placeholders.slice(0, 3).map((placeholder) => (
            <Badge key={placeholder} variant="secondary" className="text-xs">
              {placeholder}
            </Badge>
          ))}
          {template.placeholders.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.placeholders.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild className="w-full">
          <Link to={`/templates/${template.id}`}>
            Use Template
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
