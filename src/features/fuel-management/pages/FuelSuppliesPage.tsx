/**
 * Fuel Supplies Management Page
 * Following the same patterns as management employees page
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/core/components/ui/button';
import { PlusCircle, X, Save, AlertCircle, Package, CheckCircle } from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { StatsCard } from '@/shared/components/cards';
import { useTranslation } from 'react-i18next';

// Import the separated components
import { FuelSuppliesMetrics } from '@/features/fuel-management/components/FuelSuppliesMetrics';
import { FuelSuppliesFilters, SupplyFilters } from '@/features/fuel-management/components/FuelSuppliesFilters';
import { FuelSuppliesTable, SupplyListItem } from '@/features/fuel-management/components/FuelSuppliesTable';
import { CreateSupplyDialog, CreateSupplyData } from '@/features/fuel-management/components/CreateSupplyDialog';

// Import our custom hook for fuel supplies data
import { useFuelSupplies } from '@/features/fuel-management/hooks/useFuelSupplies';

// API imports for form data
import { petrolProvidersApi } from '@/core/api/endpoints/petrol-providers';
import { tanksApi } from '@/core/api/endpoints/tanks';
import { fuelSuppliesApi } from '@/core/api/endpoints/fuel-supplies';
import { Tank, PetrolProvider } from '@/core/api/types';

// Optimized icon imports - using centralized icon system
import {
  UserIcons,
  ActionIcons,
  StatusIcons,
  NavigationIcons,
  FinanceIcons,
  TimeIcons
} from '@/shared/components/ui/icons';

// Fuel types constants
const fuelTypes = ['Gasoline', 'Diesel', 'LPG', 'Electric', 'Hybrid'];
const paymentStatuses = ['paid', 'pending', 'cancelled'];

// Performance monitoring for dev mode
const PAGE_RENDERS = { count: 0 };

export const FuelSuppliesPage: React.FC = () => {
  // Track render count in development
  const renderCount = useRef(0);
  
  if (import.meta.env.DEV) {
    renderCount.current++;
    PAGE_RENDERS.count++;
    console.log(`[FuelSuppliesPage] Render #${renderCount.current} (total: ${PAGE_RENDERS.count})`);
  }
  
  // Initialize i18n
  const { t } = useTranslation();
  
  // Use our custom hook for data fetching with built-in caching
  const { supplies, isLoading, error, refreshData } = useFuelSupplies();
  
  // View mode state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form data - only load when dialog opens
  const [providers, setProviders] = useState<PetrolProvider[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [formDataLoaded, setFormDataLoaded] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<SupplyFilters>({
    status: 'all',
    fuelType: 'all',
    search: '',
    showPast: false,
  });

  const [createSupplyData, setCreateSupplyData] = useState<CreateSupplyData>({
    provider_id: '',
    tank_id: '',
    quantity_liters: 0,
    price_per_liter: 0,
    delivery_date: new Date().toISOString().slice(0, 16),
    comments: '',
    payment_status: 'pending',
  });

  // Add state for editing supply
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupply, setCurrentSupply] = useState<SupplyListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [supplyToDelete, setSupplyToDelete] = useState<SupplyListItem | null>(null);

  // Only load supplies on mount, not on every render
  useEffect(() => {
    // No need to call loadSupplies as useFuelSupplies already handles initial data loading
    if (import.meta.env.DEV) {
      console.log('[FuelSuppliesPage] Mount effect executed');
    }
  }, []);

  const loadSupplies = useCallback(async () => {
    if (import.meta.env.DEV) {
      console.log('[FuelSuppliesPage] loadSupplies called');
    }
    try {
      await refreshData();
    } catch (error) {
      console.error('Failed to load supplies:', error);
    }
  }, [refreshData]);

  const loadFormData = useCallback(async () => {
    if (import.meta.env.DEV) {
      console.log('[FuelSuppliesPage] loadFormData called, formDataLoaded:', formDataLoaded);
    }
    
    if (formDataLoaded) return; // Don't reload if already loaded
    
    try {
      setFormDataLoaded(true); // Set flag first to prevent duplicate calls
      
      // Load providers and tanks data for the create form in sequence to prevent parallel requests
      const providersResponse = await petrolProvidersApi.getPetrolProviders();
      if (providersResponse.data) {
        setProviders(providersResponse.data);
      } else {
        console.error('Error loading providers:', providersResponse.error);
        setProviders([]);
      }

      const tanksResponse = await tanksApi.getTanks();
      if (tanksResponse.data) {
        setTanks(tanksResponse.data);
      } else {
        console.error('Error loading tanks:', tanksResponse.error);
        setTanks([]);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      setProviders([]);
      setTanks([]);
      // Reset flag if loading fails so we can retry
      setFormDataLoaded(false);
    }
  }, [formDataLoaded]);

  // Load form data when dialog opens
  React.useEffect(() => {
    if ((isCreateDialogOpen || showCreateModal) && !formDataLoaded) {
      if (import.meta.env.DEV) {
        console.log('[FuelSuppliesPage] Dialog open effect - loading form data');
      }
      loadFormData();
    }
  }, [isCreateDialogOpen, showCreateModal, formDataLoaded, loadFormData]);

  const handleCreateSupply = async () => {
    try {
      setIsCreating(true);
      
      // Validate required fields
      if (!createSupplyData.provider_id) {
        alert(t('fuelSupplies.modal.validation.selectProvider'));
        setIsCreating(false);
        return;
      }
      
      if (!createSupplyData.tank_id) {
        alert(t('fuelSupplies.modal.validation.selectTank'));
        setIsCreating(false);
        return;
      }
      
      if (!createSupplyData.quantity_liters || createSupplyData.quantity_liters <= 0) {
        alert(t('fuelSupplies.modal.validation.enterValidQuantity'));
        setIsCreating(false);
        return;
      }
      
      if (!createSupplyData.price_per_liter || createSupplyData.price_per_liter <= 0) {
        alert(t('fuelSupplies.modal.validation.enterValidPrice'));
        setIsCreating(false);
        return;
      }
      
      if (!createSupplyData.delivery_date) {
        alert(t('fuelSupplies.modal.validation.enterValidDate'));
        setIsCreating(false);
        return;
      }
      
      // Calculate total_cost if not provided and format payload exactly as per FuelSupplyCreate type
      const totalCost = createSupplyData.quantity_liters * createSupplyData.price_per_liter;
      
      // Ensure delivery_date is in ISO format
      let formattedDeliveryDate = createSupplyData.delivery_date;
      try {
        // Handle both date-time and date-only inputs
        if (!formattedDeliveryDate.includes('T')) {
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        } else if (!formattedDeliveryDate.includes('Z')) {
          // Append Z if it's missing to indicate UTC time
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        }
      } catch (e) {
        console.error('Error formatting delivery date:', e);
        // Fallback to current date if there's an error
        formattedDeliveryDate = new Date().toISOString();
      }
      
      const supplyData = {
        provider_id: createSupplyData.provider_id,
        tank_id: createSupplyData.tank_id,
        quantity_liters: Number(createSupplyData.quantity_liters),
        price_per_liter: Number(createSupplyData.price_per_liter),
        total_cost: Number(totalCost.toFixed(2)),
        delivery_date: formattedDeliveryDate,
        payment_status: createSupplyData.payment_status || 'pending',
        comments: createSupplyData.comments || ''
      };
      
      // Debug info always in console for troubleshooting
      console.log('Creating supply with data:', JSON.stringify(supplyData, null, 2));
      
      // Send API request to create supply
      const response = await fuelSuppliesApi.createFuelSupply(supplyData);
      
      // Log the full response for debugging
      console.log('Create supply response:', JSON.stringify(response, null, 2));
      
      if (response.data) {
        // Show success message
        alert(t('fuelSupplies.modal.createSuccess'));
        
        // Refresh supplies list and reset create form
        refreshData();
      setCreateSupplyData({
        provider_id: '',
        tank_id: '',
        quantity_liters: 0,
        price_per_liter: 0,
        delivery_date: new Date().toISOString().slice(0, 16),
        comments: '',
        payment_status: 'pending',
      });
      
        // Close dialogs
        setIsCreateDialogOpen(false);
        setShowCreateModal(false);
      } else {
        // Show error message
        alert(t('fuelSupplies.modal.createError') + ': ' + response.error?.message || t('common.unknownError'));
      }
    } catch (error) {
      console.error('Error creating supply:', error);
      alert(t('fuelSupplies.modal.createError'));
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewSupply = (supply: SupplyListItem) => {
    // Implement view supply functionality
    console.log('View supply:', supply);
  };

  // Handler for editing a supply
  const handleEditSupply = (supply: SupplyListItem) => {
    // Set the current supply for editing
    setCurrentSupply(supply);
    
    // Find provider and tank from the data in supply
    const tank = tanks.find(t => t.fuel_type?.name === supply.fuelType);
    const provider = providers.find(p => p.name === supply.supplier);
    
    // Convert the supply data to the format expected by the dialog
    setCreateSupplyData({
      provider_id: provider?.id || '',
      tank_id: tank?.id || '',
      quantity_liters: supply.quantity,
      price_per_liter: supply.pricePerLiter,
      delivery_date: new Date(supply.deliveryDate).toISOString().slice(0, 16),
      comments: '',
      payment_status: 'pending',
    });
    
    // Make sure form data is loaded
    if (!formDataLoaded) {
      loadFormData();
    }
    
    // Open the edit dialog
    setIsEditDialogOpen(true);
  };
  
  // Handler for updating a supply
  const handleUpdateSupply = async () => {
    if (!currentSupply) return;
    
    try {
      setIsEditing(true);
      
      // Validate required fields (similar to create)
      if (!createSupplyData.provider_id) {
        alert(t('fuelSupplies.modal.validation.selectProvider'));
        setIsEditing(false);
        return;
      }
      
      if (!createSupplyData.tank_id) {
        alert(t('fuelSupplies.modal.validation.selectTank'));
        setIsEditing(false);
        return;
      }
      
      if (!createSupplyData.quantity_liters || createSupplyData.quantity_liters <= 0) {
        alert(t('fuelSupplies.modal.validation.enterValidQuantity'));
        setIsEditing(false);
        return;
      }
      
      if (!createSupplyData.price_per_liter || createSupplyData.price_per_liter <= 0) {
        alert(t('fuelSupplies.modal.validation.enterValidPrice'));
        setIsEditing(false);
        return;
      }
      
      if (!createSupplyData.delivery_date) {
        alert(t('fuelSupplies.modal.validation.enterValidDate'));
        setIsEditing(false);
        return;
      }
      
      // Calculate total_cost and prepare update data
      const totalCost = createSupplyData.quantity_liters * createSupplyData.price_per_liter;
      
      // Ensure delivery_date is in ISO format
      let formattedDeliveryDate = createSupplyData.delivery_date;
      try {
        // Handle both date-time and date-only inputs
        if (!formattedDeliveryDate.includes('T')) {
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        } else if (!formattedDeliveryDate.includes('Z')) {
          // Append Z if it's missing to indicate UTC time
          formattedDeliveryDate = new Date(formattedDeliveryDate).toISOString();
        }
      } catch (e) {
        console.error('Error formatting delivery date:', e);
        // Fallback to current date if there's an error
        formattedDeliveryDate = new Date().toISOString();
      }
      
      const supplyData = {
        provider_id: createSupplyData.provider_id,
        tank_id: createSupplyData.tank_id,
        quantity_liters: Number(createSupplyData.quantity_liters),
        price_per_liter: Number(createSupplyData.price_per_liter),
        total_cost: Number(totalCost.toFixed(2)),
        delivery_date: formattedDeliveryDate,
        payment_status: createSupplyData.payment_status || 'pending',
        comments: createSupplyData.comments || ''
      };
      
      // Debug info always in console for troubleshooting
      console.log('Updating supply with data:', JSON.stringify(supplyData, null, 2));
      
      // Send API request to update supply
      const response = await fuelSuppliesApi.updateFuelSupply(currentSupply.id, supplyData);
      
      // Log the full response for debugging
      console.log('Update supply response:', JSON.stringify(response, null, 2));
      
      if (response.data) {
        // Show success message
        alert(t('fuelSupplies.modal.updateSuccess', 'Supply updated successfully'));
        
        // Refresh supplies list and reset form
        refreshData();
        setCreateSupplyData({
          provider_id: '',
          tank_id: '',
          quantity_liters: 0,
          price_per_liter: 0,
          delivery_date: new Date().toISOString().slice(0, 16),
          comments: '',
          payment_status: 'pending',
        });
        
        // Close dialogs
        setIsEditDialogOpen(false);
        setCurrentSupply(null);
      } else {
        // Show error message
        alert(t('fuelSupplies.modal.updateError', 'Error updating supply') + ': ' + response.error?.message || t('common.unknownError'));
      }
    } catch (error) {
      console.error('Error updating supply:', error);
      alert(t('fuelSupplies.modal.updateError', 'Error updating supply'));
    } finally {
      setIsEditing(false);
    }
  };
  
  // Handler for initiating deletion of a supply
  const handleDeleteSupply = (supply: SupplyListItem) => {
    setSupplyToDelete(supply);
    setShowDeleteConfirm(true);
  };
  
  // Handler for confirming deletion of a supply
  const confirmDeleteSupply = async () => {
    if (!supplyToDelete) return;
    
    try {
      setIsDeleting(true);
      
      // Send API request to delete supply
      const response = await fuelSuppliesApi.deleteFuelSupply(supplyToDelete.id);
      
      if (response.data?.success) {
        // Show success message
        alert(t('fuelSupplies.modal.deleteSuccess', 'Supply deleted successfully'));
        
        // Refresh supplies list
        refreshData();
      } else {
        // Show error message
        alert(t('fuelSupplies.modal.deleteError', 'Error deleting supply') + ': ' + response.error?.message || t('common.unknownError'));
      }
    } catch (error) {
      console.error('Error deleting supply:', error);
      alert(t('fuelSupplies.modal.deleteError', 'Error deleting supply'));
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setSupplyToDelete(null);
    }
  };

  // Calculate metrics for quick stats
  const totalSupplies = supplies?.length || 0;
  const pendingSupplies = supplies?.filter(s => s.status === 'pending').length || 0;
  const receivedSupplies = supplies?.filter(s => s.status === 'received').length || 0;
  const verifiedSupplies = supplies?.filter(s => s.status === 'verified').length || 0;

  const quickStats = [
    {
      title: 'Total Supplies',
      value: totalSupplies.toString(),
      icon: Package,
      color: 'blue' as const,
      description: 'All fuel deliveries'
    },
    {
      title: 'Pending Deliveries',
      value: pendingSupplies.toString(),
      icon: TimeIcons.Clock,
      color: 'orange' as const,
      description: 'Awaiting delivery'
    },
    {
      title: 'Received',
      value: receivedSupplies.toString(),
      icon: StatusIcons.Success,
      color: 'green' as const,
      description: 'Successfully delivered'
    },
    {
      title: 'Verified',
      value: verifiedSupplies.toString(),
      icon: CheckCircle,
      color: 'purple' as const,
      description: 'Confirmed deliveries'
    }
  ];

  // Status styling helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'verified':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <StatusIcons.Success className="w-4 h-4" />;
      case 'pending':
        return <TimeIcons.Clock className="w-4 h-4" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Filter supplies based on filter criteria
  const filteredSupplies = useMemo(() => {
    if (!supplies || supplies.length === 0) {
      return [];
    }
    
    return supplies.filter(supply => {
      // Apply status filter if it's not 'all'
      if (filters.status !== 'all' && supply.status !== filters.status) {
        return false;
      }
      
      // Apply fuel type filter if it's not 'all'
      if (filters.fuelType !== 'all' && supply.fuelType !== filters.fuelType) {
        return false;
      }
      
      // Apply search filter if there's a search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          supply.supplier.toLowerCase().includes(searchLower) ||
          supply.fuelType.toLowerCase().includes(searchLower)
        );
      }
      
      // If we get here, the supply passes all filters
      return true;
    });
  }, [supplies, filters]);

  const handleViewModeChange = useCallback((mode: 'grid' | 'table') => {
    if (import.meta.env.DEV) {
      console.log(`[FuelSuppliesPage] View mode changed to ${mode}`);
    }
    setViewMode(mode);
  }, []);

  const handleFiltersChange = useCallback((newFilters: SupplyFilters) => {
    if (import.meta.env.DEV) {
      console.log('[FuelSuppliesPage] Filters changed:', newFilters);
    }
    setFilters(newFilters);
  }, []);

  return (
    <WindowContainer 
      title={t('fuelSupplies.title')} 
      subtitle={t('fuelSupplies.subtitle')}
      breadcrumbItems={[
        { label: t('dashboard.title'), href: '/' },
        { label: t('navigation.fuelManagement'), href: '/fuel-management' },
        { label: t('fuelSupplies.title'), href: '/fuel-management/supplies' },
      ]}
    >
      <div className="space-y-6">
        {/* Quick Stats Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-black dark:text-[#EEEFE7]">
              {t('fuelSupplies.overview')}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={loadSupplies}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card border border-border rounded-lg hover:shadow-md transition-all duration-200 disabled:opacity-50"
              >
                <ActionIcons.Refresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {t('common.refresh')}
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-200"
              >
                <PlusCircle className="w-4 h-4" />
                {t('fuelSupplies.addSupply')}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                description={stat.description}
              />
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <NavigationIcons.Grid className="h-4 w-4 mr-2 inline" />
                {t('fuelSupplies.view.grid')}
              </button>
              <button
                onClick={() => handleViewModeChange('table')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-card text-card-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <NavigationIcons.Table className="h-4 w-4 mr-2 inline" />
                {t('fuelSupplies.view.table')}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filters.fuelType}
                onChange={(e) => handleFiltersChange({...filters, fuelType: e.target.value})}
                className="px-3 py-2 bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">{t('fuelSupplies.filters.allFuelTypes')}</option>
                {fuelTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => handleFiltersChange({...filters, status: e.target.value})}
                className="px-3 py-2 bg-card border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">{t('fuelSupplies.status.all')}</option>
                <option value="pending">{t('fuelSupplies.status.pending')}</option>
                <option value="received">{t('fuelSupplies.status.received')}</option>
                <option value="verified">{t('fuelSupplies.status.verified')}</option>
              </select>
              <div className="relative">
                <ActionIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('fuelSupplies.filters.search')}
                  value={filters.search}
                  onChange={(e) => handleFiltersChange({...filters, search: e.target.value})}
                  className="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Development Debug Panel */}
        {import.meta.env.DEV && import.meta.env.VITE_DEBUG_UI === 'true' && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-xs font-mono">
            <h4 className="font-bold mb-2">Debug Info</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>Page Renders: {PAGE_RENDERS.count}</div>
              <div>Component Renders: {renderCount.current}</div>
              <div>View Mode: {viewMode}</div>
              <div>Loading: {isLoading ? 'true' : 'false'}</div>
              <div>Supplies: {supplies?.length || 0}</div>
              <div>Filtered: {filteredSupplies?.length || 0}</div>
              <div>Providers: {providers?.length || 0}</div>
              <div>Tanks: {tanks?.length || 0}</div>
            </div>
            <div className="mt-2 grid grid-cols-1">
              <div>Filters: {JSON.stringify(filters)}</div>
            </div>
            <div className="mt-2">
              <button 
                onClick={() => {
                  console.clear();
                  console.log('Debug console cleared');
                }}
                className="px-2 py-1 bg-yellow-200 rounded text-yellow-800 hover:bg-yellow-300"
              >
                Clear Console
              </button>
            </div>
          </div>
        )}

        {/* Supplies Display */}
        <div className="space-y-6">
          <h4 className="text-md font-semibold text-card-foreground mb-4">
            {t('fuelSupplies.directory')} ({filteredSupplies.length})
          </h4>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('fuelSupplies.loadingSupplies')}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>{t('fuelSupplies.errorLoadingSupplies')}: {error.message}</p>
                <Button variant="outline" className="mt-4" onClick={refreshData}>
                {t('fuelSupplies.retry')}
                </Button>
              </div>
          ) : filteredSupplies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('fuelSupplies.noSuppliesFound')}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSupplies.map((supply) => (
                <div
                  key={supply.id}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-card-foreground">
                          {supply.supplier}
                        </h5>
                        <p className="text-xs text-muted-foreground">{supply.fuelType}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs border inline-flex items-center gap-1 ${getStatusColor(supply.status)}`}>
                      {getStatusIcon(supply.status)}
                      <span className="capitalize">{supply.status}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t('fuelSupplies.fields.quantity')}:</span>
                      <span className="text-card-foreground font-medium">{supply.quantity} L</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t('fuelSupplies.fields.pricePerLiter')}:</span>
                      <span className="text-card-foreground font-medium">{supply.pricePerLiter} ֏</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t('fuelSupplies.fields.totalCost')}:</span>
                      <span className="text-card-foreground font-medium">{supply.totalCost} ֏</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>{t('fuelSupplies.fields.deliveryDate')}:</span>
                      <span className="text-card-foreground font-medium">{new Date(supply.deliveryDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => handleViewSupply(supply)}
                      className="p-2 text-xs text-muted-foreground hover:text-foreground bg-background rounded-md hover:bg-muted transition-colors"
                    >
                      <ActionIcons.Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditSupply(supply)}
                      className="p-2 text-xs text-muted-foreground hover:text-foreground bg-background rounded-md hover:bg-muted transition-colors"
                    >
                      <ActionIcons.Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-xs text-muted-foreground hover:text-destructive bg-background rounded-md hover:bg-destructive/10 transition-colors"
                      onClick={() => handleDeleteSupply(supply)}
                    >
                      <ActionIcons.Delete className="w-4 h-4" />
                    </button>
                  </div>
              </div>
              ))}
              </div>
            ) : (
              <FuelSuppliesTable 
                data={filteredSupplies}
              isLoading={isLoading}
                onView={handleViewSupply}
                onEdit={handleEditSupply}
              onDelete={handleDeleteSupply}
              />
            )}
          </div>
        </div>

      {/* Create Supply Modal */}
        <CreateSupplyDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
          createSupplyData={createSupplyData}
          onCreateSupplyDataChange={setCreateSupplyData}
          providers={providers}
          tanks={tanks}
          onCreateSupply={handleCreateSupply}
          isCreating={isCreating}
        />

      {/* Edit Supply Modal */}
      <CreateSupplyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        createSupplyData={createSupplyData}
        onCreateSupplyDataChange={setCreateSupplyData}
        providers={providers}
        tanks={tanks}
        onCreateSupply={handleUpdateSupply}
        isCreating={isEditing}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">{t('fuelSupplies.modal.deleteConfirmationTitle')}</h2>
            <p className="mb-4">{t('fuelSupplies.modal.deleteConfirmationMessage')}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={confirmDeleteSupply}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
              >
                {t('fuelSupplies.modal.deleteConfirm')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-card text-card-foreground rounded-md hover:bg-card/90"
              >
                {t('fuelSupplies.modal.deleteCancel')}
              </button>
            </div>
          </div>
      </div>
      )}
    </WindowContainer>
  );
};
