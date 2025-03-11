
import React from "react";
import { motion } from "framer-motion";
import { Upload, Zap, Download } from "lucide-react";

const features = [
  {
    title: "Template Creation",
    description: "Upload PDFs and automatically detect placeholders for easy template creation.",
    icon: <Upload className="h-6 w-6 text-primary" />,
  },
  {
    title: "AI-Powered Filling",
    description: "Let AI analyze context and suggest appropriate values for your placeholders.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  {
    title: "PDF Generation",
    description: "Generate and download professionally filled PDFs with perfect font matching.",
    icon: <Download className="h-6 w-6 text-primary" />,
  },
];

const Features = () => {
  return (
    <section className="py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Streamline Your Document Workflow
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our AI-powered system makes creating and filling PDF templates effortless.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className="flex flex-col items-center space-y-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <div className="rounded-full bg-primary/10 p-4 mb-2">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
