# Global Search Features Guide

This guide documents the search features implemented in our standardized table components to help users quickly find what they're looking for.

## Overview

Our table components now include powerful search capabilities that go beyond basic text filtering. Key features include:

- **Debounced Search**: Input changes are debounced to prevent excessive filtering or API calls
- **Search Highlighting**: Matched text is highlighted in search results for better visibility
- **Deep Content Highlighting**: Search works inside complex nested components
- **Server-side Support**: Works with both client-side and server-side filtering

## Components Overview

The search functionality is built using three main components:

1. `DebouncedSearch`: A reusable search input component that debounces user input
2. `SearchHighlighter`: A component that highlights matched text in search results
3. `highlightCellContent`: A utility function for highlighting text in table cells

## Usage in Tables

### Basic Implementation

The `StandardizedDataTable` component automatically includes search functionality. It's enabled by default with highlighting and debouncing:

```tsx
<StandardizedDataTable
  columns={columns}
  data={data}
  // Search is enabled by default
/>
```

### Customizing Search Behavior

You can customize the search behavior by passing additional props:

```tsx
<StandardizedDataTable
  columns={columns}
  data={data}
  // Customize search behavior
  highlightSearchResults={true} // Set to false to disable highlighting
  searchDebounceMs={500} // Change the debounce delay (default: 300ms)
/>
```

### Server-side Search

For server-side filtering, the search term is included in the filter callback:

```tsx
<StandardizedDataTable
  columns={columns}
  data={data}
  serverSide={true}
  onFilterChange={(filters) => {
    // filters.searchTerm contains the search value
    fetchData({
      search: filters.searchTerm,
      // other filter parameters
    });
  }}
/>
```

## Using the Search Components Directly

### DebouncedSearch

You can use the `DebouncedSearch` component independently:

```tsx
import { DebouncedSearch } from '@/shared/components/unified/DebouncedSearch';

function MyComponent() {
  const handleSearch = (value: string) => {
    // Do something with the search value
    console.log('Search term:', value);
  };
  
  return (
    <DebouncedSearch
      onSearch={handleSearch}
      debounceMs={300}
      placeholder="Search..."
      screenReaderLabel="Search items"
    />
  );
}
```

### SearchHighlighter

The `SearchHighlighter` component can be used to highlight text in any context:

```tsx
import { SearchHighlighter } from '@/shared/components/unified/SearchHighlighter';

function HighlightedText({ text, searchTerm }) {
  return (
    <SearchHighlighter
      text={text}
      searchTerm={searchTerm}
      highlightClassName="bg-yellow-200 dark:bg-yellow-800 font-medium"
    />
  );
}
```

## How Search Highlighting Works

The search highlighting works through these steps:

1. When a user enters a search term, it's stored in the table's state
2. The search term is passed to the `DataTable` component
3. The `DataTable` applies a transformation to the columns to inject highlighting
4. When rendering cells, the original content is wrapped with the `SearchHighlighter` component
5. The `SearchHighlighter` component splits the text by the search term and wraps matching parts in a `<mark>` element with special styling

This process happens efficiently and only applies to text content, leaving other elements (like buttons) untouched.

## Accessibility Considerations

The search implementation includes several accessibility features:

- The search input has proper ARIA labels and roles
- The clear button has an accessible label
- Highlighted text uses semantic `<mark>` elements
- Keyboard navigation works with search results
- The highlighting preserves screen reader announcements

## Performance Optimization

To optimize performance, search functionality includes:

1. **Debouncing**: Input changes are debounced (default: 300ms) to prevent excessive filtering
2. **Memoization**: Search results are memoized to prevent unnecessary re-renders
3. **Efficient Highlighting**: Only text matching the search query is processed for highlighting
4. **Selective Application**: Highlighting is only applied to text content, not to UI elements

## Limitations and Edge Cases

Some limitations to be aware of:

- Highlighting works best with text and simple components
- Complex nested components may not have all their text highlighted
- The `highlightCellContent` function uses a simplified approach for React elements
- For very large datasets, consider using server-side filtering for better performance

## Future Enhancements

Planned improvements to the search functionality:

1. Advanced filtering options (e.g., filter by specific columns)
2. Fuzzy search capabilities
3. Search history and suggestions
4. Regular expression support for power users 