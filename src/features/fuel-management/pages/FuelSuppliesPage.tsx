/**
 * Fuel Supplies Management Page
 * Following the same patterns as management employees page
 */

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/core/components/ui/button';
import { Package, AlertCircle, CheckCircle } from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { useTranslation } from 'react-i18next';

// Import the separated components
import { FuelSuppliesMetrics } from '@/features/fuel-management/components/FuelSuppliesMetrics';
import { FuelSuppliesFilters, SupplyFilters } from '@/features/fuel-management/components/FuelSuppliesFilters';
import { FuelSuppliesTable, SupplyListItem } from '@/features/fuel-management/components/FuelSuppliesTable';
import { CreateSupplyDialog, CreateSupplyData } from '@/features/fuel-management/components/CreateSupplyDialog';
import { FuelSuppliesHeader } from '@/features/fuel-management/components/FuelSuppliesHeader';
import { FuelSuppliesGrid } from '@/features/fuel-management/components/FuelSuppliesGrid';
import { DeleteSupplyDialog } from '@/features/fuel-management/components/DeleteSupplyDialog';

// Import our custom hook for fuel supplies data
import { useFuelSupplies } from '@/features/fuel-management/hooks/useFuelSupplies';
import { useFuelSuppliesService } from '@/features/fuel-management/services/fuelSuppliesService';

// API imports for form data
import { petrolProvidersApi } from '@/core/api/endpoints/petrol-providers';
import { tanksApi } from '@/core/api/endpoints/tanks';
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
  
  // Use our service for handling CRUD operations
  const suppliesService = useFuelSuppliesService();
  
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
      const success = await suppliesService.createSupply(createSupplyData);
      
      if (success) {
        // Reset create form
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
      }
    } finally {
      setIsCreating(false);
    }
  };

  // Handler for editing a supply
  const handleEditSupply = (supply: SupplyListItem) => {
    // Set the current supply for editing
    setCurrentSupply(supply);
    
    // Find provider and tank from the data in supply
    const tank = tanks.find(t => t.fuel_type?.name === supply.fuelType);
    const provider = providers.find(p => p.name === supply.supplier);

    if (!tank || !provider) {
      console.error('Could not find tank or provider for the selected supply');
      // Optionally, show a toast notification to the user
      // toast({ title: 'Error', description: 'Could not find tank or provider.' });
      return;
    }
    
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
      const success = await suppliesService.updateSupply(currentSupply.id, createSupplyData);
      
      if (success) {
        // Reset form
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
      }
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
      
      // Store the ID of the item to be deleted
      const idToDelete = supplyToDelete.id;
      
      const success = await suppliesService.deleteSupply(idToDelete);
      
      if (success) {
        setShowDeleteConfirm(false);
        setSupplyToDelete(null);
      }
    } finally {
      setIsDeleting(false);
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
        {/* Header and Controls Section */}
        <FuelSuppliesHeader
          quickStats={quickStats}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAddSupply={() => setShowCreateModal(true)}
          onRefresh={() => suppliesService.loadSupplies()}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          isLoading={isLoading}
          fuelTypes={fuelTypes}
        />

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
          
          {error ? (
            <div className="text-center py-8 text-destructive">
              <p>{t('fuelSupplies.errorLoadingSupplies')}: {error.message}</p>
                <Button variant="outline" className="mt-4" onClick={refreshData}>
                {t('fuelSupplies.retry')}
                </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <FuelSuppliesGrid
              supplies={filteredSupplies}
              onEdit={handleEditSupply}
              onDelete={handleDeleteSupply}
              isLoading={isLoading}
            />
            ) : (
              <FuelSuppliesTable 
                data={filteredSupplies}
              isLoading={isLoading}
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

      {/* Delete Confirmation Dialog */}
      <DeleteSupplyDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={confirmDeleteSupply}
        isDeleting={isDeleting}
      />
    </WindowContainer>
  );
};
