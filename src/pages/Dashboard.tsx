
import React from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || "User"}
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Your recently edited documents</CardDescription>
            </CardHeader>
            <CardContent>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 rounded-md border p-3 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Sample Document {i}</p>
                    <p className="text-xs text-muted-foreground">Edited {i} day{i !== 1 ? 's' : ''} ago</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full mt-2">
                View all documents
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Templates</CardTitle>
              <CardDescription>Manage your PDF templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center space-x-3 rounded-md border p-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">Template {i}</p>
                      <p className="text-xs text-muted-foreground">{3 * i} fields</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4" asChild>
                <Link to="/templates">View all templates</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center text-left space-y-1">
                  <Plus className="h-5 w-5 mb-1" />
                  <span className="text-xs">New Document</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center text-left space-y-1">
                  <FileText className="h-5 w-5 mb-1" />
                  <span className="text-xs">Upload Template</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center text-left space-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mb-1">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span className="text-xs">Generate PDF</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center text-left space-y-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mb-1">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span className="text-xs">Help Center</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
