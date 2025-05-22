/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/petrol-providers/components/ProviderManagerStandardized')}
 * 
 * Deprecation Date: 2023-06-17
 * Planned Removal Date: 2023-12-17
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { ProviderManagerStandardized as FeatureProviderManagerStandardized } from "@/features/petrol-providers/components/ProviderManagerStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/petrol-providers/components/ProviderManagerStandardized')}
 */
export function ProviderManagerStandardized(props) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "ProviderManagerStandardized",
      "src\components\petrol-providers\ProviderManagerStandardized.tsx",
      "@/features/petrol-providers/components/ProviderManagerStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureProviderManagerStandardized {...props} />;
}
