import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, RefreshCw, Database } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { checkSupabaseConnection } from '@/utils/supabase-helpers';
import { supabase } from '@/integrations/supabase/client';

export function ConnectivityDebugger() {
  const [activeTab, setActiveTab] = useState('env');
  const [isLoading, setIsLoading] = useState(false);
  const [connectivityStatus, setConnectivityStatus] = useState<{
    isConnected: boolean | null;
    message: string;
    timestamp: Date | null;
  }>({
    isConnected: null,
    message: 'Not checked yet',
    timestamp: null,
  });
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // Check environment variables
  useEffect(() => {
    const env: Record<string, string> = {};
    
    // Only collect variables that are safe to display (no secrets)
    try {
      if (import.meta.env.VITE_SUPABASE_URL) {
        env['VITE_SUPABASE_URL'] = import.meta.env.VITE_SUPABASE_URL;
      }
      
      // Add other safe environment variables
      if (import.meta.env.NODE_ENV) {
        env['NODE_ENV'] = import.meta.env.NODE_ENV;
      }
      
      // Add fallback URLs
      if (import.meta.env.VITE_FALLBACK_IP) {
        env['VITE_FALLBACK_IP'] = import.meta.env.VITE_FALLBACK_IP;
      }
    } catch (error) {
      console.error('Error collecting environment variables:', error);
    }
    
    setEnvVariables(env);
  }, []);

  // Test direct Supabase connection
  const testDirectConnection = async () => {
    setIsLoading(true);
    try {
      const start = performance.now();
      const isConnected = await checkSupabaseConnection();
      const end = performance.now();
      
      setConnectivityStatus({
        isConnected,
        message: isConnected 
          ? `Connected successfully in ${Math.round(end - start)}ms` 
          : 'Connection failed - see console for details',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectivityStatus({
        isConnected: false,
        message: `Connection error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test React Query
  const testReactQuery = async () => {
    setIsLoading(true);
    try {
      queryClient.resetQueries();
      const start = performance.now();
      
      // Refresh the fuel supplies query
      await queryClient.fetchQuery({
        queryKey: ['fuel-supplies'],
        queryFn: async () => {
          const { data, error } = await supabase.from('fuel_supplies').select('*').limit(1);
          if (error) throw error;
          return data;
        },
      });
      
      const end = performance.now();
      
      setConnectivityStatus({
        isConnected: true,
        message: `React Query successfully fetched data in ${Math.round(end - start)}ms`,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('React Query test error:', error);
      setConnectivityStatus({
        isConnected: false,
        message: `React Query error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connectivity Debugger</CardTitle>
        <CardDescription>
          Diagnose and troubleshoot connection issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="env">Environment</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="reactQuery">React Query</TabsTrigger>
          </TabsList>
          
          <TabsContent value="env">
            <div className="space-y-4">
              <h3 className="font-medium">Environment Variables</h3>
              <div className="bg-muted p-4 rounded-md">
                {Object.keys(envVariables).length > 0 ? (
                  <pre className="text-xs overflow-auto">
                    {JSON.stringify(envVariables, null, 2)}
                  </pre>
                ) : (
                  <p className="text-muted-foreground text-sm">No environment variables available</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="connection">
            <div className="space-y-4">
              <h3 className="font-medium">Supabase Connection</h3>
              
              {connectivityStatus.isConnected !== null && (
                <Alert variant={connectivityStatus.isConnected ? "default" : "destructive"} 
                       className={connectivityStatus.isConnected ? "border-green-500 bg-green-500/10" : ""}>
                  {connectivityStatus.isConnected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{connectivityStatus.message}</AlertTitle>
                </Alert>
              )}
              
              <Button onClick={testDirectConnection} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Test Supabase Connection
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="reactQuery">
            <div className="space-y-4">
              <h3 className="font-medium">React Query Cache</h3>
              
              {connectivityStatus.isConnected !== null && activeTab === 'reactQuery' && (
                <Alert variant={connectivityStatus.isConnected ? "default" : "destructive"}
                       className={connectivityStatus.isConnected ? "border-green-500 bg-green-500/10" : ""}>
                  {connectivityStatus.isConnected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{connectivityStatus.message}</AlertTitle>
                </Alert>
              )}
              
              <Button onClick={testReactQuery} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Test React Query Fetch
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {connectivityStatus.timestamp && 
          `Last check: ${connectivityStatus.timestamp.toLocaleTimeString()}`}
      </CardFooter>
    </Card>
  );
} 