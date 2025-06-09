/**
 * Tanks Management Page - Following Employee Page Design Pattern
 * Modern tank management interface with grid/table views and comprehensive filtering
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";
import { Input } from '@/core/components/ui/primitives/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components/ui/select';
import { cn } from '@/shared/utils';
import { useToast } from '@/hooks';

// Optimized icon imports - using centralized icon system
import {
  OperationalIcons,
  ActionIcons,
  StatusIcons,
  NavigationIcons,
  FinanceIcons,
  TimeIcons
} from '@/shared/components/ui/icons';

// Additional specific icons needed
import {
  AlertTriangle,
  Mail,
  Phone,
  Building,
  Calendar,
  X,
  Save,
  MapPin,
  Gauge,
  Activity,
  Settings,
  History,
  CheckCircle,
  XCircle
} from 'lucide-react';

import { 
  useTanksManager
} from '@/shared/hooks/useTanks';
import type { Tank, TankCreate, TankUpdate } from '@/shared/types/tank.types';
import { TankFormDialog } from '@/shared/components/forms/TankFormDialog';

const fuelTypes = ['Diesel', 'Petrol', 'Premium', 'Gas Oil', 'Heating Oil'];
const locations = ['Main Station', 'North Side', 'South Side', 'Underground', 'Service Area'];

export default function TanksPage() {
  const { t } = useTranslation();
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTank, setEditingTank] = useState<Tank | null>(null);
  
  // Use combined hook for better performance
  const {
    tanks,
    fuelTypes: fuelTypesData,
    summary,
    isLoading: loading,
    createTank,
    updateTank,
    deleteTank,
    refetchAll
  } = useTanksManager();

  const { toast } = useToast();

  const breadcrumbItems = [
    { label: t('modules.tanks.breadcrumbs.home'), href: '/' },
    { label: t('modules.tanks.breadcrumbs.fuelManagement'), href: '/fuel' },
    { label: t('modules.tanks.breadcrumbs.tanksManagement'), href: '/fuel/tanks' }
  ];

  const formatVolume = (volume: number) => {
    return `${volume.toLocaleString()}L`;
  };

  const getCapacityPercentage = (currentLevel: number, capacity: number) => {
    return Math.round((currentLevel / capacity) * 100);
  };

  // Ensure tanks is always an array
  const tanksArray = Array.isArray(tanks) ? tanks : [];

  // Calculate stats for the overview cards
  const totalTanks = tanksArray.length;
  const activeTanks = tanksArray.filter(tank => tank.is_active).length;
  const totalCapacity = tanksArray.reduce((sum, tank) => sum + tank.capacity, 0);
  const totalCurrentLevel = tanksArray.reduce((sum, tank) => sum + tank.current_level, 0);
  const criticalTanks = tanksArray.filter(tank => getCapacityPercentage(tank.current_level, tank.capacity) < 10).length;
  const lowLevelTanks = tanksArray.filter(tank => getCapacityPercentage(tank.current_level, tank.capacity) < 25).length;
  const fillPercentage = totalCapacity > 0 ? Math.round((totalCurrentLevel / totalCapacity) * 100) : 0;

  const quickStats = [
    {
      title: t('modules.tanks.stats.totalTanks'),
      value: totalTanks.toString(),
      icon: OperationalIcons.Database,
      color: 'blue' as const,
      description: `${activeTanks} ${t('modules.tanks.stats.activeTanks')}`
    },
    {
      title: t('modules.tanks.stats.totalCapacity'),
      value: formatVolume(totalCapacity),
      icon: OperationalIcons.Package,
      color: 'purple' as const,
      description: t('modules.tanks.stats.maximumStorage')
    },
    {
      title: t('modules.tanks.stats.currentVolume'),
      value: formatVolume(totalCurrentLevel),
      icon: FinanceIcons.TrendingUp,
      color: 'green' as const,
      description: `${fillPercentage}% ${t('modules.tanks.stats.filled')}`
    },
    {
      title: t('modules.tanks.stats.alertTanks'),
      value: (criticalTanks + lowLevelTanks).toString(),
      icon: StatusIcons.Alert,
      color: 'orange' as const,
      description: `${criticalTanks} ${t('modules.tanks.stats.critical')}, ${lowLevelTanks} ${t('modules.tanks.stats.low')}`
    }
  ];

  const getStatusColor = (tank: Tank) => {
    const fillPercentage = (tank.current_level / tank.capacity) * 100;
    
    if (fillPercentage < 10) {
      return 'bg-red-50 text-red-700 border-red-200';
    } else if (fillPercentage < 25) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    } else {
      return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const getStatusIcon = (tank: Tank) => {
    const fillPercentage = (tank.current_level / tank.capacity) * 100;
    
    if (fillPercentage < 10) {
      return <StatusIcons.Alert className="w-4 h-4" />;
    } else if (fillPercentage < 25) {
      return <AlertTriangle className="w-4 h-4" />;
    } else {
      return <StatusIcons.Success className="w-4 h-4" />;
    }
  };

  const getStatusText = (tank: Tank) => {
    const fillPercentage = (tank.current_level / tank.capacity) * 100;
    
    if (fillPercentage < 10) {
      return 'Վերջնական';
    } else if (fillPercentage < 25) {
      return 'Ցածր';
    } else {
      return 'Լավ';
    }
  };

  const getFuelTypeIcon = (fuelTypeName: string) => {
    const type = fuelTypeName?.toLowerCase();
    if (type?.includes('diesel')) return OperationalIcons.Fuel;
    if (type?.includes('petrol') || type?.includes('gasoline')) return OperationalIcons.Gauge;
    if (type?.includes('premium')) return Activity;
    return OperationalIcons.Fuel;
  };

  // Get unique fuel types for filter
  const fuelTypesForFilter = [...new Set(tanksArray.map(tank => tank.fuel_type?.name).filter((name): name is string => Boolean(name)))];

  // Filter tanks based on search and filters
  const filteredTanks = tanksArray.filter(tank => {
    const matchesSearch = 
      tank.fuel_type?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFuelType = selectedFuelType === 'all' || 
                           tank.fuel_type?.name === selectedFuelType;
    
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && tank.is_active) ||
                         (selectedStatus === 'inactive' && !tank.is_active);
    
    return matchesSearch && matchesFuelType && matchesStatus;
  });

  const handleSuccessClose = () => {
    setShowCreateModal(false);
    setEditingTank(null);
    refetchAll();
  };

  const handleDeleteTank = async (tankId: string) => {
    if (!confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս բակը:')) return;
    
    try {
      await deleteTank.mutateAsync(tankId);
      toast({
        type: 'success',
        title: 'Բակը ջնջվեց',
        message: 'Բակը հաջողությամբ ջնջվել է:'
      });
    } catch (error) {
      toast({
        type: 'error',
        title: 'Սխալ',
        message: 'Բակի ջնջումը ձախողվեց:'
      });
    }
  };

  return (
    <WindowContainer
      title={t('modules.tanks.title')}
      subtitle={t('modules.tanks.subtitle')}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Minimalistic Stats Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span><strong className="text-card-foreground">{totalTanks}</strong> բակ</span>
            <span><strong className="text-card-foreground">{activeTanks}</strong> ակտիվ</span>
            <span><strong className="text-card-foreground">{fillPercentage}%</strong> լցված</span>
            {(criticalTanks + lowLevelTanks) > 0 && (
              <span className="text-orange-600"><strong>{criticalTanks + lowLevelTanks}</strong> նախազգուշացում</span>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => refetchAll()}
              disabled={loading}
              className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <ActionIcons.Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <ActionIcons.Plus className="w-4 h-4 mr-1 inline" />
              {t('modules.tanks.actions.addNewTank')}
            </button>
          </div>
        </div>
      </div>

      {/* Simplified Filters */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex bg-muted rounded-md p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <NavigationIcons.Grid className="h-3 w-3 mr-1 inline" />
                Ցանց
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <NavigationIcons.Table className="h-3 w-3 mr-1 inline" />
                Աղյուսակ
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
              className="px-2 py-1.5 text-xs bg-card border border-border rounded text-card-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">Բոլոր տեսակները</option>
              {fuelTypesForFilter.map((fuelType) => (
                <option key={fuelType} value={fuelType}>{fuelType}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1.5 text-xs bg-card border border-border rounded text-card-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">Բոլոր կարգավիճակները</option>
              <option value="active">Ակտիվ</option>
              <option value="inactive">Ոչ ակտիվ</option>
            </select>
            <div className="relative">
              <ActionIcons.Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Որոնել..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-2 py-1.5 text-xs bg-card border border-border rounded text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent w-32"
              />
            </div>
            {(selectedFuelType !== 'all' || selectedStatus !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedFuelType('all');
                  setSelectedStatus('all');
                  setSearchTerm('');
                }}
                className="p-1.5 text-muted-foreground hover:text-card-foreground rounded transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {loading ? 'Բեռնվում է...' : `${filteredTanks.length} -ից ${tanks.length}`}
          </span>
        </div>
      </div>

      {/* Tank Display */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Բեռնվում է...
          </div>
        ) : filteredTanks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchTerm || selectedFuelType !== 'all' || selectedStatus !== 'all'
              ? 'Արդյունքներ չեն գտնվել'
              : 'Բակեր չեն գտնվել'}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {filteredTanks.map((tank) => {
              const fillPercentage = tank.capacity > 0 ? (tank.current_level / tank.capacity) * 100 : 0;
              const FuelIcon = getFuelTypeIcon(tank.fuel_type?.name || '');
              
              return (
                <div
                  key={tank.id}
                  className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <FuelIcon className="w-3 h-3 text-accent-foreground" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-card-foreground leading-none">
                          {tank.fuel_type?.name || 'Unknown'}
                        </h5>
                        <p className="text-xs text-muted-foreground">Բակ #{tank.id.slice(0, 6)}</p>
                      </div>
                    </div>
                    
                    <div className={`px-1.5 py-0.5 rounded text-xs flex items-center gap-1 ${getStatusColor(tank)}`}>
                      {getStatusIcon(tank)}
                      {getStatusText(tank)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-1 text-xs text-muted-foreground mb-2">
                    <div className="flex justify-between">
                      <span>Տարողություն:</span>
                      <span className="text-card-foreground">{formatVolume(tank.capacity)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ընթացիկ:</span>
                      <span className="text-card-foreground">{formatVolume(tank.current_level)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Մակարդակ:</span>
                      <span className={`font-medium ${
                        fillPercentage < 10 ? 'text-red-600' :
                        fillPercentage < 25 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {fillPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-1.5 mb-2">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        fillPercentage < 10 ? 'bg-red-500' :
                        fillPercentage < 25 ? 'bg-yellow-500' :
                        fillPercentage < 50 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                    ></div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {tank.id.slice(0, 6)}...
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                        <ActionIcons.Eye className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setEditingTank(tank)}
                        className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors"
                      >
                        <ActionIcons.Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTank(tank.id)}
                        className="p-1 text-muted-foreground hover:text-red-600 rounded transition-colors"
                      >
                        <ActionIcons.Delete className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Simplified Table View
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Բակ</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Վառելիք</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Զգուշացում</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Տարողություն</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Մակարդակ</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">Գործողություններ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTanks.map((tank) => {
                    const fillPercentage = tank.capacity > 0 ? (tank.current_level / tank.capacity) * 100 : 0;
                    const FuelIcon = getFuelTypeIcon(tank.fuel_type?.name || '');
                    
                    return (
                      <tr key={tank.id} className="hover:bg-muted/30">
                        <td className="px-3 py-2 text-xs text-card-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                              <FuelIcon className="w-3 h-3 text-accent-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{tank.fuel_type?.name || 'Unknown'}</div>
                              <div className="text-xs text-muted-foreground">#{tank.id.slice(0, 6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs text-card-foreground">{tank.fuel_type?.name || 'Unknown'}</td>
                        <td className="px-3 py-2 text-xs text-card-foreground">
                          <div className={`px-1.5 py-0.5 rounded text-xs flex items-center gap-1 w-fit ${getStatusColor(tank)}`}>
                            {getStatusIcon(tank)}
                            {getStatusText(tank)}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs text-card-foreground">{formatVolume(tank.capacity)}</td>
                        <td className="px-3 py-2 text-xs text-card-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-10 bg-muted rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  fillPercentage < 10 ? 'bg-red-500' :
                                  fillPercentage < 25 ? 'bg-yellow-500' :
                                  fillPercentage < 50 ? 'bg-blue-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${
                              fillPercentage < 10 ? 'text-red-600' :
                              fillPercentage < 25 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {fillPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-xs">
                          <div className="flex items-center justify-center gap-1">
                            <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                              <ActionIcons.Eye className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => setEditingTank(tank)}
                              className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors"
                            >
                              <ActionIcons.Edit className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTank(tank.id)}
                              className="p-1 text-muted-foreground hover:text-red-600 rounded transition-colors"
                            >
                              <ActionIcons.Delete className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Tank Dialog */}
      <TankFormDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={handleSuccessClose}
        mode="create"
      />

      {/* Edit Tank Dialog */}
      <TankFormDialog
        open={!!editingTank}
        onOpenChange={(open) => !open && setEditingTank(null)}
        onSuccess={handleSuccessClose}
        tank={editingTank}
        mode="edit"
      />
    </WindowContainer>
  );
}
