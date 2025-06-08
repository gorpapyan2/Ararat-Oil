/**
 * Fuel Supplies Management Page
 * Following the same patterns as shifts management page
 */

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/core/components/ui/breadcrumb';
import { Button } from '@/core/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';

// Import the separated components
import { FuelSuppliesMetrics, SupplyListItem } from '@/features/fuel-management/components/FuelSuppliesMetrics';
import { FuelSuppliesFilters, SupplyFilters } from '@/features/fuel-management/components/FuelSuppliesFilters';
import { FuelSuppliesTable } from '@/features/fuel-management/components/FuelSuppliesTable';
import { CreateSupplyDialog, CreateSupplyData } from '@/features/fuel-management/components/CreateSupplyDialog';

// API imports
import { fuelSuppliesApi } from '@/core/api';
import { petrolProvidersApi } from '@/core/api/endpoints/petrol-providers';
import { tanksApi } from '@/core/api/endpoints/tanks';
import { FuelSupply, Tank, PetrolProvider } from '@/core/api/types';

export const FuelSuppliesPage: React.FC = () => {
  const [supplies, setSupplies] = useState<SupplyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form data
  const [providers, setProviders] = useState<PetrolProvider[]>([]);
  const [tanks, setTanks] = useState<Tank[]>([]);
  
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
    payment_method: 'Cash',
  });

  const transformSupplyToListItem = (supply: FuelSupply): SupplyListItem => {
    // Handle provider name
    const supplierName = supply.petrol_providers?.name || supply.provider?.name || 'Unknown Provider';
    
    // Handle fuel type from the tank's fuel type relationship
    let fuelTypeName = 'Unknown Fuel Type';
    if (supply.fuel_tanks?.fuel_types?.name) {
      fuelTypeName = supply.fuel_tanks.fuel_types.name;
    } else if (supply.tank?.fuel_type) {
      if (typeof supply.tank.fuel_type === 'string') {
        fuelTypeName = supply.tank.fuel_type;
      } else if (typeof supply.tank.fuel_type === 'object' && supply.tank.fuel_type.name) {
        fuelTypeName = supply.tank.fuel_type.name;
      }
    } else if (supply.tank?.name) {
      fuelTypeName = supply.tank.name;
    }

    console.log('Transforming supply:', {
      id: supply.id,
      originalSupply: supply,
      supplierName,
      fuelTypeName
    });

    return {
      id: supply.id,
      supplier: supplierName,
      fuelType: fuelTypeName,
      quantity: supply.quantity_liters,
      pricePerLiter: supply.price_per_liter,
      totalCost: supply.total_cost || supply.quantity_liters * supply.price_per_liter,
      deliveryDate: supply.delivery_date,
      status: 'received' as const,
    };
  };

  const loadSupplies = async () => {
    try {
      setIsLoading(true);
      const response = await fuelSuppliesApi.getFuelSupplies();
      if (response.error) {
        console.error('Error loading supplies:', response.error);
        setSupplies([]);
        return;
      }
      const transformedSupplies = (response.data || []).map(transformSupplyToListItem);
      setSupplies(transformedSupplies);
    } catch (error) {
      console.error('Error loading supplies:', error);
      setSupplies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFormData = async () => {
    try {
      console.log('Loading form data...');
      // Load providers and tanks data for the create form
      const [providersResponse, tanksResponse] = await Promise.all([
        petrolProvidersApi.getPetrolProviders(),
        tanksApi.getTanks()
      ]);

      console.log('Providers response:', providersResponse);
      console.log('Tanks response:', tanksResponse);

      if (providersResponse.data) {
        setProviders(providersResponse.data);
        console.log('Loaded providers:', providersResponse.data);
      } else {
        console.error('Error loading providers:', providersResponse.error);
        setProviders([]);
      }

      if (tanksResponse.data) {
        setTanks(tanksResponse.data);
        console.log('Loaded tanks:', tanksResponse.data);
      } else {
        console.error('Error loading tanks:', tanksResponse.error);
        setTanks([]);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
      setProviders([]);
      setTanks([]);
    }
  };

  useEffect(() => {
    loadSupplies();
    loadFormData();
  }, []);

  const handleCreateSupply = async () => {
    try {
      setIsCreating(true);
      
      // Calculate total_cost if not provided
      const supplyData = {
        ...createSupplyData,
        total_cost: createSupplyData.total_cost || (createSupplyData.quantity_liters * createSupplyData.price_per_liter)
      };
      
      const response = await fuelSuppliesApi.createFuelSupply(supplyData);
      if (response.error) {
        console.error('Error creating supply:', response.error);
        return;
      }
      setIsCreateDialogOpen(false);
      
      // Reset form
      setCreateSupplyData({
        provider_id: '',
        tank_id: '',
        quantity_liters: 0,
        price_per_liter: 0,
        delivery_date: new Date().toISOString().slice(0, 16),
        comments: '',
        payment_method: 'Cash',
      });
      
      // Reload supplies
      await loadSupplies();
    } catch (error) {
      console.error('Error creating supply:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewSupply = (supply: SupplyListItem) => {
    console.log('View supply:', supply);
    // Navigate to supply detail page or open view dialog
  };

  const handleEditSupply = (supply: SupplyListItem) => {
    console.log('Edit supply:', supply);
    // Navigate to edit page or open edit dialog
  };

  // Filter the supplies based on current filters
  const filteredSupplies = supplies.filter(supply => {
    if (filters.status !== 'all' && supply.status !== filters.status) return false;
    if (filters.search && !supply.supplier.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <WindowContainer 
      title="Fuel Supplies" 
      subtitle="Manage fuel inventory and supplier deliveries"
      breadcrumbItems={[
        { label: 'Dashboard', href: '/' },
        { label: 'Fuel Management', href: '/fuel-management' },
        { label: 'Supplies', href: '/fuel-management/supplies' },
      ]}
    >
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Supply Management</h2>
            <p className="text-muted-foreground">Monitor and track fuel deliveries from suppliers</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supply
          </Button>
        </div>

        {/* Metrics */}
        <FuelSuppliesMetrics supplies={supplies} isLoading={isLoading} />

        {/* Filters */}
        <FuelSuppliesFilters
          filters={filters}
          onFiltersChange={setFilters}
          fuelTypes={[]}
          resultsCount={filteredSupplies.length}
        />

        {/* Data Table */}
        <FuelSuppliesTable
          data={filteredSupplies}
          isLoading={isLoading}
          onView={handleViewSupply}
          onEdit={handleEditSupply}
        />

        {/* Create Dialog */}
        <CreateSupplyDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          createSupplyData={createSupplyData}
          onCreateSupplyDataChange={setCreateSupplyData}
          providers={providers}
          tanks={tanks}
          onCreateSupply={handleCreateSupply}
          isCreating={isCreating}
        />
      </div>
    </WindowContainer>
  );
};
