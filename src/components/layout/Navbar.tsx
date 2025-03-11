
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileText, LogOut, Settings, User, Users } from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-semibold">PDF Genius</span>
          </Link>
        </div>
        
        <nav className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-1">
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/templates" 
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive("/templates") ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  Templates
                </Link>
                
                {user.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive("/admin") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <span className="text-xs text-primary-foreground font-medium">
                        {user.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <span className="text-xs text-primary-foreground font-medium">
                        {user.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
