import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, Database, ArrowDownUp } from 'lucide-react';
import { checkSupabaseConnection, syncWithSupabase, QUERY_KEYS } from '@/utils/supabase-helpers';
import { useToast } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { SupabaseConnectionStatus } from '@/components/ui/composed/supabase-connection-status';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

export default function SyncUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<{ 
    success?: boolean; 
    message?: string; 
    refreshedResources?: string[];
    timestamp?: Date;
  }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  
  const handleFullSync = async () => {
    setIsLoading(true);
    try {
      const result = await syncWithSupabase(queryClient);
      setSyncResult({
        success: result.success,
        message: result.message,
        refreshedResources: result.refreshedResources,
        timestamp: new Date()
      });
      
      toast({
        title: result.success ? t('syncUp.syncSuccessful') : t('syncUp.syncFailed'),
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      setSyncResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        timestamp: new Date()
      });
      
      toast({
        title: t('syncUp.syncError'),
        description: t('syncUp.unexpectedError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncSpecificResource = async (resource: string) => {
    setIsLoading(true);
    try {
      // First check connection
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error(t('syncUp.failedToConnect'));
      }
      
      // Invalidate only specific resource
      await queryClient.invalidateQueries({ queryKey: [resource] });
      
      setSyncResult({
        success: true,
        message: t('syncUp.resourceSyncSuccess', { resource }),
        refreshedResources: [resource],
        timestamp: new Date()
      });
      
      toast({
        title: t('syncUp.resourceSynced'),
        description: t('syncUp.resourceRefreshed', { resource }),
      });
    } catch (error) {
      console.error(`Error syncing ${resource}:`, error);
      setSyncResult({
        success: false,
        message: `${t('syncUp.errorSyncingResource', { resource })}: ${error instanceof Error ? error.message : t('syncUp.unknownError')}`,
        timestamp: new Date()
      });
      
      toast({
        title: t('syncUp.resourceSyncFailed'),
        description: t('syncUp.unableToSyncResource', { resource }),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Database className="mr-2 h-6 w-6" />
        {t('syncUp.title')}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <SupabaseConnectionStatus />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('syncUp.manualSync')}</CardTitle>
            <CardDescription>
              {t('syncUp.manualSyncDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full mb-4"
              onClick={handleFullSync} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {t('syncUp.syncing')}
                </>
              ) : (
                <>
                  <ArrowDownUp className="mr-2 h-4 w-4" />
                  {t('syncUp.syncAllResources')}
                </>
              )}
            </Button>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">{t('syncUp.syncSpecificResources')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {QUERY_KEYS.map(key => (
                  <Button
                    key={key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncSpecificResource(key)}
                    disabled={isLoading}
                  >
                    {key}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start">
            {syncResult.timestamp && (
              <div className="w-full">
                {syncResult.success ? (
                  <Alert variant="default" className="border-green-500 bg-green-500/10 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>{t('syncUp.syncSuccessful')}</AlertTitle>
                    <AlertDescription>
                      {syncResult.message}
                      {syncResult.timestamp && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {syncResult.timestamp.toLocaleTimeString()}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>{t('syncUp.syncFailed')}</AlertTitle>
                    <AlertDescription>
                      {syncResult.message}
                      {syncResult.timestamp && (
                        <div className="text-xs mt-1">
                          {syncResult.timestamp.toLocaleTimeString()}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {syncResult.refreshedResources && syncResult.refreshedResources.length > 0 && (
                  <div className="mt-4 p-3 bg-accent rounded-md text-sm">
                    <p className="font-medium mb-1">{t('syncUp.syncedResources')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {syncResult.refreshedResources.map(resource => (
                        <span key={resource} className="px-2 py-0.5 bg-primary/10 rounded-full text-xs">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 