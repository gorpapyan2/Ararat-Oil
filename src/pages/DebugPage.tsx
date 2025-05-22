import { useState, useEffect } from "react";
import { testSupabaseConnection } from "@/utils/debug-utils";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  usePageBreadcrumbs({
    segments: [
      { name: "Dashboard", href: "/" },
      { name: "Debug", href: "/dev/debug", isCurrent: true }
    ],
    title: "Debug"
  });

  // Override console.log to capture logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev, `LOG: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      ).join(' ')}`]);
    };
    
    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev, `ERROR: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      ).join(' ')}`]);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  const runTest = async () => {
    setLogs([]);
    setIsLoading(true);
    try {
      await testSupabaseConnection();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Debug Page</CardTitle>
          <CardDescription>Test Supabase connection and fuel supplies data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={runTest} 
            disabled={isLoading}
          >
            {isLoading ? "Testing..." : "Run Supabase Test"}
          </Button>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Debug Logs</h3>
            <div className="bg-black/10 p-4 rounded-md max-h-[500px] overflow-auto">
              {logs.length === 0 ? (
                <p className="text-muted-foreground italic">Run the test to see logs here</p>
              ) : (
                logs.map((log, i) => (
                  <pre key={i} className="text-xs mb-1 whitespace-pre-wrap">
                    {log.startsWith("ERROR") ? (
                      <span className="text-destructive">{log}</span>
                    ) : (
                      log
                    )}
                  </pre>
                ))
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This is a debug utility for troubleshooting Supabase connection issues.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default DebugPage; 