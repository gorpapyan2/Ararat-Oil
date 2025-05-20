import * as React from 'react';

import { cn } from '@/utils/cn';

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function SearchBar({ 
  className, 
  onSearch,
  placeholder = "Search...",
  ...props 
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = new FormData(form).get('query') as string;
    if (onSearch) onSearch(query);
  };

  return (
    <div 
      className={cn('search-bar', className)}
      {...props}
    >
      <form onSubmit={handleSubmit} className="flex w-full">
        <input 
          type="search"
          name="query"
          placeholder={placeholder}
          className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        />
        <button 
          type="submit"
          className="h-10 rounded-r-md border border-l-0 border-input bg-background px-3 py-2 text-sm font-medium"
        >
          Search
        </button>
      </form>
    </div>
  );
}
