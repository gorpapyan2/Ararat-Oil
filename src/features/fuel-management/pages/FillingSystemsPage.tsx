import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

// Import UI components
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { useToast } from '@/hooks';
import { Button } from '@/core/components/ui/button';

// Import icon systems
import {
  OperationalIcons,
  ActionIcons,
  StatusIcons,
  NavigationIcons
} from '@/shared/components/ui/icons';

// Import filling system components
import { useFillingSystem } from '@/features/filling-systems/hooks/useFillingSystem';
import { FillingSystemFormStandardized } from '@/features/filling-systems/components/FillingSystemFormStandardized';
import { FillingSystem } from '@/features/filling-systems/types';
import { useDialog } from '@/core/hooks/useDialog';

export default function FillingSystemsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const formDialog = useDialog();
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEditSystem, setSelectedEditSystem] = useState<FillingSystem | null>(null);

  // Get filling systems data
  const { 
    useFillingSystemsQuery, 
    useDeleteFillingSystemMutation 
  } = useFillingSystem();
  
  const {
    data: fillingSystemsData = [],
    isLoading,
    refetch
  } = useFillingSystemsQuery();

  const deleteMutation = useDeleteFillingSystemMutation();

  // Calculate stats
  const fillingSystems = fillingSystemsData || [];
  const totalSystems = fillingSystems.length;
  const activeSystems = fillingSystems.filter(system => system.status === 'active').length;
  const maintenanceSystems = fillingSystems.filter(system => system.status === 'maintenance').length;
  const inactiveSystems = fillingSystems.filter(system => system.status === 'inactive').length;

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: t('modules.fillingSystems.breadcrumbs.home', 'Home'), href: '/' },
    { label: t('modules.fillingSystems.breadcrumbs.fuelManagement', 'Fuel Operations'), href: '/fuel' },
    { label: t('modules.fillingSystems.breadcrumbs.fillingSystems', 'Filling Systems'), href: '/fuel/filling-systems' }
  ];

  // Filter filling systems based on search term and status
  const filteredSystems = useMemo(() => {
    return fillingSystems.filter(system => {
      const matchesSearch = searchTerm === '' || 
        system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || system.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [fillingSystems, searchTerm, selectedStatus]);

  // Handle system deletion
  const handleDeleteSystem = async (id: string) => {
    if (!confirm(t('fillingSystems.deleteConfirmation', 'Are you sure you want to delete this filling system? This action cannot be undone.'))) {
      return;
    }
    
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: t('common.success'),
        message: t('fillingSystems.systemDeleted', 'Filling system deleted successfully'),
        type: 'success'
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        message: t('fillingSystems.deleteError', 'Failed to delete filling system'),
        type: 'error'
      });
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    formDialog.close();
    setSelectedEditSystem(null);
    refetch();
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
          <StatusIcons.Success className="w-3 h-3 mr-1" />
          {t('fillingSystems.status.active', 'Active')}
        </span>;
      case 'maintenance':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
          <StatusIcons.Warning className="w-3 h-3 mr-1" />
          {t('fillingSystems.status.maintenance', 'Maintenance')}
        </span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center">
          <StatusIcons.Error className="w-3 h-3 mr-1" />
          {t('fillingSystems.status.inactive', 'Inactive')}
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">{status}</span>;
    }
  };

  return (
    <WindowContainer
      title={t('fillingSystems.title', 'Filling Systems')}
      subtitle={t('fillingSystems.subtitle', 'Manage your fuel dispensing infrastructure')}
      breadcrumbItems={breadcrumbItems}
    >
      {/* Minimalistic Stats Overview */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span><strong className="text-card-foreground">{totalSystems}</strong> {t('fillingSystems.stats.total', 'total')}</span>
            <span><strong className="text-card-foreground">{activeSystems}</strong> {t('fillingSystems.stats.active', 'active')}</span>
            {maintenanceSystems > 0 && (
              <span className="text-yellow-600"><strong>{maintenanceSystems}</strong> {t('fillingSystems.stats.maintenance', 'in maintenance')}</span>
            )}
            {inactiveSystems > 0 && (
              <span className="text-red-600"><strong>{inactiveSystems}</strong> {t('fillingSystems.stats.inactive', 'inactive')}</span>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => refetch()}
              disabled={isLoading}
              className="p-2 text-muted-foreground hover:text-card-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            >
              <ActionIcons.Refresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => formDialog.open()}
              className="px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
            >
              <ActionIcons.Plus className="w-4 h-4 mr-1 inline" />
              {t('fillingSystems.actions.addNew', 'Add Filling System')}
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
                {t('common.viewModes.grid', 'Grid')}
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
                {t('common.viewModes.table', 'Table')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1.5 text-xs bg-card border border-border rounded text-card-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="all">{t('common.filters.allStatuses', 'All Statuses')}</option>
              <option value="active">{t('fillingSystems.status.active', 'Active')}</option>
              <option value="maintenance">{t('fillingSystems.status.maintenance', 'Maintenance')}</option>
              <option value="inactive">{t('fillingSystems.status.inactive', 'Inactive')}</option>
            </select>
            <div className="relative">
              <ActionIcons.Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('common.search', 'Search...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-2 py-1.5 text-xs bg-card border border-border rounded text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent w-32"
              />
            </div>
            {(selectedStatus !== 'all' || searchTerm) && (
              <button
                onClick={() => {
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
            {isLoading ? t('common.loading', 'Loading...') : `${filteredSystems.length} ${t('common.of', 'of')} ${totalSystems}`}
          </span>
        </div>
      </div>

      {/* Filling Systems Display */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {t('common.loading', 'Loading...')}
          </div>
        ) : filteredSystems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {searchTerm || selectedStatus !== 'all'
              ? t('common.noResults', 'No results found')
              : t('fillingSystems.noSystems', 'No filling systems found')}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredSystems.map((system) => (
              <div
                key={system.id}
                className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <OperationalIcons.Fuel className="w-3 h-3 text-accent-foreground" />
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-card-foreground leading-none">
                        {system.name}
                      </h5>
                      <p className="text-xs text-muted-foreground">ID: {system.id.slice(0, 6)}...</p>
                    </div>
                  </div>
                  
                  <div>
                    {getStatusBadge(system.status)}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1 text-xs text-muted-foreground mb-2">
                  {system.location && (
                    <div className="flex justify-between">
                      <span>{t('fillingSystems.location', 'Location')}:</span>
                      <span className="text-card-foreground">{system.location}</span>
                    </div>
                  )}
                  {system.tank_id && (
                    <div className="flex justify-between">
                      <span>{t('fillingSystems.tankId', 'Tank ID')}:</span>
                      <span className="text-card-foreground">{system.tank_id.slice(0, 8)}...</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{t('fillingSystems.created', 'Created')}:</span>
                    <span className="text-card-foreground">
                      {system.created_at ? new Date(system.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {system.type || 'Standard'}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                      <ActionIcons.Eye className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => setSelectedEditSystem(system)}
                      className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors"
                    >
                      <ActionIcons.Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteSystem(system.id)}
                      className="p-1 text-muted-foreground hover:text-red-600 rounded transition-colors"
                    >
                      <ActionIcons.Delete className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Table View
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('fillingSystems.name', 'Name')}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('fillingSystems.location', 'Location')}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('fillingSystems.status', 'Status')}</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">{t('fillingSystems.tankId', 'Tank')}</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">{t('common.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSystems.map((system) => (
                    <tr key={system.id} className="hover:bg-muted/30">
                      <td className="px-3 py-2 text-xs text-card-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                            <OperationalIcons.Fuel className="w-3 h-3 text-accent-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{system.name}</div>
                            <div className="text-xs text-muted-foreground">#{system.id.slice(0, 6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-card-foreground">{system.location || 'N/A'}</td>
                      <td className="px-3 py-2 text-xs text-card-foreground">
                        {getStatusBadge(system.status)}
                      </td>
                      <td className="px-3 py-2 text-xs text-card-foreground">
                        {system.tank_id ? system.tank_id.slice(0, 8) + '...' : 'N/A'}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors">
                            <ActionIcons.Eye className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setSelectedEditSystem(system)}
                            className="p-1 text-muted-foreground hover:text-card-foreground rounded transition-colors"
                          >
                            <ActionIcons.Edit className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSystem(system.id)}
                            className="p-1 text-muted-foreground hover:text-red-600 rounded transition-colors"
                          >
                            <ActionIcons.Delete className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      <FillingSystemFormStandardized
        open={formDialog.isOpen}
        onOpenChange={formDialog.onOpenChange}
        onSuccess={handleFormSuccess}
      />

      {/* Edit Dialog */}
      {selectedEditSystem && (
        <FillingSystemFormStandardized
          open={!!selectedEditSystem}
          onOpenChange={(open) => !open && setSelectedEditSystem(null)}
          onSuccess={handleFormSuccess}
          fillingSystem={selectedEditSystem}
          mode="edit"
        />
      )}
    </WindowContainer>
  );
}
