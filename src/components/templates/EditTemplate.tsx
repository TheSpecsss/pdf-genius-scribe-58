
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import EditDialogContent from "./edit/EditDialogContent";
import { TemplateMetadata } from "@/lib/pdf";

interface EditTemplateProps {
  template: TemplateMetadata;
}

const EditTemplate: React.FC<EditTemplateProps> = ({ template }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="flex-shrink-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <EditDialogContent template={template} setOpen={setOpen} />
    </Dialog>
  );
};

export default EditTemplate;
