# Card Components Guide

This guide documents our standardized Card component system, which follows our 3-layer architecture for UI components.

## Architecture Overview

Our Card component system is organized into three layers:

1. **Primitives Layer**: Base components with minimal styling, providing structure and accessibility
2. **Design System Layer**: Styled components that implement our design system
3. **Composed Layer**: Specialized card components for specific use cases

## Card Components

### Basic Card

The standard Card component with multiple variants:

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>Main content goes here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>;
```

### Card Variants

```tsx
// Default variant
<Card>...</Card>

// Outline variant
<Card variant="outline">...</Card>

// Elevated variant
<Card variant="elevated">...</Card>

// Subtle variant
<Card variant="subtle">...</Card>
```

### CardTitle Sizes

```tsx
<CardTitle size="sm">Small Title</CardTitle>
<CardTitle size="md">Medium Title</CardTitle>
<CardTitle size="lg">Large Title</CardTitle>
```

### CardFooter Alignment

```tsx
<CardFooter align="start">Left-aligned content</CardFooter>
<CardFooter align="center">Centered content</CardFooter>
<CardFooter align="between">Space-between content</CardFooter>
<CardFooter align="end">Right-aligned content</CardFooter>
```

### No Padding Content

```tsx
<CardContent noPadding>Content without padding</CardContent>
```

## Specialized Card Components

Our composed card components provide ready-to-use cards for common use cases:

### StatsCard

For displaying simple metrics with optional change indicators:

```tsx
import { StatsCard } from "@/components/ui/composed/cards";

<StatsCard
  title="Revenue"
  value="$45,231"
  change={{
    value: "12%",
    direction: "up", // "up", "down", or "neutral"
  }}
  icon={<TrendingUpIcon />}
/>;
```

### MetricCard

For displaying metrics with trends and more formatting options:

```tsx
import { MetricCard } from "@/components/ui/composed/cards";

<MetricCard
  title="Total Sales"
  value="1,234"
  description="Monthly sales volume"
  icon={<DollarSignIcon />}
  trend={{
    value: "23%",
    positive: true,
    label: "vs last month",
  }}
  loading={false}
/>;
```

### ActionCard

For displaying status cards with an action button:

```tsx
import { ActionCard } from "@/components/ui/composed/cards";

<ActionCard
  title="System Status"
  description="All systems operational"
  status="success" // "success", "warning", "error", "info", or "muted"
  actionLabel="View details"
  onAction={() => console.log("Action clicked")}
  icon={<ServerIcon />}
/>;
```

### SummaryCard

For displaying multiple related metrics:

```tsx
import { SummaryCard } from "@/components/ui/composed/cards";

<SummaryCard
  title="Sales Overview"
  metrics={[
    { label: "Total Sales", value: "$12,345", color: "default" },
    { label: "Revenue", value: "$9,876", color: "success" },
    { label: "Refunds", value: "$1,234", color: "danger" },
  ]}
  action={{
    label: "View Report",
    onClick: () => console.log("Action clicked"),
  }}
/>;
```

### CardGrid

For displaying a responsive grid of MetricCards:

```tsx
import { CardGrid } from "@/components/ui/composed/cards";

<CardGrid
  metrics={[
    { title: "Sales", value: "$12,345", icon: <DollarSignIcon /> },
    { title: "Customers", value: "1,234", icon: <UsersIcon /> },
    { title: "Orders", value: "567", icon: <PackageIcon /> },
    { title: "Revenue", value: "$9,876", icon: <TrendingUpIcon /> },
  ]}
/>;
```

## Best Practices

1. **Choose the right card**: Use the base Card for custom layouts and specialized cards for common patterns

2. **Consistent spacing**: Use the provided containers (CardHeader, CardContent, CardFooter) to maintain consistent spacing

3. **Use semantic structure**: Place titles and descriptions in CardHeader, main content in CardContent, and actions in CardFooter

4. **Responsive considerations**: Cards should be responsive by default; avoid fixed widths and ensure content adapts to different screen sizes

5. **Accessibility**: Ensure card content maintains proper heading hierarchy and sufficient color contrast

## Migration Guide

If you were previously using any of the following components:

- `@/components/ui-custom/card`
- `@/components/ui-custom/data-card`
- `@/components/ui/card-grid`

Please update your imports to use the new standardized components:

```diff
- import { Card, CardHeader, /* ... */ } from "@/components/ui-custom/card";
+ import { Card, CardHeader, /* ... */ } from "@/components/ui/card";

- import { MetricCard, ActionCard, /* ... */ } from "@/components/ui-custom/data-card";
+ import { MetricCard, ActionCard, /* ... */ } from "@/components/ui/composed/cards";

- import { CardGrid } from "@/components/ui/card-grid";
+ import { CardGrid } from "@/components/ui/composed/cards";
```

The new components maintain backwards compatibility with the same props and API as the previous versions, but provide additional features and better organization.
