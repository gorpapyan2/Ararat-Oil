import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useSalesQuery, useSaleQuery, useSalesMutations } from '../useSalesQuery';
import * as salesService from '../../services/sales';

// Mock the sales service
vi.mock('../../services/sales', () => ({
  fetchSales: vi.fn(),
  fetchSale: vi.fn(),
  createSale: vi.fn(),
  updateSale: vi.fn(),
  deleteSale: vi.fn(),
  exportSales: vi.fn(),
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSalesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch sales data', async () => {
    const mockSales = [{ id: '1', amount: 100 }];
    vi.mocked(salesService.fetchSales).mockResolvedValue(mockSales as any);

    const { result } = renderHook(() => useSalesQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSales);
    expect(salesService.fetchSales).toHaveBeenCalledTimes(1);
  });

  it('should fetch sales data with filters', async () => {
    const mockSales = [{ id: '1', amount: 100 }];
    vi.mocked(salesService.fetchSales).mockResolvedValue(mockSales as any);

    const filters = {
      dateRange: { from: new Date('2023-01-01') },
      fuelType: 'diesel',
    };

    const { result } = renderHook(() => useSalesQuery(filters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSales);
    expect(salesService.fetchSales).toHaveBeenCalledWith(filters);
  });
});

describe('useSaleQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a single sale by ID', async () => {
    const mockSale = { id: '1', amount: 100 };
    vi.mocked(salesService.fetchSale).mockResolvedValue(mockSale as any);

    const { result } = renderHook(() => useSaleQuery('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSale);
    expect(salesService.fetchSale).toHaveBeenCalledWith('1');
  });

  it('should not fetch when ID is empty', async () => {
    const { result } = renderHook(() => useSaleQuery(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(salesService.fetchSale).not.toHaveBeenCalled();
  });
});

describe('useSalesMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a sale', async () => {
    const mockSale = { id: '1', amount: 100 };
    vi.mocked(salesService.createSale).mockResolvedValue(mockSale as any);

    const { result } = renderHook(() => useSalesMutations(), {
      wrapper: createWrapper(),
    });

    const newSale = { amount: 100, quantityLiters: 10 } as any;
    result.current.createSale.mutate(newSale);

    await waitFor(() => {
      expect(result.current.createSale.isSuccess).toBe(true);
    });

    expect(salesService.createSale).toHaveBeenCalledWith(newSale);
  });

  it('should update a sale', async () => {
    const mockSale = { id: '1', amount: 200 };
    vi.mocked(salesService.updateSale).mockResolvedValue(mockSale as any);

    const { result } = renderHook(() => useSalesMutations(), {
      wrapper: createWrapper(),
    });

    const updateData = { amount: 200 } as any;
    result.current.updateSale.mutate({ id: '1', data: updateData });

    await waitFor(() => {
      expect(result.current.updateSale.isSuccess).toBe(true);
    });

    expect(salesService.updateSale).toHaveBeenCalledWith('1', updateData);
  });

  it('should delete a sale', async () => {
    const mockResponse = { message: 'Sale deleted' };
    vi.mocked(salesService.deleteSale).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useSalesMutations(), {
      wrapper: createWrapper(),
    });

    result.current.deleteSale.mutate('1');

    await waitFor(() => {
      expect(result.current.deleteSale.isSuccess).toBe(true);
    });

    expect(salesService.deleteSale).toHaveBeenCalledWith('1');
  });
}); 