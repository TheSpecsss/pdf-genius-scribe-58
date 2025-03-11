
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { FileText, Upload, Clock, History } from "lucide-react";
import { TemplateMetadata } from "@/lib/pdf";
import { Link } from "react-router-dom";
import { AnimatedTransition } from "@/components/common/AnimatedTransition";
import TemplateList from "@/components/templates/TemplateList";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [recentTemplates, setRecentTemplates] = useState<TemplateMetadata[]>([]);
  const [allTemplates, setAllTemplates] = useState<TemplateMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const user = getCurrentUser();
  
  useEffect(() => {
    // In a real implementation, this would fetch templates from the API
    const fetchTemplates = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockTemplates: TemplateMetadata[] = [
          {
            id: "template-1",
            name: "Employment Contract",
            createdAt: new Date(2023, 5, 15),
            createdBy: "admin-1",
            placeholders: ["full_name", "date_of_contract", "contract_amount", "company_name", "signature"],
            previewUrl: "https://placehold.co/400x600/e6f2ff/1a75ff?text=Employment+Contract",
          },
          {
            id: "template-2",
            name: "NDA Agreement",
            createdAt: new Date(2023, 7, 23),
            createdBy: "admin-1",
            placeholders: ["full_name", "date_of_contract", "company_name", "signature"],
            previewUrl: "https://placehold.co/400x600/e6f2ff/1a75ff?text=NDA+Agreement",
          },
          {
            id: "template-3",
            name: "Service Agreement",
            createdAt: new Date(2023, 9, 5),
            createdBy: "admin-1",
            placeholders: ["full_name", "date_of_contract", "contract_amount", "service_description", "signature"],
            previewUrl: "https://placehold.co/400x600/e6f2ff/1a75ff?text=Service+Agreement",
          },
          {
            id: "template-4",
            name: "Invoice Template",
            createdAt: new Date(2023, 10, 12),
            createdBy: "admin-1",
            placeholders: ["invoice_number", "date", "customer_name", "amount", "due_date", "description"],
            previewUrl: "https://placehold.co/400x600/e6f2ff/1a75ff?text=Invoice+Template",
          },
        ];
        
        setAllTemplates(mockTemplates);
        setRecentTemplates(mockTemplates.slice(0, 3));
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <AnimatedTransition className="flex-grow">
        <main className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Manage and use your PDF templates
              </p>
            </div>
            
            {user?.isAdmin && (
              <Button asChild>
                <Link to="/templates/create">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Template
                </Link>
              </Button>
            )}
          </div>
          
          <div className="grid gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Templates
              </h2>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="h-6 bg-muted rounded animate-pulse w-2/3" />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-[2/3] bg-muted rounded animate-pulse" />
                        <div className="flex gap-1">
                          <div className="h-5 bg-muted rounded animate-pulse w-16" />
                          <div className="h-5 bg-muted rounded animate-pulse w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : recentTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentTemplates.map((template) => (
                    <Card key={template.id} className="card-hover overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {template.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="relative aspect-[2/3] w-full mb-4 overflow-hidden rounded-md bg-muted">
                          <img
                            src={template.previewUrl}
                            alt={template.name}
                            className="object-cover w-full h-full transition-all hover:scale-105 duration-500"
                          />
                        </div>
                        <Button asChild className="w-full">
                          <Link to={`/templates/${template.id}`}>
                            Use Template
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <History className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No recent templates</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      You haven't used any templates recently. Browse all templates below.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                All Templates
              </h2>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                  <TabsTrigger value="recent">Recently Used</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  {isLoading ? (
                    <div className="space-y-4">
                      <div className="h-10 bg-muted rounded animate-pulse w-full max-w-md" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="h-6 bg-muted rounded animate-pulse w-2/3" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="aspect-[2/3] bg-muted rounded animate-pulse" />
                              <div className="flex gap-1">
                                <div className="h-5 bg-muted rounded animate-pulse w-16" />
                                <div className="h-5 bg-muted rounded animate-pulse w-16" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <TemplateList templates={allTemplates} />
                  )}
                </TabsContent>
                
                <TabsContent value="recent" className="mt-0">
                  {isLoading ? (
                    <div className="h-32 flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  ) : (
                    <TemplateList templates={recentTemplates} />
                  )}
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-0">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-muted-foreground"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">No favorite templates</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      You haven't added any templates to your favorites yet.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </main>
      </AnimatedTransition>
    </div>
  );
};

export default Dashboard;
