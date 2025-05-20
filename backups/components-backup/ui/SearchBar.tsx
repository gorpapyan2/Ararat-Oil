/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { SearchBar } from '@/core/components/ui/SearchBar';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'SearchBar',
    oldPath: '@/components/ui/SearchBar',
    newPath: '@/core/components/ui/SearchBar',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default SearchBar;
