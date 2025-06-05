# Navigations Feature

This feature contains all navigation-related components and functionality for the Ararat Oil Management System.

## Structure

```
src/features/navigations/
├── pages/
│   ├── NavigationPage.tsx    # Main navigation hub page
│   └── index.ts             # Page exports
├── components/
│   └── index.ts            # Navigation component exports (placeholder)
├── hooks/
│   └── index.ts            # Navigation hooks (placeholder)
├── services/
│   └── index.ts            # Navigation services (placeholder)
├── types/
│   └── index.ts            # Navigation-specific types
├── index.ts                # Main feature exports
└── README.md               # This file
```

## Components

### NavigationPage
The main navigation hub that provides:
- Business feature overview and categorization
- Search and filtering capabilities
- Multiple view modes (grid, list, compact)
- Category-based navigation
- Feature statistics and analytics

## Migration Notes

This feature was reorganized from `src/features/dashboard/pages/NavigationPage.tsx` to provide a dedicated navigation module. The NavigationPage component was moved here to better organize the codebase structure.

## Types

- `ViewMode`: Grid, list, or compact view options
- `SortMode`: Various sorting options for features

## Future Enhancements

The placeholder directories are set up for future development:
- Additional navigation components
- Navigation-specific hooks
- Navigation services and APIs 