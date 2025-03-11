
import React from "react";
import { motion } from "framer-motion";
import GradientBackground from "./preview/GradientBackground";
import TemplatePanel from "./preview/TemplatePanel";

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
        <GradientBackground />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <TemplatePanel />
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewCard;
