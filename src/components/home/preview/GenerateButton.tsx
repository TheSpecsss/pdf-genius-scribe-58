
import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const GenerateButton = () => {
  return (
    <Button className="w-full gap-2">
      <Download className="h-4 w-4" />
      Generate PDF
    </Button>
  );
};

export default GenerateButton;
