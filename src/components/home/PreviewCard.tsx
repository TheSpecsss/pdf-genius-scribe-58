
import React from "react";
import { motion } from "framer-motion";
import { FileText, Zap, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const PreviewCard = () => {
  return (
    <motion.div 
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.7, 
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <div className="relative w-full h-full max-w-[500px] aspect-square">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-50" />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <div className="glass-panel p-8 rounded-2xl shadow-elevated w-full max-w-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Contract Template</h3>
              </div>
              <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                PDF
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <FormField label="Full Name" />
              <FormField label="Date of Contract" />
              <FormField label="Contract Amount" />
            </div>
            
            <Button className="w-full gap-2">
              <Download className="h-4 w-4" />
              Generate PDF
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewCard;
