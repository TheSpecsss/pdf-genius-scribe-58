
import React from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const Footer = () => {
  return (
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
  );
};

export default Footer;
