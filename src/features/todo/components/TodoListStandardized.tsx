/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/todo/components/TodoListStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TodoListStandardized as FeatureTodoListStandardized } from "@/features/todo/components/TodoListStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/todo/components/TodoListStandardized')}
 */
export default function TodoListStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TodoListStandardized",
      "src\components\todo\TodoListStandardized.tsx",
      "@/features/todo/components/TodoListStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureTodoListStandardized />;
}
