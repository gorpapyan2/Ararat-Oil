import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFuelSuppliesFilters } from './useFuelSuppliesFilters';
import { fuelSuppliesService } from '../services';
import { vi } from 'vitest';

// Mock the API service
vi.mock('../services', () => ({
  fuelSuppliesService: {
    getFuelSupplies: vi.fn()
  }
}));

const mockSupplies = [
  {
    id: '1',
    delivery_date: '2023-01-01',
    provider_id: 'provider1',
    tank_id: 'tank1',
    quantity_liters: 1000,
    price_per_liter: 500,
    total_cost: 500000,
    comments: 'Diesel delivery',
    shift_id: 'shift1',
    payment_method: 'cash',
    payment_status: 'paid',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-01T12:00:00Z',
    provider: {
      id: 'provider1',
      name: 'Diesel Provider'
    },
    tank: {
      id: 'tank1',
      name: 'Tank 1',
      fuel_type: 'diesel'
    }
  },
  {
    id: '2',
    delivery_date: '2023-02-01',
    provider_id: 'provider2',
    tank_id: 'tank2',
    quantity_liters: 2000,
    price_per_liter: 400,
    total_cost: 800000,
    comments: 'Petrol delivery',
    shift_id: 'shift2',
    payment_method: 'credit',
    payment_status: 'pending',
    created_at: '2023-02-01T12:00:00Z',
    updated_at: '2023-02-01T12:00:00Z',
    provider: {
      id: 'provider2',
      name: 'Petrol Provider'
    },
    tank: {
      id: 'tank2',
      name: 'Tank 2',
      fuel_type: 'petrol_regular'
    }
  }
];

describe('useFuelSuppliesFilters', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
    vi.mocked(fuelSuppliesService.getFuelSupplies).mockResolvedValue(mockSupplies);
  });

  it('should initialize with default filters', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    expect(result.current.filters).toEqual({
      searchTerm: '',
      providerId: 'all',
      tankId: 'all',
      fuelType: 'all',
      paymentStatus: 'all'
    });
  });

  it('should update filters correctly', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    act(() => {
      result.current.updateFilters({ searchTerm: 'diesel' });
    });
    
    expect(result.current.filters.searchTerm).toBe('diesel');
    
    act(() => {
      result.current.updateFilters({ providerId: 'provider1' });
    });
    
    expect(result.current.filters).toEqual({
      searchTerm: 'diesel',
      providerId: 'provider1',
      tankId: 'all',
      fuelType: 'all',
      paymentStatus: 'all'
    });
  });

  it('should reset filters to default values', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    act(() => {
      result.current.updateFilters({ 
        searchTerm: 'diesel',
        providerId: 'provider1',
        fuelType: 'diesel'
      });
    });
    
    act(() => {
      result.current.resetFilters();
    });
    
    expect(result.current.filters).toEqual({
      searchTerm: '',
      providerId: 'all',
      tankId: 'all',
      fuelType: 'all',
      paymentStatus: 'all'
    });
  });

  it('should filter supplies by search term', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    await vi.waitFor(() => {
      expect(result.current.supplies).toHaveLength(2);
    });
    
    act(() => {
      result.current.updateFilters({ searchTerm: 'diesel' });
    });
    
    expect(result.current.filteredSupplies).toHaveLength(1);
    expect(result.current.filteredSupplies[0].id).toBe('1');
  });

  it('should filter supplies by provider', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    await vi.waitFor(() => {
      expect(result.current.supplies).toHaveLength(2);
    });
    
    act(() => {
      result.current.updateFilters({ providerId: 'provider2' });
    });
    
    expect(result.current.filteredSupplies).toHaveLength(1);
    expect(result.current.filteredSupplies[0].id).toBe('2');
  });

  it('should filter supplies by fuel type', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    await vi.waitFor(() => {
      expect(result.current.supplies).toHaveLength(2);
    });
    
    act(() => {
      result.current.updateFilters({ fuelType: 'diesel' });
    });
    
    expect(result.current.filteredSupplies).toHaveLength(1);
    expect(result.current.filteredSupplies[0].id).toBe('1');
  });

  it('should filter supplies by payment status', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    await vi.waitFor(() => {
      expect(result.current.supplies).toHaveLength(2);
    });
    
    act(() => {
      result.current.updateFilters({ paymentStatus: 'pending' });
    });
    
    expect(result.current.filteredSupplies).toHaveLength(1);
    expect(result.current.filteredSupplies[0].id).toBe('2');
  });

  it('should generate filter options from supplies data', async () => {
    const { result } = renderHook(() => useFuelSuppliesFilters(), { wrapper });
    
    await vi.waitFor(() => {
      expect(result.current.supplies).toHaveLength(2);
    });
    
    expect(result.current.filterOptions.providers).toHaveLength(2);
    expect(result.current.filterOptions.tanks).toHaveLength(2);
    expect(result.current.filterOptions.fuelTypes).toHaveLength(2);
    expect(result.current.filterOptions.paymentStatuses).toHaveLength(2);
  });
}); 