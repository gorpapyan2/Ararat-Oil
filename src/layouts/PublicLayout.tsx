import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Public Header */}
        <header className="bg-primary py-4 border-b border-primary/20">
          <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-xl font-bold text-primary-foreground">Ararat OIL</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">
                  Features
                </a>
                <a href="#services" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">
                  Services
                </a>
                <a href="#app" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">
                  App
                </a>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">
                  About
                </a>
                <a href="#news" className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium">
                  News
                </a>
              </nav>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </Button>
                )}
                
                <Button 
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
        
        <Toaster />
      </div>
    </ThemeProvider>
  );
};
