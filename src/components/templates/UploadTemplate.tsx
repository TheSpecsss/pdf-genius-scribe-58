
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import UploadDialogContent from "./upload/UploadDialogContent";

const UploadTemplate: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload New Template
        </Button>
      </DialogTrigger>
      <UploadDialogContent setOpen={setOpen} />
    </Dialog>
  );
};

export default UploadTemplate;
