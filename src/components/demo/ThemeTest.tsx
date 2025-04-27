import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Button } from "@/components/ui/button";

export function ThemeTest() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Theme Test Page</h1>
        <ThemeSwitcher variant="accent" />
      </div>

      <p className="text-muted-foreground">
        This page demonstrates theming with proper contrast in both dark and
        light modes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-md p-4 bg-background">
                <p className="font-medium mb-2">Background</p>
                <p className="text-sm text-muted-foreground">--background</p>
              </div>
              <div className="border rounded-md p-4 bg-card">
                <p className="font-medium mb-2">Card</p>
                <p className="text-sm text-muted-foreground">--card</p>
              </div>
              <div className="border rounded-md p-4 bg-primary text-primary-foreground">
                <p className="font-medium mb-2">Primary</p>
                <p className="text-sm">--primary</p>
              </div>
              <div className="border rounded-md p-4 bg-secondary text-secondary-foreground">
                <p className="font-medium mb-2">Secondary</p>
                <p className="text-sm">--secondary</p>
              </div>
              <div className="border rounded-md p-4 bg-accent text-accent-foreground">
                <p className="font-medium mb-2">Accent</p>
                <p className="text-sm">--accent</p>
              </div>
              <div className="border rounded-md p-4 bg-destructive text-destructive-foreground">
                <p className="font-medium mb-2">Destructive</p>
                <p className="text-sm">--destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Button variant="default">Default</Button>
                <p className="text-sm text-muted-foreground">Primary action</p>
              </div>
              <div className="space-y-2">
                <Button variant="secondary">Secondary</Button>
                <p className="text-sm text-muted-foreground">
                  Secondary action
                </p>
              </div>
              <div className="space-y-2">
                <Button variant="accent">Accent</Button>
                <p className="text-sm text-muted-foreground">Accent action</p>
              </div>
              <div className="space-y-2">
                <Button variant="outline">Outline</Button>
                <p className="text-sm text-muted-foreground">Outline</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost">Ghost</Button>
                <p className="text-sm text-muted-foreground">Ghost</p>
              </div>
              <div className="space-y-2">
                <Button variant="destructive">Destructive</Button>
                <p className="text-sm text-muted-foreground">Destructive</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Text Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-foreground">Text Foreground</p>
              <p className="text-sm text-muted-foreground">--foreground</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">Muted Foreground</p>
              <p className="text-sm text-muted-foreground">
                --muted-foreground
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-primary">Primary</p>
              <p className="text-sm text-muted-foreground">--primary</p>
            </div>
            <div className="space-y-2">
              <p className="text-secondary-foreground">Secondary</p>
              <p className="text-sm text-muted-foreground">
                --secondary-foreground
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-accent-foreground">Accent</p>
              <p className="text-sm text-muted-foreground">
                --accent-foreground
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-destructive">Destructive</p>
              <p className="text-sm text-muted-foreground">--destructive</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
