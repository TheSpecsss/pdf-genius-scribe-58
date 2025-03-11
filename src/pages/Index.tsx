
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Zap, Upload, Download, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <motion.h1 
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    AI-Powered <span className="text-primary">PDF Template</span> System
                  </motion.h1>
                  <motion.p 
                    className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    Create, manage, and fill PDF templates with AI assistance. 
                    Streamline your document workflows and save time.
                  </motion.p>
                </div>
                <motion.div 
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Button asChild size="lg" className="gap-2">
                    <Link to="/dashboard">
                      Get Started <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link to="/login">
                      Log In
                    </Link>
                  </Button>
                </motion.div>
              </div>
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
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">Full Name</div>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                              <Zap className="h-3.5 w-3.5 text-primary" />
                              AI Fill
                            </Button>
                          </div>
                          <div className="h-9 rounded-md bg-white/50 border border-gray-200 px-3 py-2 text-sm animate-pulse" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Date of Contract</div>
                          <div className="h-9 rounded-md bg-white/50 border border-gray-200 px-3 py-2 text-sm animate-pulse" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Contract Amount</div>
                          <div className="h-9 rounded-md bg-white/50 border border-gray-200 px-3 py-2 text-sm animate-pulse" />
                        </div>
                      </div>
                      
                      <Button className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        Generate PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
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
      </main>
      
      <footer className="border-t py-6 md:py-10">
        <div className="container flex flex-col gap-4 md:flex-row md:gap-8 px-4 md:px-6">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-semibold">PDF Genius</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
              © 2023 PDF Genius. All rights reserved.
            </p>
          </div>
          <div className="flex gap-8 md:ml-auto">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="grid gap-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="grid gap-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

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

export default Index;
