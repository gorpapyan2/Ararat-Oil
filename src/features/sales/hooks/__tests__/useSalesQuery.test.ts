import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useSalesQuery, useSaleQuery, useSalesMutations } from '../useSalesQuery';
import { setupHookTest, setupMutationTest } from '@/test/utils/test-setup';
import * as salesService from '../../services/sales';
import { FuelTypeCode } from '@/types';

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

describe('useSalesQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch sales data', async () => {
    const mockSales = [{ id: '1', amount: 100 }];
    
    // Use shared test utility
    const { renderTestHook, mockFetch } = setupHookTest();
    mockFetch.mockResolvedValue(mockSales);
    
    const { result } = renderTestHook(() => useSalesQuery());

    expect(result.current.isLoading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSales);
    expect(salesService.fetchSales).toHaveBeenCalledTimes(1);
  });

  it('should fetch sales data with filters', async () => {
    const mockSales = [{ id: '1', amount: 100 }];
    
    // Use shared test utility
    const { renderTestHook, mockFetch } = setupHookTest();
    mockFetch.mockResolvedValue(mockSales);

    const filters = {
      dateRange: { from: new Date('2023-01-01') },
        fuelType: 'diesel' as FuelTypeCode,
    };

    const { result } = renderTestHook(() => useSalesQuery(filters));

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
    
    // Use shared test utility
    const { renderTestHook, mockFetch } = setupHookTest();
    mockFetch.mockResolvedValue(mockSale);

    const { result } = renderTestHook(() => useSaleQuery('1'));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockSale);
    expect(salesService.fetchSale).toHaveBeenCalledWith('1');
  });

  it('should not fetch when ID is empty', async () => {
    // Use shared test utility
    const { renderTestHook } = setupHookTest();

    const { result } = renderTestHook(() => useSaleQuery(''));

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
    
    // Use shared mutation test utility
    const { renderTestHook, mockMutate } = setupMutationTest();
    mockMutate.mockResolvedValue(mockSale);

    const { result } = renderTestHook(() => useSalesMutations());

    const newSale = { amount: 100, quantityLiters: 10 } as any;
    result.current.createSale.mutate(newSale);

    await waitFor(() => {
      expect(result.current.createSale.isSuccess).toBe(true);
    });

    expect(salesService.createSale).toHaveBeenCalledWith(newSale);
  });

  it('should update a sale', async () => {
    const mockSale = { id: '1', amount: 200 };
    
    // Use shared mutation test utility
    const { renderTestHook, mockMutate } = setupMutationTest();
    mockMutate.mockResolvedValue(mockSale);

    const { result } = renderTestHook(() => useSalesMutations());

    const updateData = { amount: 200 } as any;
    result.current.updateSale.mutate({ id: '1', data: updateData });

    await waitFor(() => {
      expect(result.current.updateSale.isSuccess).toBe(true);
    });

    expect(salesService.updateSale).toHaveBeenCalledWith('1', updateData);
  });

  it('should delete a sale', async () => {
    const mockResponse = { message: 'Sale deleted' };
    
    // Use shared mutation test utility
    const { renderTestHook, mockMutate } = setupMutationTest();
    mockMutate.mockResolvedValue(mockResponse);

    const { result } = renderTestHook(() => useSalesMutations());

    result.current.deleteSale.mutate('1');

    await waitFor(() => {
      expect(result.current.deleteSale.isSuccess).toBe(true);
    });

    expect(salesService.deleteSale).toHaveBeenCalledWith('1');
  });
  
  it('should invalidate queries after mutation success', async () => {
    // Use shared mutation test utility with queryClient access
    const { queryClient, renderTestHook, mockMutate } = setupMutationTest();
    const spyInvalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    
    mockMutate.mockResolvedValue({ id: '1', amount: 100 });

    const { result } = renderTestHook(() => useSalesMutations());

    // Test create mutation invalidation
    result.current.createSale.mutate({ amount: 100 } as any);
    
    await waitFor(() => {
      expect(result.current.createSale.isSuccess).toBe(true);
    });
    
    // Should invalidate sales queries
    expect(spyInvalidateQueries).toHaveBeenCalledWith(['sales']);
  });
}); 