import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  RefreshCw,
  Database,
  Cloud,
  Server,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Settings,
  Play,
  Pause,
  MoreVertical,
  Activity,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Shield
} from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Switch } from '@/core/components/ui/switch';
import { Progress } from '@/core/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/core/components/ui/tabs';
import { Badge } from '@/core/components/ui/primitives/badge';
import { cn } from '@/shared/utils';

interface SyncConnection {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'cloud';
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSync: Date;
  nextSync: Date;
  recordsCount: number;
  syncProgress: number;
  enabled: boolean;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

interface SyncActivity {
  id: string;
  connectionId: string;
  connectionName: string;
  action: 'sync' | 'import' | 'export' | 'backup';
  status: 'completed' | 'failed' | 'running';
  timestamp: Date;
  recordsProcessed: number;
  duration: number;
  details?: string;
}

export function DataSyncPage() {
  const { t } = useTranslation();
  const [connections, setConnections] = useState<SyncConnection[]>([]);
  const [activities, setActivities] = useState<SyncActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data initialization
  useEffect(() => {
    setConnections([
      {
        id: 'fuel_system',
        name: 'Fuel Management System',
        type: 'database',
        status: 'connected',
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        nextSync: new Date(Date.now() + 45 * 60 * 1000),
        recordsCount: 15420,
        syncProgress: 100,
        enabled: true,
        frequency: 'hourly'
      },
      {
        id: 'pos_system',
        name: 'Point of Sale Integration',
        type: 'api',
        status: 'syncing',
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        nextSync: new Date(Date.now() + 58 * 60 * 1000),
        recordsCount: 8945,
        syncProgress: 65,
        enabled: true,
        frequency: 'realtime'
      },
      {
        id: 'financial_data',
        name: 'Financial Reports Backup',
        type: 'cloud',
        status: 'connected',
        lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000),
        nextSync: new Date(Date.now() + 18 * 60 * 60 * 1000),
        recordsCount: 3256,
        syncProgress: 100,
        enabled: true,
        frequency: 'daily'
      },
      {
        id: 'inventory_sync',
        name: 'Inventory Management',
        type: 'database',
        status: 'error',
        lastSync: new Date(Date.now() - 3 * 60 * 60 * 1000),
        nextSync: new Date(Date.now() + 60 * 60 * 1000),
        recordsCount: 12789,
        syncProgress: 0,
        enabled: false,
        frequency: 'hourly'
      }
    ]);

    setActivities([
      {
        id: '1',
        connectionId: 'fuel_system',
        connectionName: 'Fuel Management System',
        action: 'sync',
        status: 'completed',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        recordsProcessed: 245,
        duration: 8500
      },
      {
        id: '2',
        connectionId: 'pos_system',
        connectionName: 'Point of Sale Integration',
        action: 'sync',
        status: 'running',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        recordsProcessed: 156,
        duration: 0
      },
      {
        id: '3',
        connectionId: 'financial_data',
        connectionName: 'Financial Reports Backup',
        action: 'backup',
        status: 'completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        recordsProcessed: 89,
        duration: 15200
      },
      {
        id: '4',
        connectionId: 'inventory_sync',
        connectionName: 'Inventory Management',
        action: 'sync',
        status: 'failed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        recordsProcessed: 0,
        duration: 0,
        details: 'Connection timeout after 30 seconds'
      }
    ]);
  }, []);

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'database': return Database;
      case 'api': return RefreshCw;
      case 'file': return DollarSign;
      case 'cloud': return Cloud;
      default: return Server;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'syncing': return RefreshCw;
      case 'error': return AlertCircle;
      case 'disconnected': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'syncing': return 'text-blue-500';
      case 'error': return 'text-red-500';
      case 'disconnected': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'sync': return RefreshCw;
      case 'import': return DollarSign;
      case 'export': return TrendingUp;
      case 'backup': return AlertTriangle;
      default: return Activity;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return 'Running...';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const toggleConnection = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id ? { ...conn, enabled: !conn.enabled } : conn
    ));
  };

  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const syncingCount = connections.filter(c => c.status === 'syncing').length;
  const errorCount = connections.filter(c => c.status === 'error').length;
  const totalRecords = connections.reduce((sum, conn) => sum + conn.recordsCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Data Synchronization Center
            </h1>
            <p className="text-muted-foreground">
              Manage data flows, integrations, and synchronization across all systems
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRefreshAll} 
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh All
            </Button>
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {connectedCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connected Systems
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Running
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {syncingCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Syncing Now
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <Database className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    Records
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {totalRecords.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Records
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    Issues
                  </Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {errorCount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connection Errors
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections">Sync Connections</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="mt-6">
            <div className="space-y-4">
              {connections.map((connection, index) => {
                const ConnectionIcon = getConnectionIcon(connection.type);
                const StatusIcon = getStatusIcon(connection.status);
                
                return (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 rounded-lg bg-primary/10">
                              <ConnectionIcon className="w-6 h-6 text-primary" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-foreground">
                                  {connection.name}
                                </h3>
                                <StatusIcon className={cn(
                                  "w-4 h-4",
                                  getStatusColor(connection.status),
                                  connection.status === 'syncing' && "animate-spin"
                                )} />
                                <Badge 
                                  variant={connection.status === 'error' ? 'destructive' : 'secondary'}
                                  className="capitalize"
                                >
                                  {connection.status}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div>
                                  <span className="font-medium">Last Sync:</span>{' '}
                                  {formatLastSync(connection.lastSync)}
                                </div>
                                <div>
                                  <span className="font-medium">Records:</span>{' '}
                                  {connection.recordsCount.toLocaleString()}
                                </div>
                                <div>
                                  <span className="font-medium">Frequency:</span>{' '}
                                  <span className="capitalize">{connection.frequency}</span>
                                </div>
                              </div>
                              
                              {connection.status === 'syncing' && (
                                <div className="mt-3">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Sync Progress</span>
                                    <span>{connection.syncProgress}%</span>
                                  </div>
                                  <Progress value={connection.syncProgress} className="h-2" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={connection.enabled}
                              onCheckedChange={() => toggleConnection(connection.id)}
                            />
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Recent Sync Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity, index) => {
                    const ActionIcon = getActionIcon(activity.action);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-2 rounded-lg",
                            activity.status === 'completed' && "bg-green-100 dark:bg-green-900/20",
                            activity.status === 'failed' && "bg-red-100 dark:bg-red-900/20",
                            activity.status === 'running' && "bg-blue-100 dark:bg-blue-900/20"
                          )}>
                            <ActionIcon className={cn(
                              "w-4 h-4",
                              activity.status === 'completed' && "text-green-600",
                              activity.status === 'failed' && "text-red-600",
                              activity.status === 'running' && "text-blue-600"
                            )} />
                          </div>
                          
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-medium">{activity.connectionName}</p>
                              <Badge 
                                variant={
                                  activity.status === 'completed' ? 'default' :
                                  activity.status === 'failed' ? 'destructive' : 'secondary'
                                }
                                className="capitalize"
                              >
                                {activity.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.action === 'sync' && 'Data synchronization'}
                              {activity.action === 'import' && 'Data import'}
                              {activity.action === 'export' && 'Data export'}
                              {activity.action === 'backup' && 'Data backup'}
                              {' • '}
                              {activity.recordsProcessed} records
                              {activity.details && ` • ${activity.details}`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{formatLastSync(activity.timestamp)}</div>
                          <div>{formatDuration(activity.duration)}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-500" />
                    Global Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-retry failed syncs</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically retry failed synchronizations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Real-time notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about sync status changes
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data compression</p>
                      <p className="text-sm text-muted-foreground">
                        Compress data during transmission
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Security & Backup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">Last Backup</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                    <Button size="sm" variant="outline">
                      Create Backup Now
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Encryption Status</p>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">All connections encrypted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 