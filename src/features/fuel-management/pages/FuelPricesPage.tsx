import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { DollarSign, Droplet, History } from 'lucide-react';

// API
import { getFuelTypes } from '@/core/api/endpoints/fuel-types-adapter';
import { 
  getPrices, 
  createPrice, 
  updatePrice, 
  getPriceHistory,
  FuelPrice
} from '@/core/api/endpoints/prices-adapter';

// Components
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
import { FuelPricesHeader } from '../components/FuelPricesHeader';
import { FuelPricesTable } from '../components/FuelPricesTable';
import { FuelPricesGrid } from '../components/FuelPricesGrid';
import { PriceFormDialog } from '../components/PriceFormDialog';
import { PriceHistoryDialog } from '../components/PriceHistoryDialog';

// Types
interface FuelType {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export const FuelPricesPage: React.FC = () => {
  // Track render count in development
  const renderCount = useRef(0);
  
  if (import.meta.env.DEV) {
    renderCount.current++;
    console.log(`[FuelPricesPage] Render #${renderCount.current}`);
  }

  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPriceModalOpen, setIsAddPriceModalOpen] = useState(false);
  const [isPriceHistoryModalOpen, setIsPriceHistoryModalOpen] = useState(false);
  const [selectedFuelTypeId, setSelectedFuelTypeId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<FuelPrice | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Queries
  const { 
    data: fuelTypes = [], 
    isLoading: isLoadingFuelTypes, 
    error: fuelTypesError 
  } = useQuery({
    queryKey: ['fuelTypes'],
    queryFn: () => getFuelTypes(),
  });

  const { 
    data: prices = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['fuelPrices'],
    queryFn: () => getPrices(),
  });

  const { 
    data: priceHistory = [], 
    isLoading: priceHistoryLoading, 
    error: priceHistoryError,
    refetch: refetchPriceHistory 
  } = useQuery({
    queryKey: ['priceHistory', selectedFuelTypeId],
    queryFn: () => selectedFuelTypeId ? getPriceHistory(selectedFuelTypeId) : Promise.resolve([]),
    enabled: !!selectedFuelTypeId,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelPrices'] });
      setIsAddPriceModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelPrices'] });
      if (selectedFuelTypeId) {
        queryClient.invalidateQueries({ queryKey: ['priceHistory', selectedFuelTypeId] });
      }
      setIsAddPriceModalOpen(false);
      setEditingPrice(null);
    },
  });

  // Form submission
  const handleSubmit = (data: {
    fuelTypeId: string;
    price: number;
    effectiveDate: string;
  }) => {
    const payload = {
      ...data,
      price: Number(data.price),
    };

    if (editingPrice) {
      updateMutation.mutate({
        id: editingPrice.id,
        ...payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  // Filter prices based on search
  const filteredPrices = useMemo(() => {
    if (!searchQuery.trim()) return prices;
    
    return prices.filter((price: FuelPrice) => {
      const fuelType = fuelTypes.find((ft: FuelType) => ft.id === price.fuelTypeId);
      return fuelType?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [prices, fuelTypes, searchQuery]);

  // Utility functions
  const handleEditPrice = useCallback((price: FuelPrice) => {
    setEditingPrice(price);
    setIsAddPriceModalOpen(true);
  }, []);

  const handleViewPriceHistory = useCallback((fuelTypeId: string) => {
    setSelectedFuelTypeId(fuelTypeId);
    setIsPriceHistoryModalOpen(true);
  }, []);

  const getFuelTypeName = useCallback((id: string): string => {
    const fuelType = fuelTypes.find((ft: FuelType) => ft.id === id);
    return fuelType?.name || 'Unknown';
  }, [fuelTypes]);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return '';
    return format(new Date(dateString), 'dd/MM/yyyy');
  }, []);

  const formatCurrency = useCallback((value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0 ֏';
    return `${value.toLocaleString('hy-AM')} ֏`;
  }, []);

  const getLatestUpdateDate = useCallback((): string => {
    if (!prices || prices.length === 0) return '';
    
    // Find the most recent date
    return prices.reduce((latest: string, price: FuelPrice) => {
      if (!price.effectiveDate) return latest;
      
      const priceDate = new Date(price.effectiveDate);
      const latestDate = latest ? new Date(latest) : new Date(0);
      return priceDate > latestDate ? price.effectiveDate : latest;
    }, '');
  }, [prices]);

  // Prepare stats for header
  const quickStats = useMemo(() => [
    {
      title: t('common.fuelTypes'),
      value: String(fuelTypes?.length || 0),
      icon: Droplet,
      color: 'blue',
      description: t('fuelPrices.availableFuelTypes'),
    },
    {
      title: t('common.priceRecords'),
      value: String(prices?.length || 0),
      icon: DollarSign,
      color: 'green',
      description: t('fuelPrices.totalPriceRecords'),
    },
    {
      title: t('common.lastUpdated'),
      value: formatDate(getLatestUpdateDate()),
      icon: History,
      color: 'purple',
      description: t('fuelPrices.lastPriceUpdate'),
    },
  ], [t, fuelTypes?.length, prices?.length, formatDate, getLatestUpdateDate]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <WindowContainer
      title={t('fuelPrices.title')}
      subtitle={t('fuelPrices.description')}
      breadcrumbItems={[
        { label: t('navigation.dashboard'), href: '/' },
        { label: t('navigation.fuel'), href: '/fuel' },
        { label: t('fuelPrices.title'), href: '/fuel/prices' },
      ]}
    >
      {/* Header with stats and filters */}
      <FuelPricesHeader
        quickStats={quickStats.map(stat => ({
          ...stat,
          color: stat.color as "blue" | "green" | "purple" | "orange" | "red" | "indigo" | "pink" | "yellow"
        }))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddPrice={() => {
          setEditingPrice(null);
          setIsAddPriceModalOpen(true);
        }}
        onRefresh={() => refetch()}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        isLoading={isLoading}
      />

      {/* Main content - either grid or table view */}
      {viewMode === 'grid' ? (
        <FuelPricesGrid
          prices={filteredPrices}
          onEdit={handleEditPrice}
          onViewHistory={handleViewPriceHistory}
          getFuelTypeName={getFuelTypeName}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          isLoading={isLoading}
        />
      ) : (
        <FuelPricesTable
          data={filteredPrices}
          isLoading={isLoading}
          onEdit={handleEditPrice}
          onViewHistory={handleViewPriceHistory}
          getFuelTypeName={getFuelTypeName}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />
      )}

      {/* Add/Edit Price Modal */}
      <PriceFormDialog
        open={isAddPriceModalOpen}
        onOpenChange={setIsAddPriceModalOpen}
        editingPrice={editingPrice}
        fuelTypes={fuelTypes}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Price History Modal */}
      <PriceHistoryDialog
        open={isPriceHistoryModalOpen}
        onOpenChange={setIsPriceHistoryModalOpen}
        priceHistory={priceHistory}
        fuelTypeName={getFuelTypeName(selectedFuelTypeId || '')}
        isLoading={priceHistoryLoading}
        error={priceHistoryError}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />
    </WindowContainer>
  );
};

export default FuelPricesPage;
