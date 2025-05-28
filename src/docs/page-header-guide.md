# PageHeader Component Guide

The PageHeader component provides a standardized layout for page headers across the application. It supports rendering page titles, descriptions, breadcrumbs, and action buttons in a responsive and consistent layout.

## Architecture

The PageHeader follows our 3-layer component architecture:

1. **Primitives Layer**: Base, unstyled components in `src/components/ui/primitives/page-header.tsx`
2. **Styled Layer**: Design system components in `src/components/ui/page-header.tsx`
3. **Compatibility Layer**: Backwards compatibility in `src/components/ui-custom/page-header.tsx`

## Basic Usage

```tsx
import { PageHeader } from "@/components/ui/page-header";

export default function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Page Title"
        description="This is the description of my page"
      />
      {/* Page content */}
    </div>
  );
}
```

## With Translation Keys

The PageHeader supports internationalization through react-i18next:

```tsx
import { PageHeader } from "@/components/ui/page-header";

export default function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        titleKey="pages.myPage.title"
        descriptionKey="pages.myPage.description"
      />
      {/* Page content */}
    </div>
  );
}
```

## With Actions

```tsx
import { PageHeader } from "@/components/ui/page-header";
import { CreateButton } from "@/components/ui/create-button";

export default function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Page"
        description="Page description"
        actions={
          <CreateButton
            label="Add New"
            onClick={() => console.log("Create new item")}
          />
        }
      />
      {/* Page content */}
    </div>
  );
}
```

## With Breadcrumbs

```tsx
import { PageHeader } from "@/components/ui/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";

export default function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Page"
        description="Page description"
        breadcrumbs={
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/section">Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Current Page</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      />
      {/* Page content */}
    </div>
  );
}
```

## Using Component Composition

For more complex layouts, you can use component composition:

```tsx
import {
  PageHeader,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  PageHeaderBreadcrumbs,
} from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div className="space-y-6">
      <PageHeader>
        <PageHeaderBreadcrumbs>
          <span>Home</span> / <span>Section</span> / <span>Current</span>
        </PageHeaderBreadcrumbs>

        <PageHeaderTitle>
          Custom Title with <span className="text-primary">Formatting</span>
        </PageHeaderTitle>

        <PageHeaderDescription>
          This is a longer description that may include{" "}
          <strong>formatted text</strong>
          or even <a href="#">links</a>.
        </PageHeaderDescription>

        <PageHeaderActions>
          <Button variant="outline">Secondary Action</Button>
          <Button>Primary Action</Button>
        </PageHeaderActions>
      </PageHeader>

      {/* Page content */}
    </div>
  );
}
```

## Loading State

The PageHeader includes a skeleton component for loading states:

```tsx
import { PageHeaderSkeleton } from "@/components/ui/page-header";

export default function LoadingPage() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      {/* Other loading skeletons */}
    </div>
  );
}
```

## API Reference

### PageHeader Props

| Prop             | Type              | Description                                                 |
| ---------------- | ----------------- | ----------------------------------------------------------- |
| `title`          | `string`          | The title text of the page                                  |
| `titleKey`       | `string`          | Translation key for the title                               |
| `description`    | `string`          | The description text of the page                            |
| `descriptionKey` | `string`          | Translation key for the description                         |
| `actions`        | `React.ReactNode` | Actions to display in the header (usually buttons)          |
| `breadcrumbs`    | `React.ReactNode` | Breadcrumbs navigation component                            |
| `className`      | `string`          | Additional CSS classes to apply                             |
| `children`       | `React.ReactNode` | Alternative to props-based usage, for component composition |

### Sub-Components

- **PageHeaderTitle**: Renders the page title with standard styling
- **PageHeaderDescription**: Renders the page description with muted styling
- **PageHeaderActions**: Contains action buttons with proper spacing
- **PageHeaderBreadcrumbs**: Contains breadcrumb navigation
- **PageHeaderSkeleton**: Loading state representation

## Migration

When migrating from the old PageHeader implementation, update your imports:

```tsx
// Old import
import { PageHeader, CreateButton } from "@/components/ui-custom/page-header";

// New import
import { PageHeader } from "@/components/ui/page-header";
import { CreateButton } from "@/components/ui/create-button";
```

## Best Practices

1. **Use Translation Keys**: For internationalized applications, prefer using `titleKey` and `descriptionKey` instead of hard-coded text.

2. **Responsive Design**: The PageHeader is responsive by default. On smaller screens, the actions will appear below the title.

3. **Consistency**: Use the PageHeader component for all main pages to ensure a consistent user experience.

4. **Accessibility**: The title is rendered as an `<h1>` element. Ensure you don't have other `<h1>` elements on the same page.

5. **Action Buttons**: Place the primary action on the right (last) when using multiple action buttons.

## Examples in the Codebase

- `SalesNew.tsx`: Simple usage with title, description, and a CreateButton
- `Settings.tsx`: Uses translation keys for localization
- `DashboardNew.tsx`: More complex example with breadcrumb navigation
- `FuelManagement.tsx`: Example with a ButtonGroup in the actions area
