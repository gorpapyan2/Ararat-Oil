/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/todo/components/TodoList')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TodoList as FeatureTodoList } from "@/features/todo/components/TodoList";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/todo/components/TodoList')}
 */
export default function TodoList() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TodoList",
      "src\components\todo\TodoList.tsx",
      "@/features/todo/components/TodoList"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureTodoList />;
}
