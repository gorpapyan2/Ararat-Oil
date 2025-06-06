# Petronas Teal & Silver Design System Implementation Guide

## 🎨 Color Palette Overview

### Light Mode
- **Background**: `#F3F7F5` - Very pale mint
- **Surface**: `#FFFFFF` - White
- **Primary**: `#008E6D` - Deep teal (Petronas signature)
- **Secondary**: `#939598` - Cool grey/silver
- **Accent**: `#FFD700` - Gold (for success/alerts)
- **Text Default**: `#1F2A2A` - Very dark teal-grey
- **Text Muted**: `#4A5959` - Mid-grey

### Dark Mode
- **Background**: `#0D1412` - Almost black-green
- **Surface**: `#1B2A28` - Dark slate-teal
- **Primary**: `#3CBD9A` - Lighter mint
- **Secondary**: `#B3B6B8` - Palladium silver
- **Accent**: `#FDD164` - Muted gold
- **Text Default**: `#E0F2F1` - Pale mint-white
- **Text Muted**: `#94A7A7` - Light teal-grey

## 🚀 Quick Start Usage

### Basic Button Examples

```tsx
// Primary Button - Petronas Teal
<Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
  Start Fueling
</Button>

// Secondary Button - Silver
<Button variant="secondary">
  View Reports
</Button>

// Accent Button - Gold
<Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
  Premium Feature
</Button>
```

### Card Components

```tsx
// Professional Card with Petronas Theme
<Card className="border-border bg-card hover:shadow-lg transition-all duration-200">
  <CardHeader>
    <CardTitle className="text-foreground">Fuel Management</CardTitle>
    <CardDescription className="text-muted-foreground">
      Track your fleet's fuel consumption
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Status Indicators

```tsx
// Operational Status - Teal
<Badge className="bg-status-operational text-white">
  Operational
</Badge>

// Maintenance Status - Gold
<Badge className="bg-status-maintenance text-black">
  Maintenance
</Badge>

// Offline Status - Silver
<Badge className="bg-status-offline text-white">
  Offline
</Badge>
```

## 🎯 Fuel Type Color Coding

```tsx
// Fuel Type Indicators
const fuelTypes = {
  gasoline: "bg-fuel-gasoline",      // Red
  diesel: "bg-fuel-diesel",          // Amber
  premium: "bg-fuel-premium",        // Deep red
  electric: "bg-fuel-electric",      // Blue
  naturalGas: "bg-fuel-natural-gas", // Petronas teal
  renewable: "bg-fuel-renewable"     // Emerald
};

// Usage
<div className={`${fuelTypes.diesel} text-white px-3 py-1 rounded-md`}>
  Diesel
</div>
```

## 📊 Chart Colors

```tsx
// Recharts Configuration
const chartColors = {
  primary: "hsl(var(--chart-1))",    // Petronas teal
  secondary: "hsl(var(--chart-2))",  // Silver
  accent: "hsl(var(--chart-3))",     // Gold
  info: "hsl(var(--chart-4))",       // Blue
  success: "hsl(var(--chart-5))",    // Emerald
  warning: "hsl(var(--chart-6))",    // Amber
  danger: "hsl(var(--chart-7))",     // Red
  purple: "hsl(var(--chart-8))"      // Purple
};
```

## 🌈 Gradient Implementations

```tsx
// Corporate Gradient - Teal to Silver
<div className="gradient-corporate-steel">
  <h1 className="text-4xl font-bold text-white">
    Ararat Oil Management System
  </h1>
</div>

// Energy Gradient - Teal to Gold
<div className="gradient-energy-sector p-6 rounded-xl">
  <p className="text-white">Sustainable Energy Solutions</p>
</div>

// Fuel Management Gradient
<div className="gradient-fuel-management">
  {/* Content */}
</div>
```

## 📱 Mobile-First Responsive Design

```tsx
// Mobile-First Card Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {items.map((item) => (
    <Card key={item.id} className="hover:shadow-xl transition-all">
      {/* Card content */}
    </Card>
  ))}
</div>

// Responsive Typography
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
  Fuel Management Dashboard
