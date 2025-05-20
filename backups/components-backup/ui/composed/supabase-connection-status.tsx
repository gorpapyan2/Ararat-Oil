/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { supabase-connection-status } from '@/core/components/ui/supabase-connection-status';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'supabase-connection-status',
    oldPath: '@/components/ui/supabase-connection-status',
    newPath: '@/core/components/ui/supabase-connection-status',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default supabase-connection-status;
