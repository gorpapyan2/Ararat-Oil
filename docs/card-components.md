# Card Components

This document provides comprehensive documentation for the card component system, designed to ensure consistency and enhance developer productivity when working with card-based UI elements.

## Table of Contents

- [Overview](#overview)
- [Base Components](#base-components)
  - [Card](#card)
  - [CardHeader](#cardheader)
  - [CardTitle](#cardtitle)
  - [CardDescription](#carddescription)
  - [CardContent](#cardcontent)
  - [CardFooter](#cardfooter)
  - [CardMedia](#cardmedia)
  - [CardActions](#cardactions)
- [Specialized Cards](#specialized-cards)
  - [MetricCard](#metriccard)
  - [ActionCard](#actioncard)
  - [StatsCard](#statscard)
  - [SummaryCard](#summarycard)
  - [InfoCard](#infocard)
- [Layout Components](#layout-components)
  - [CardGrid](#cardgrid)
  - [CardGroup](#cardgroup)
- [Usage Examples](#usage-examples)
- [Migration Guide](#migration-guide)

## Overview

The card component system provides a set of reusable components for creating card-based UI elements. Cards are used to group related information and provide a clear visual hierarchy. This system includes:

- **Base components**: Foundational building blocks for custom cards
- **Specialized cards**: Pre-built cards for common use cases
- **Layout components**: Tools for arranging cards in grids and groups

All components are built with accessibility, responsiveness, and customization in mind.

## Base Components

### Card

The `Card` component is the fundamental container for all card content.

```tsx
import { Card } from "@/core/components/ui/cards";

<Card>
  {/* Card content goes here */}
</Card>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"default" \| "outline" \| "ghost" \| "elevated"` | `"default"` | Visual style variant |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Card size |
| `hover` | `boolean` | `false` | Whether to add hover effect |
| `interactive` | `boolean` | `false` | Makes card interactive (clickable) |
| `disabled` | `boolean` | `false` | Disables the card (reduces opacity and events) |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | Border radius |
| `isLoading` | `boolean` | `false` | Shows loading state |

### CardHeader

Container for card title and description, typically placed at the top of the card.

```tsx
import { Card, CardHeader, CardTitle } from "@/core/components/ui/cards";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
</Card>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `padded` | `boolean` | `true` | Whether to add padding |
| `bordered` | `boolean` | `false` | Add border to the bottom |

### CardTitle

The title component for cards.

```tsx
<CardTitle size="lg">Card Title</CardTitle>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `size` | `"sm" \| "default" \| "lg" \| "xl"` | `"default"` | Title size |
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"h3"` | HTML heading level |

### CardDescription

Secondary text displayed below the card title.

```tsx
<CardDescription>Card description goes here</CardDescription>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Description text size |

### CardContent

Container for the main content of the card.

```tsx
<CardContent>
  <p>Main content goes here</p>
</CardContent>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `padded` | `boolean` | `true` | Whether to add padding |

### CardFooter

Container for content at the bottom of the card.

```tsx
<CardFooter>
  <Button>Save</Button>
</CardFooter>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `padded` | `boolean` | `true` | Whether to add padding |
| `bordered` | `boolean` | `false` | Add border to the top |
| `align` | `"left" \| "center" \| "right" \| "between"` | `"left"` | Content alignment |

### CardMedia

Container for images or other media content within a card.

```tsx
<CardMedia position="top" aspectRatio="16:9">
  <img src="/image.jpg" alt="Card media" />
</CardMedia>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `position` | `"top" \| "bottom"` | `"top"` | Media placement |
| `aspectRatio` | `"1:1" \| "16:9" \| "4:3" \| "3:2" \| "2:1"` | `"16:9"` | Media aspect ratio |

### CardActions

Container for action buttons, typically placed at the bottom of the card.

```tsx
<CardActions>
  <Button>Save</Button>
  <Button variant="outline">Cancel</Button>
</CardActions>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `padded` | `boolean` | `true` | Whether to add padding |
| `align` | `"left" \| "center" \| "right" \| "between"` | `"right"` | Actions alignment |

## Specialized Cards

### MetricCard

Card for displaying numerical metrics with optional trend indicators.

```tsx
import { MetricCard } from "@/core/components/ui/cards";

<MetricCard
  title="Revenue"
  value="$24,320"
  description="Total revenue this month"
  trend={{ value: "12%", direction: "up", label: "vs last month" }}
  icon={<DollarSign />}
/>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | **Required** | Card title |
| `value` | `string \| number` | **Required** | Metric value to display |
| `description` | `string` | - | Additional description |
| `icon` | `ReactNode` | - | Icon to display |
| `trend` | `{ value: string \| number, direction?: "up" \| "down" \| "neutral", label?: string }` | - | Trend data |
| `footer` | `ReactNode` | - | Footer content |
| `onClick` | `() => void` | - | Click handler |

### ActionCard

Card with a prominent call-to-action and optional status indicator.

```tsx
import { ActionCard } from "@/core/components/ui/cards";

<ActionCard
  title="Complete Profile"
  description="Update your profile information"
  status="warning"
  actionLabel="Update Now"
  onAction={() => navigate('/profile')}
  icon={<UserIcon />}
/>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | **Required** | Card title |
| `description` | `string` | - | Additional description |
| `icon` | `ReactNode` | - | Icon to display |
| `status` | `"success" \| "warning" \| "error" \| "info" \| "muted"` | - | Status indicator |
| `actionLabel` | `string` | `"View details"` | Action button text |
| `onAction` | `() => void` | - | Action button handler |
| `actionHref` | `string` | - | Alternative to onAction for links |

### StatsCard

Simple card for displaying statistics.

```tsx
import { StatsCard } from "@/core/components/ui/cards";

<StatsCard
  title="Active Users"
  value="1,234"
  icon={<Users className="h-4 w-4" />}
  change={{ value: "+5.2%", direction: "up" }}
/>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | **Required** | Card title |
| `value` | `string \| number` | **Required** | Statistic value |
| `description` | `string` | - | Additional description |
| `icon` | `ReactNode` | - | Icon to display |
| `change` | `{ value: string \| number, direction?: "up" \| "down" \| "neutral" }` | - | Change indicator |
| `footer` | `ReactNode` | - | Footer content |

### SummaryCard

Card for displaying multiple metrics or data points.

```tsx
import { SummaryCard } from "@/core/components/ui/cards";

<SummaryCard
  title="Monthly Summary"
  description="Performance overview"
  metrics={[
    { label: "Revenue", value: "$12,345", color: "success" },
    { label: "Expenses", value: "$5,432", color: "danger" },
    { label: "Profit", value: "$6,913", color: "success" },
  ]}
  action={{
    label: "View Details",
    onClick: () => navigate('/reports')
  }}
/>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | **Required** | Card title |
| `description` | `string` | - | Additional description |
| `metrics` | `Array<{ label: string, value: string \| number, color?: "default" \| "muted" \| "success" \| "warning" \| "danger" }>` | - | Metrics to display |
| `action` | `{ label: string, onClick: () => void, href?: string }` | - | Action button configuration |
| `footer` | `ReactNode` | - | Footer content |

### InfoCard

Card for displaying informational content with different styling based on type.

```tsx
import { InfoCard } from "@/core/components/ui/cards";

<InfoCard
  title="Information"
  description="This is an informational message"
  type="info"
  actions={<Button size="sm">Dismiss</Button>}
>
  <p>Additional information can be placed here.</p>
</InfoCard>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | **Required** | Card title |
| `description` | `string` | - | Additional description |
| `icon` | `ReactNode` | - | Custom icon (defaults based on type) |
| `type` | `"default" \| "info" \| "success" \| "warning" \| "error"` | `"default"` | Card type for styling |
| `actions` | `ReactNode` | - | Action buttons |

## Layout Components

### CardGrid

Responsive grid layout for displaying multiple cards.

```tsx
import { CardGrid, MetricCard } from "@/core/components/ui/cards";

<CardGrid columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} gap="gap-6">
  <MetricCard title="Users" value="1,234" />
  <MetricCard title="Revenue" value="$45,678" />
  <MetricCard title="Orders" value="567" />
  <MetricCard title="Products" value="89" />
</CardGrid>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `columns` | `{ xs?: number, sm?: number, md?: number, lg?: number, xl?: number }` | `{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }` | Column count at each breakpoint |
| `gap` | `string` | `"gap-4"` | Space between cards |
| `autoFit` | `boolean` | `false` | Use auto-fit instead of fixed columns |
| `minWidth` | `string` | `"250px"` | Minimum width for auto-fit cards |

### CardGroup

Container for displaying related cards together.

```tsx
import { CardGroup, Card, CardHeader, CardTitle, CardContent } from "@/core/components/ui/cards";

<CardGroup direction="horizontal" joined>
  <Card>
    <CardHeader>
      <CardTitle>Step 1</CardTitle>
    </CardHeader>
    <CardContent>Create your account</CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Step 2</CardTitle>
    </CardHeader>
    <CardContent>Set up your profile</CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>Step 3</CardTitle>
    </CardHeader>
    <CardContent>Start using the app</CardContent>
  </Card>
</CardGroup>
```

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `gap` | `string` | `"gap-4"` | Space between cards |
| `direction` | `"horizontal" \| "vertical"` | `"vertical"` | Layout direction |
| `joined` | `boolean` | `false` | Join cards together visually |

## Usage Examples

### Basic Card Example

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/core/components/ui/cards";
import { Button } from "@/core/components/ui/button";

export function BasicCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You can update your settings here.</p>
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dashboard Example with Specialized Cards

```tsx
import {
  CardGrid,
  MetricCard,
  ActionCard,
  StatsCard,
  SummaryCard,
} from "@/core/components/ui/cards";
import { DollarSign, Users, Package, ShoppingCart } from "lucide-react";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <CardGrid columns={{ xs: 1, sm: 2, lg: 4 }} gap="gap-6">
        <MetricCard
          title="Revenue"
          value="$24,320"
          trend={{ value: "12%", direction: "up", label: "vs last month" }}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <MetricCard
          title="Users"
          value="1,234"
          trend={{ value: "3%", direction: "up", label: "new users" }}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Orders"
          value="645"
          change={{ value: "-2%", direction: "down" }}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Products"
          value="89"
          change={{ value: "+5", direction: "up" }}
          icon={<Package className="h-5 w-5" />}
        />
      </CardGrid>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <SummaryCard
            title="Financial Overview"
            description="Current period"
            metrics={[
              { label: "Revenue", value: "$12,345", color: "success" },
              { label: "Expenses", value: "$5,432", color: "danger" },
              { label: "Profit", value: "$6,913", color: "success" },
            ]}
            action={{
              label: "View Full Report",
              onClick: () => console.log("View report")
            }}
          />
        </div>
        <ActionCard
          title="Incomplete Tasks"
          description="You have 3 tasks to complete"
          status="warning"
          actionLabel="View Tasks"
          onAction={() => console.log("View tasks")}
        />
      </div>
    </div>
  );
}
```

## Migration Guide

### Migrating from Old Card Components

If you're using the old card components, follow these steps to migrate to the new system:

1. **Update imports**:

   ```tsx
   // Old imports
   import { Card, CardHeader, CardTitle } from "@/core/components/ui/card";
   
   // New imports
   import { Card, CardHeader, CardTitle } from "@/core/components/ui/cards";
   ```

2. **Update specialized cards**:

   ```tsx
   // Old
   import { StatsCard, MetricCard } from "@/core/components/ui/primitives/cards";
   // or
   import { MetricCard } from "@/core/components/ui/composed/cards";
   
   // New
   import { StatsCard, MetricCard } from "@/core/components/ui/cards";
   ```

3. **Update prop usage**:

   The new components have more consistent props. Refer to the prop tables above for the available options.

4. **Layout components**:

   Replace custom grid implementations with the new `CardGrid` and `CardGroup` components.

### Script for Automated Migration

You can use the following script to automatically update imports in your codebase:

```bash
# Find and replace imports with sed
find src -type f -name "*.tsx" -exec sed -i 's|"@/core/components/ui/card"|"@/core/components/ui/cards"|g' {} \;
find src -type f -name "*.tsx" -exec sed -i 's|"@/core/components/ui/primitives/cards"|"@/core/components/ui/cards"|g' {} \;
find src -type f -name "*.tsx" -exec sed -i 's|"@/core/components/ui/composed/cards"|"@/core/components/ui/cards"|g' {} \;
``` 