</h1>
```

## 🎨 Professional Component Examples

### Dashboard Header
```tsx
<header className="bg-background border-b border-border">
  <div className="container mx-auto px-4 py-4 sm:py-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Fuel Management System
        </h1>
        <p className="text-muted-foreground mt-1">
          Powered by Ararat Oil
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Badge className="bg-status-operational text-white">
          System Online
        </Badge>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          New Transaction
        </Button>
      </div>
    </div>
  </div>
</header>
```

### Fuel Station Card
```tsx
<Card className="group hover:shadow-xl transition-all duration-300 border-border">
  <CardHeader className="pb-3">
    <div className="flex items-start justify-between">
      <div>
        <CardTitle className="text-lg font-semibold text-foreground">
          Station Alpha-01
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Main Distribution Center
        </CardDescription>
      </div>
      <Badge className="bg-status-operational text-white">
        Active
      </Badge>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Fuel Level</span>
        <span className="text-sm font-medium text-foreground">85%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: '85%' }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">Daily Volume</p>
          <p className="text-lg font-semibold text-foreground">2,450L</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-lg font-semibold text-primary">$4,280</p>
        </div>
      </div>
    </div>
  </CardContent>
  <CardFooter className="pt-3">
    <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
      View Details
    </Button>
  </CardFooter>
</Card>
```

### Analytics Dashboard Widget
```tsx
<Card className="border-border bg-card">
  <CardHeader>
    <CardTitle className="flex items-center justify-between text-foreground">
      <span>Fuel Consumption Analytics</span>
      <Badge className="bg-accent text-accent-foreground">
        Live
      </Badge>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="diesel" 
            stroke="hsl(var(--chart-6))" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="gasoline" 
            stroke="hsl(var(--chart-7))" 
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="naturalGas" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>
```

## 🌓 Dark Mode Toggle

```tsx
// Theme Toggle Button
<Button
  variant="ghost"
  size="icon"
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="text-foreground hover:bg-muted"
>
  {theme === "dark" ? (
    <Sun className="h-5 w-5" />
  ) : (
    <Moon className="h-5 w-5" />
  )}
</Button>
```

## 🎯 Best Practices

1. **Consistency**: Always use the CSS variables for colors, never hardcode hex values
2. **Contrast**: Ensure proper contrast ratios (WCAG AA compliance)
3. **Hierarchy**: Use Petronas teal for primary actions, silver for secondary
4. **Accents**: Reserve gold color for special highlights, warnings, or premium features
5. **Spacing**: Use the defined spacing scale for consistent layouts
6. **Animations**: Keep transitions smooth and professional (200-300ms)
7. **Mobile First**: Design for mobile screens first, then enhance for larger screens

## 🔧 Tailwind Utilities

```css
/* Custom utility classes available */
.gradient-professional
.gradient-fuel-management
.gradient-energy-sector
.gradient-corporate-steel

.text-fuel-gasoline
.bg-fuel-diesel
.text-status-operational
.bg-status-maintenance

.btn-fuel-gasoline
.btn-fuel-diesel
.btn-fuel-electric
.btn-status-operational
```

## 📝 Typography Scale

```tsx
// Heading Hierarchy
<h1 className="text-display">Display Text</h1>     // 3rem
<h1 className="text-heading-1">Heading 1</h1>      // 2.25rem
<h2 className="text-heading-2">Heading 2</h2>      // 1.875rem
<h3 className="text-heading-3">Heading 3</h3>      // 1.5rem
<p className="text-body-large">Body Large</p>      // 1.125rem
<p className="text-body">Body Text</p>             // 1rem
<p className="text-body-small">Body Small</p>      // 0.875rem
<p className="text-caption">CAPTION TEXT</p>       // 0.75rem
```

## 🚀 Implementation Checklist

- [ ] Update all primary buttons to use Petronas teal
- [ ] Replace secondary colors with silver/grey
- [ ] Update accent colors to use gold sparingly
- [ ] Ensure dark mode uses the muted gold accent
- [ ] Update all status indicators to new color scheme
- [ ] Apply new gradient combinations
- [ ] Test contrast ratios for accessibility
- [ ] Update chart colors in analytics
- [ ] Apply mobile-first responsive design
- [ ] Test dark/light mode toggle functionality

This design system provides a modern, corporate feel while maintaining the energy sector identity through the Petronas-inspired color palette.
</content>
</invoke>