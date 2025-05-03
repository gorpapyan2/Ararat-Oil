import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { ButtonShowcase } from "@/components/ui/ButtonShowcase";

export function ThemeShowcase() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Theme Showcase</h1>
        <ThemeSwitcher variant="default" />
      </div>

      <p className="text-muted-foreground">
        This page demonstrates the improved theming with better contrast in both
        dark and light modes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Switcher Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center gap-2">
                <ThemeSwitcher variant="default" />
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ThemeSwitcher variant="outline" />
                <span className="text-xs text-muted-foreground">Outline</span>
              </div>
            </div>
            <p className="text-sm">
              The theme switcher now uses ToggleButton for better semantics and accessibility.
              The button visually indicates the current theme state and toggles between light and dark modes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Color Contrast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background border rounded-md">
                <h3 className="font-medium mb-2">Background</h3>
                <p className="text-sm text-foreground">
                  Foreground on Background
                </p>
                <p className="text-sm text-primary mt-2">
                  Primary on Background
                </p>
                <p className="text-sm text-accent-foreground mt-2">
                  Accent Foreground on Background
                </p>
              </div>
              <div className="p-4 bg-card rounded-md">
                <h3 className="font-medium mb-2">Card</h3>
                <p className="text-sm text-card-foreground">
                  Card Foreground on Card
                </p>
                <p className="text-sm text-primary mt-2">Primary on Card</p>
                <p className="text-sm text-accent-foreground mt-2">
                  Accent Foreground on Card
                </p>
              </div>
              <div className="p-4 bg-primary rounded-md">
                <h3 className="font-medium text-primary-foreground mb-2">
                  Primary
                </h3>
                <p className="text-sm text-primary-foreground">
                  Primary Foreground on Primary
                </p>
              </div>
              <div className="p-4 bg-accent rounded-md">
                <h3 className="font-medium text-accent-foreground mb-2">
                  Accent
                </h3>
                <p className="text-sm text-accent-foreground">
                  Accent Foreground on Accent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ButtonShowcase />
    </div>
  );
}
