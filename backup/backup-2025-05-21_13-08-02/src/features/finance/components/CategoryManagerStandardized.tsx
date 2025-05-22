/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/CategoryManagerStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { CategoryManagerStandardized as FeatureCategoryManagerStandardized } from "@/features/finance/components/CategoryManagerStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/finance/components/CategoryManagerStandardized')}
 */
export default function CategoryManagerStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "CategoryManagerStandardized",
      "src\components\expenses\CategoryManagerStandardized.tsx",
      "@/features/finance/components/CategoryManagerStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureCategoryManagerStandardized />;
}
