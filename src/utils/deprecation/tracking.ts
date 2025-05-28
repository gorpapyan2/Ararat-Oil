/**
 * Utilities for monitoring deprecated component usage
 *
 * This module provides enhanced tracking and reporting of deprecated component usage
 * to help teams prioritize migration efforts.
 */

// Track component usage with timestamps
export const trackDeprecatedComponentUsage = (
  componentName: string,
  path: string,
  replacementPath: string
) => {
  try {
    // Get existing tracking data
    const existingData = localStorage.getItem("deprecation_usage");
    const trackingData = existingData ? JSON.parse(existingData) : {};

    // Update component usage count and last used timestamp
    if (!trackingData[componentName]) {
      trackingData[componentName] = {
        path,
        replacementPath,
        usageCount: 0,
        firstUsed: new Date().toISOString(),
        lastUsed: null,
        usageDates: [],
      };
    }

    trackingData[componentName].usageCount += 1;
    trackingData[componentName].lastUsed = new Date().toISOString();

    // Store last 10 usage dates for frequency analysis
    trackingData[componentName].usageDates.push(new Date().toISOString());
    if (trackingData[componentName].usageDates.length > 10) {
      trackingData[componentName].usageDates.shift();
    }

    // Save updated tracking data
    localStorage.setItem("deprecation_usage", JSON.stringify(trackingData));

    // Standard console warning with enhanced information
    console.warn(
      `[Deprecation Warning] ${componentName} (${path}) is deprecated. ` +
        `Use ${replacementPath} instead. ` +
        `This component will be removed on 2023-12-22. ` +
        `Usage count: ${trackingData[componentName].usageCount}`
    );

    // Every 10 usages, show a more detailed report in console
    if (trackingData[componentName].usageCount % 10 === 0) {
      console.groupCollapsed(`🔍 Detailed usage report for ${componentName}`);
      console.table({
        Component: componentName,
        Path: path,
        Replacement: replacementPath,
        "Usage Count": trackingData[componentName].usageCount,
        "First Used": trackingData[componentName].firstUsed,
        "Last Used": trackingData[componentName].lastUsed,
      });
      console.groupEnd();
    }
  } catch (error) {
    // Fallback to standard console warning if tracking fails
    console.warn(
      `[Deprecation Warning] ${componentName} (${path}) is deprecated. ` +
        `Use ${replacementPath} instead. ` +
        `This component will be removed on 2023-12-22.`
    );
  }
};

// Get a summary of all deprecated component usage
export const getDeprecationUsageSummary = () => {
  try {
    const existingData = localStorage.getItem("deprecation_usage");
    if (!existingData) return null;

    const trackingData = JSON.parse(existingData);

    // Transform data for reporting
    const summary = Object.entries(trackingData).map(([name, data]) => ({
      component: name,
      path: data.path,
      replacement: data.replacementPath,
      usageCount: data.usageCount,
      lastUsed: data.lastUsed,
      daysSinceLastUsage: data.lastUsed
        ? Math.floor(
            (new Date().getTime() - new Date(data.lastUsed).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : "Never",
    }));

    // Sort by usage count (highest first)
    return summary.sort((a, b) => b.usageCount - a.usageCount);
  } catch (error) {
    console.error("Error getting deprecation usage summary:", error);
    return null;
  }
};

// Clear tracked usage data (for testing)
export const clearDeprecationUsageData = () => {
  localStorage.removeItem("deprecation_usage");
};
