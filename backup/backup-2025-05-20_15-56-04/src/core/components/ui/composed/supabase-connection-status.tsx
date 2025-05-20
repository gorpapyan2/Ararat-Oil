import { useState, useEffect } from 'react';
import { Button } from '@/core/components/ui/primitives/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/core/components/ui/primitives/card';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/ui/primitives/alert';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { checkSupabaseConnection, syncWithSupabase, QUERY_KEYS } from '@/utils/supabase-helpers';
import { useToast } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

export function SupabaseConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [syncedResources, setSyncedResources] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const checkConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSync = async () => {
    setIsLoading(true);
    setSyncedResources([]);
    try {
      const result = await syncWithSupabase(queryClient);
      if (result.success) {
        toast({
          title: 'Sync Successful',
          description: result.message,
        });
        setIsConnected(true);
        if (result.refreshedResources) {
          setSyncedResources(result.refreshedResources);
        }
      } else {
        toast({
          title: 'Sync Failed',
          description: result.message,
          variant: 'destructive',
        });
        setIsConnected(false);
      }
      setLastChecked(new Date());
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      toast({
        title: 'Sync Error',
        description: 'An unexpected error occurred during sync.',
        variant: 'destructive',
      });
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Supabase Connection</CardTitle>
        <CardDescription>
          Check and manage your Supabase database connection
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected === null ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : isConnected ? (
          <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-500">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Connected</AlertTitle>
            <AlertDescription>
              Your app is successfully connected to Supabase.
              {lastChecked && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </div>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Connection Failed</AlertTitle>
            <AlertDescription>
              Unable to connect to Supabase. Check your internet connection and credentials.
              {lastChecked && (
                <div className="text-xs mt-1">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        {syncedResources.length > 0 && (
          <div className="mt-4 p-3 bg-accent rounded-md text-sm">
            <p className="font-medium mb-1">Synced Resources:</p>
            <div className="flex flex-wrap gap-1">
              {syncedResources.map(resource => (
                <span key={resource} className="px-2 py-0.5 bg-primary/10 rounded-full text-xs">
                  {resource}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={checkConnection} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Connection
            </>
          )}
        </Button>
        <Button 
          onClick={handleSync} 
          disabled={isLoading}
        >
          {isLoading ? 'Syncing...' : 'Sync Now'}
        </Button>
      </CardFooter>
    </Card>
  );
} 