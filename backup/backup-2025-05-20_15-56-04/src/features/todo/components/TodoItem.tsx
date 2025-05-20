/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/todo/components/TodoItem')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TodoItem as FeatureTodoItem } from "@/features/todo/components/TodoItem";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/todo/components/TodoItem')}
 */
export default function TodoItem() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TodoItem",
      "src\components\todo\TodoItem.tsx",
      "@/features/todo/components/TodoItem"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureTodoItem />;
}
