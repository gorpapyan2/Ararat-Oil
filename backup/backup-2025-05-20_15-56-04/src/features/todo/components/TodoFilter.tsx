/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/todo/components/TodoFilter')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TodoFilter as FeatureTodoFilter } from "@/features/todo/components/TodoFilter";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/todo/components/TodoFilter')}
 */
export default function TodoFilter() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TodoFilter",
      "src\components\todo\TodoFilter.tsx",
      "@/features/todo/components/TodoFilter"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureTodoFilter />;
}
