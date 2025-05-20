/**
 * Component for tracking and reporting usage of deprecated components
 * 
 * This component doesn't render anything visible but provides a centralized
 * way to monitor and report on deprecated component usage throughout the app.
 */
import { useEffect } from 'react';
import { getDeprecationUsageSummary } from '@/utils/deprecation/tracking';

export const DeprecationTracker = () => {
  useEffect(() => {
    // Show deprecation usage report in development
    if (process.env.NODE_ENV === 'development') {
      const reportDeprecationUsage = () => {
        const summary = getDeprecationUsageSummary();
        
        if (summary && summary.length > 0) {
          console.groupCollapsed('📊 Deprecation Usage Report');
          console.table(summary);
          console.groupEnd();
          
          // Highlight the most used deprecated components
          const mostUsed = summary.slice(0, 3);
          if (mostUsed.length > 0) {
            console.log(
              '🚨 Migration Priority: These deprecated components are used most frequently and ' +
              'should be prioritized for migration:'
            );
            mostUsed.forEach(item => {
              console.log(`  • ${item.component}: ${item.usageCount} uses, replace with ${item.replacement}`);
            });
          }
        }
      };
      
      // Run the report on mount and then every 60 seconds if the app stays open
      reportDeprecationUsage();
      const intervalId = setInterval(reportDeprecationUsage, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default DeprecationTracker;
