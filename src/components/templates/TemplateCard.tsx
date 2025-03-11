
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Trash2 } from "lucide-react";
import { TemplateMetadata } from "@/lib/pdf";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { deleteTemplate } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import EditTemplate from "./EditTemplate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TemplateCardProps {
  template: TemplateMetadata;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await deleteTemplate(template.id);
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      console.log("Template deleted successfully");
    } catch (error) {
      console.error("Error deleting template:", error);
      setError(`Failed to delete template: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDeleting(false);
    }
  };

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
        
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-2 text-xs mt-2">
            {error}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link to={`/templates/${template.id}`}>
            Use Template
          </Link>
        </Button>
        
        <EditTemplate template={template} />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Template</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this template? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
