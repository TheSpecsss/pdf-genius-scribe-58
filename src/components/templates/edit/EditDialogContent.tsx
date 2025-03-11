import React, { useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from "lucide-react";
import { updateTemplate } from "@/lib/supabase/templates";
import { useQueryClient } from "@tanstack/react-query";
import PlaceholdersList from "../upload/PlaceholdersList";
import { TemplateMetadata } from "@/lib/pdf";

interface EditDialogContentProps {
  template: TemplateMetadata;
  setOpen: (open: boolean) => void;
}

const EditDialogContent: React.FC<EditDialogContentProps> = ({ template, setOpen }) => {
  const queryClient = useQueryClient();
  const [templateName, setTemplateName] = useState(template.name);
  const [isUpdating, setIsUpdating] = useState(false);
  const [placeholders, setPlaceholders] = useState<string[]>(template.placeholders);
  const [error, setError] = useState<string | null>(null);
  const [newPlaceholder, setNewPlaceholder] = useState("");
  
  const handleUpdate = async () => {
    setError(null);
    
    if (!templateName.trim()) {
      setError("Please provide a template name");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const result = await updateTemplate(template.id, {
        name: templateName,
        placeholders,
      });
      
      if (result) {
        console.log("Template updated successfully");
        queryClient.invalidateQueries({ queryKey: ['templates'] });
        setOpen(false);
      }
    } catch (error) {
      console.error("Error updating template:", error);
      setError(`Failed to update template: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddPlaceholder = () => {
    if (newPlaceholder.trim() && !placeholders.includes(newPlaceholder.trim())) {
      setPlaceholders([...placeholders, newPlaceholder.trim()]);
      setNewPlaceholder("");
    }
  };
  
  const handleRemovePlaceholder = (placeholder: string) => {
    setPlaceholders(placeholders.filter(p => p !== placeholder));
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Template</DialogTitle>
        <DialogDescription>
          Update the template name and placeholders.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        {error && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="templateName">Template Name</Label>
          <Input
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
            disabled={isUpdating}
          />
        </div>
        
        <PlaceholdersList 
          placeholders={placeholders} 
          title="Template Placeholders"
          editable={true}
          onRemove={handleRemovePlaceholder}
          maxHeight="max-h-40"
        />
        
        <div className="space-y-2">
          <Label>Add New Placeholder</Label>
          <div className="flex gap-2">
            <Input
              value={newPlaceholder}
              onChange={(e) => setNewPlaceholder(e.target.value)}
              placeholder="Add new placeholder"
              disabled={isUpdating}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPlaceholder()}
            />
            <Button 
              type="button" 
              onClick={handleAddPlaceholder}
              disabled={isUpdating || !newPlaceholder.trim()}
              size="sm"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <DialogFooter className="sm:justify-between">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="gap-2"
        >
          {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
          {isUpdating ? "Updating..." : "Update Template"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default EditDialogContent;
