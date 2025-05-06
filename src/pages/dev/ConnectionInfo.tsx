import { useState } from 'react';
import { SupabaseConnectionStatus } from '@/components/ui/composed/supabase-connection-status';
import { ConnectivityDebugger } from '@/components/ui/composed/connectivity-debugger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkSupabaseConnection, syncWithSupabase } from '@/utils/supabase-helpers';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks';
import { Database, RefreshCcw, Microscope } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function ConnectionInfo() {
  const [tab, setTab] = useState('supabase');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: isConnected, refetch } = useQuery({
    queryKey: ['supabase-connection'],
    queryFn: checkSupabaseConnection,
    staleTime: 60000, // 1 minute
  });
  
  const handleClearQueryCache = () => {
    queryClient.invalidateQueries();
    toast({
      title: 'Query Cache Cleared',
      description: 'The React Query cache has been cleared.'
    });
  };
  
  const handleRefreshAllQueries = () => {
    queryClient.refetchQueries();
    toast({
      title: 'Queries Refreshed',
      description: 'All queries have been manually refreshed.'
    });
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Connection Management</h1>
      
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="supabase">
            <Database className="w-4 h-4 mr-2" />
            Supabase
          </TabsTrigger>
          <TabsTrigger value="query-cache">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Query Cache
          </TabsTrigger>
          <TabsTrigger value="debug">
            <Microscope className="w-4 h-4 mr-2" />
            Diagnostics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="supabase" className="space-y-6">
          <div className="grid place-items-center py-4">
            <SupabaseConnectionStatus />
          </div>
          
          <div className="bg-accent/50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Developer Information</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Connection URL: <code className="bg-background px-1 py-0.5 rounded">https://qnghvjeunmicykrzpeog.supabase.co</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Project ID: <code className="bg-background px-1 py-0.5 rounded">qnghvjeunmicykrzpeog</code>
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="query-cache" className="space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-xl font-semibold mb-4">React Query Cache Management</h2>
            <p className="text-muted-foreground mb-6">
              Manage your application's data fetching state and cache. Use these tools to troubleshoot data synchronization issues.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button onClick={handleClearQueryCache} variant="outline">
                Clear Query Cache
              </Button>
              <Button onClick={handleRefreshAllQueries}>
                Refresh All Queries
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="debug" className="space-y-6">
          <ConnectivityDebugger />
        </TabsContent>
      </Tabs>
    </div>
  );
} 