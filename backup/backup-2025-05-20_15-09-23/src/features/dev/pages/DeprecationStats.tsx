import { useState, useEffect } from 'react';
import { getDeprecationStats } from '@/utils/deprecation';

/**
 * Development tool for monitoring deprecated component usage
 * Only available in development environment
 */
export function DeprecationStatsPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [totalUsage, setTotalUsage] = useState(0);
  
  useEffect(() => {
    const updateStats = () => {
      const currentStats = getDeprecationStats();
      setStats(currentStats);
      
      // Calculate total usage
      const total = Object.values(currentStats).reduce((sum, count) => sum + count, 0);
      setTotalUsage(total);
    };
    
    // Update initially and every 5 seconds
    updateStats();
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Prevent rendering in production
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Deprecation stats only available in development mode</h1>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deprecated Component Usage Monitor</h1>
      <p className="mb-4 text-sm text-gray-600">
        This dashboard shows real-time usage of deprecated components in the current session.
        Data refreshes every 5 seconds.
      </p>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Total Components</div>
            <div className="text-2xl font-bold">{Object.keys(stats).length}</div>
          </div>
          <div className="p-3 bg-white rounded shadow">
            <div className="text-sm text-gray-500">Total Usage</div>
            <div className="text-2xl font-bold">{totalUsage}</div>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Component Details</h2>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border">Component</th>
            <th className="text-left p-2 border">Usage Count</th>
            <th className="text-left p-2 border">% of Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats).length > 0 ? (
            Object.entries(stats)
              .sort(([, countA], [, countB]) => countB - countA)
              .map(([component, count]) => (
                <tr key={component} className="border-b hover:bg-gray-50">
                  <td className="p-2 border font-medium">{component}</td>
                  <td className="p-2 border">{count}</td>
                  <td className="p-2 border">
                    {totalUsage ? Math.round((count / totalUsage) * 100) : 0}%
                    <div className="w-full bg-gray-200 h-2 mt-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2" 
                        style={{ width: `${Math.round((count / totalUsage) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No deprecated components used in this session
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>This monitoring tool is only active in development mode and helps track migration progress.</p>
        <p>For more information, refer to the <code>docs/refactoring/deprecation-monitoring.md</code> documentation.</p>
      </div>
    </div>
  );
} 