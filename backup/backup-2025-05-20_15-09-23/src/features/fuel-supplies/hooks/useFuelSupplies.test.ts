import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFuelSupplies } from './useFuelSupplies';
import { fuelSuppliesService } from '../services';
import { vi } from 'vitest';

// Mock the API service
vi.mock('../services', () => ({
  fuelSuppliesService: {
    getFuelSupplies: vi.fn(),
    createFuelSupply: vi.fn(),
    updateFuelSupply: vi.fn(),
    deleteFuelSupply: vi.fn()
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
    comments: 'Test supply',
    shift_id: 'shift1',
    payment_method: 'cash',
    payment_status: 'paid',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-01-01T12:00:00Z'
  }
];

describe('useFuelSupplies', () => {
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
  });

  it('should fetch fuel supplies', async () => {
    vi.mocked(fuelSuppliesService.getFuelSupplies).mockResolvedValue(mockSupplies);

    const { result } = renderHook(() => useFuelSupplies(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(fuelSuppliesService.getFuelSupplies).toHaveBeenCalledTimes(1);
    expect(result.current.supplies).toEqual(mockSupplies);
  });

  it('should create a fuel supply', async () => {
    const newSupply = {
      delivery_date: '2023-01-02',
      provider_id: 'provider1',
      tank_id: 'tank1',
      quantity_liters: 2000,
      price_per_liter: 500,
      total_cost: 1000000,
      comments: 'New supply',
      shift_id: 'shift1',
      payment_method: 'cash',
      payment_status: 'paid'
    };

    vi.mocked(fuelSuppliesService.createFuelSupply).mockResolvedValue({
      ...newSupply,
      id: '2',
      created_at: '2023-01-02T12:00:00Z',
      updated_at: '2023-01-02T12:00:00Z'
    });

    const { result } = renderHook(() => useFuelSupplies(), { wrapper });

    result.current.createSupply.mutate(newSupply);

    await waitFor(() => {
      expect(result.current.createSupply.isSuccess).toBe(true);
    });
    
    expect(fuelSuppliesService.createFuelSupply).toHaveBeenCalledWith(newSupply);
  });

  it('should update a fuel supply', async () => {
    const updateData = {
      id: '1',
      data: {
        comments: 'Updated supply'
      }
    };

    vi.mocked(fuelSuppliesService.updateFuelSupply).mockResolvedValue({
      ...mockSupplies[0],
      ...updateData.data,
      updated_at: '2023-01-03T12:00:00Z'
    });

    const { result } = renderHook(() => useFuelSupplies(), { wrapper });

    result.current.updateSupply.mutate({ id: updateData.id, data: updateData.data });

    await waitFor(() => {
      expect(result.current.updateSupply.isSuccess).toBe(true);
    });
    
    expect(fuelSuppliesService.updateFuelSupply).toHaveBeenCalledWith(
      updateData.id,
      updateData.data
    );
  });

  it('should delete a fuel supply', async () => {
    const supplyId = '1';
    vi.mocked(fuelSuppliesService.deleteFuelSupply).mockResolvedValue({ success: true });

    const { result } = renderHook(() => useFuelSupplies(), { wrapper });

    result.current.deleteSupply.mutate(supplyId);

    await waitFor(() => {
      expect(result.current.deleteSupply.isSuccess).toBe(true);
    });
    
    expect(fuelSuppliesService.deleteFuelSupply).toHaveBeenCalledWith(supplyId);
  });

  it('should apply filters when fetching supplies', async () => {
    const filters = {
      dateRange: {
        from: new Date('2023-01-01'),
        to: new Date('2023-01-31')
      },
      providerId: 'provider1'
    };

    vi.mocked(fuelSuppliesService.getFuelSupplies).mockResolvedValue(mockSupplies);

    const { result } = renderHook(() => useFuelSupplies(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(fuelSuppliesService.getFuelSupplies).toHaveBeenCalledWith(filters);
  });
}); 