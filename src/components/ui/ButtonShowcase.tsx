import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ButtonShowcase() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Button Variants</CardTitle>
          <ThemeSwitcher variant="accent" />
        </div>
        <CardDescription>
          Available button styles with enhanced accessibility and theme support
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2">
            <Button variant="default">Default</Button>
            <span className="text-xs text-muted-foreground">Primary action</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button variant="secondary">Secondary</Button>
            <span className="text-xs text-muted-foreground">Secondary action</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button variant="accent">Accent</Button>
            <span className="text-xs text-muted-foreground">Accent action</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button variant="outline">Outline</Button>
            <span className="text-xs text-muted-foreground">Subtle action</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button variant="ghost">Ghost</Button>
            <span className="text-xs text-muted-foreground">Minimal emphasis</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button variant="destructive">Destructive</Button>
            <span className="text-xs text-muted-foreground">Destructive action</span>
          </div>
        </div>
        
        <div className="mt-8 p-6 rounded-lg bg-muted">
          <h3 className="text-lg font-medium mb-4">Theme Support</h3>
          <p className="text-sm mb-4">
            All button variants are designed to maintain appropriate contrast in both light and dark modes, 
            with the new accent variant providing a balanced alternative for secondary actions.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 