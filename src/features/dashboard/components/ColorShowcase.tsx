/**
 * Color Showcase Component
 * 
 * Demonstrates the new natural color palette and enhanced button variants
 * Perfect for design system documentation and testing
 */

import React from 'react';
import { Button } from '@/core/components/ui/buttons/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { 
  Fuel, 
  TrendingUp, 
  Download, 
  Settings, 
  Plus, 
  Save, 
  Edit, 
  Trash2,
  RefreshCw,
  Eye,
  Star,
  Heart,
  Share2
} from 'lucide-react';

export function ColorShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
            Natural Color Palette Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the new natural color system with straw accents, professional gradients, and enhanced UI components
          </p>
        </div>

        {/* Button Variants Showcase */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-natural-light">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-accent" />
              Button Variants
            </CardTitle>
            <CardDescription>
              Comprehensive collection of button styles using the natural color palette
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Primary Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Primary & Accent Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" icon={<Plus className="h-4 w-4" />}>
                  Default Button
                </Button>
                <Button variant="secondary" icon={<Save className="h-4 w-4" />}>
                  Secondary
                </Button>
                <Button variant="accent" icon={<Star className="h-4 w-4" />}>
                  Accent Button
                </Button>
                <Button variant="natural" icon={<Fuel className="h-4 w-4" />}>
                  Natural Style
                </Button>
              </div>
            </div>

            {/* Gradient Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Gradient Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="gradient-primary" icon={<TrendingUp className="h-4 w-4" />}>
                  Corporate Gradient
                </Button>
                <Button variant="gradient-energy" icon={<Fuel className="h-4 w-4" />}>
                  Energy Gradient
                </Button>
                <Button variant="gradient-fuel" icon={<Download className="h-4 w-4" />}>
                  Fuel Gradient
                </Button>
              </div>
            </div>

            {/* Utility Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Utility & State Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" icon={<Edit className="h-4 w-4" />}>
                  Outline
                </Button>
                <Button variant="ghost" icon={<Eye className="h-4 w-4" />}>
                  Ghost
                </Button>
                <Button variant="link" icon={<Share2 className="h-4 w-4" />}>
                  Link Button
                </Button>
                <Button variant="glass" icon={<RefreshCw className="h-4 w-4" />}>
                  Glassmorphism
                </Button>
                <Button variant="destructive" icon={<Trash2 className="h-4 w-4" />}>
                  Destructive
                </Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="natural" size="sm">
                  Small
                </Button>
                <Button variant="natural" size="default">
                  Default
                </Button>
                <Button variant="natural" size="lg">
                  Large
                </Button>
                <Button variant="natural" size="xl">
                  Extra Large
                </Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Icon Buttons</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="natural" size="icon-sm">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="gradient-primary" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="gradient-energy" size="icon-lg">
                  <Fuel className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Loading States */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Loading States</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="natural" loading>
                  Processing...
                </Button>
                <Button variant="gradient-primary" loading>
                  Uploading...
                </Button>
                <Button variant="outline" loading>
                  Loading...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette Display */}
        <Card>
          <CardHeader>
            <CardTitle>Natural Color Palette</CardTitle>
            <CardDescription>
              Comprehensive color system with natural tones and professional accents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Colors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Primary Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <div className="h-16 w-full bg-primary rounded-lg shadow-sm border border-border"></div>
                  <p className="text-xs text-center text-muted-foreground">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-secondary rounded-lg shadow-sm border border-border"></div>
                  <p className="text-xs text-center text-muted-foreground">Secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-accent rounded-lg shadow-sm border border-border"></div>
                  <p className="text-xs text-center text-muted-foreground">Accent (Straw)</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-muted rounded-lg shadow-sm border border-border"></div>
                  <p className="text-xs text-center text-muted-foreground">Muted</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-destructive rounded-lg shadow-sm border border-border"></div>
                  <p className="text-xs text-center text-muted-foreground">Destructive</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-card rounded-lg shadow-sm border border-border"></div>
                  <p className="text-xs text-center text-muted-foreground">Card</p>
                </div>
              </div>
            </div>

            {/* Status Colors */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Status Colors</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 w-full bg-status-operational rounded-lg shadow-sm"></div>
                  <p className="text-xs text-center text-muted-foreground">Operational</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-status-warning rounded-lg shadow-sm"></div>
                  <p className="text-xs text-center text-muted-foreground">Warning</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-status-critical rounded-lg shadow-sm"></div>
                  <p className="text-xs text-center text-muted-foreground">Critical</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-status-maintenance rounded-lg shadow-sm"></div>
                  <p className="text-xs text-center text-muted-foreground">Maintenance</p>
                </div>
              </div>
            </div>

            {/* Gradient Showcase */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Gradient Collection</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-16 w-full bg-gradient-natural rounded-lg shadow-md"></div>
                  <p className="text-xs text-center text-muted-foreground">Natural Gradient</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-gradient-corporate rounded-lg shadow-md"></div>
                  <p className="text-xs text-center text-muted-foreground">Corporate Gradient</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-gradient-energy rounded-lg shadow-md"></div>
                  <p className="text-xs text-center text-muted-foreground">Energy Gradient</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-gradient-fuel rounded-lg shadow-md"></div>
                  <p className="text-xs text-center text-muted-foreground">Fuel Gradient</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-gradient-natural-light rounded-lg shadow-md"></div>
                  <p className="text-xs text-center text-muted-foreground">Natural Light</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 w-full bg-gradient-natural-dark rounded-lg shadow-md"></div>
                  <p className="text-xs text-center text-muted-foreground">Natural Dark</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Cards Example */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl border-accent/20">
            <CardHeader className="bg-gradient-natural-light">
              <CardTitle className="flex items-center gap-2 text-accent">
                <Fuel className="h-5 w-5" />
                Fuel Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-muted-foreground mb-4">
                Monitor and manage fuel inventory with advanced tracking capabilities.
              </p>
              <div className="flex gap-2">
                <Button variant="natural" size="sm">Manage</Button>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl border-accent/20">
            <CardHeader className="bg-gradient-energy">
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-muted-foreground mb-4">
                Advanced analytics and reporting for operational insights.
              </p>
              <div className="flex gap-2">
                <Button variant="gradient-energy" size="sm">Analyze</Button>
                <Button variant="ghost" size="sm">Export</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl border-accent/20">
            <CardHeader className="bg-gradient-corporate">
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-muted-foreground mb-4">
                Configure system settings and user preferences.
              </p>
              <div className="flex gap-2">
                <Button variant="gradient-primary" size="sm">Configure</Button>
                <Button variant="outline" size="sm">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 