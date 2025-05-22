import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { 
  useFillingSystem, 
  useFillingSystemById, 
  useFillingSystemMutations 
} from '../useFillingSystem';

// Mock the services
vi.mock('../../services', () => ({
  getFillingSystems: vi.fn(),
  getFillingSystemById: vi.fn(),
  createFillingSystem: vi.fn(),
  updateFillingSystem: vi.fn(),
  deleteFillingSystem: vi.fn(),
  validateTankIds: vi.fn()
}));

import { 
  getFillingSystems, 
  getFillingSystemById, 
  createFillingSystem, 
  updateFillingSystem, 
  deleteFillingSystem, 
  validateTankIds 
} from '../../services';

// Create a wrapper for the QueryClientProvider
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

describe('Filling System Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('useFillingSystem', () => {
    it('should fetch filling systems successfully', async () => {
      const mockFillingSystems = [
        { id: '1', name: 'Filling System 1', tank_ids: ['tank1', 'tank2'], is_active: true, created_at: '2023-01-01', updated_at: '2023-01-01' },
        { id: '2', name: 'Filling System 2', tank_ids: ['tank3'], is_active: true, created_at: '2023-01-02', updated_at: '2023-01-02' }
      ];
      
      (getFillingSystems as any).mockResolvedValue(mockFillingSystems);
      
      const { result } = renderHook(() => useFillingSystem(), {
        wrapper: createWrapper()
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFillingSystems);
      expect(getFillingSystems).toHaveBeenCalledTimes(1);
    });
    
    it('should handle filling system fetch error', async () => {
      const mockError = new Error('Failed to fetch filling systems');
      (getFillingSystems as any).mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useFillingSystem(), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
    
    it('should fetch filling systems with filters', async () => {
      const filters = { search: 'Filling System 1' };
      const mockFillingSystems = [
        { id: '1', name: 'Filling System 1', tank_ids: ['tank1', 'tank2'], is_active: true, created_at: '2023-01-01', updated_at: '2023-01-01' }
      ];
      
      (getFillingSystems as any).mockResolvedValue(mockFillingSystems);
      
      const { result } = renderHook(() => useFillingSystem(filters), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFillingSystems);
      expect(getFillingSystems).toHaveBeenCalledWith(filters);
    });
  });
  
  describe('useFillingSystemById', () => {
    it('should fetch a single filling system successfully', async () => {
      const mockFillingSystem = { 
        id: '1', 
        name: 'Filling System 1', 
        tank_ids: ['tank1', 'tank2'], 
        is_active: true, 
        created_at: '2023-01-01', 
        updated_at: '2023-01-01' 
      };
      
      (getFillingSystemById as any).mockResolvedValue(mockFillingSystem);
      
      const { result } = renderHook(() => useFillingSystemById('1'), {
        wrapper: createWrapper()
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFillingSystem);
      expect(getFillingSystemById).toHaveBeenCalledWith('1');
    });
    
    it('should not fetch filling system if id is empty', async () => {
      const { result } = renderHook(() => useFillingSystemById(''), {
        wrapper: createWrapper()
      });
      
      // It should not load or fetch
      expect(result.current.isLoading).toBe(false);
      expect(getFillingSystemById).not.toHaveBeenCalled();
    });
    
    it('should handle fetch error for a single filling system', async () => {
      const mockError = new Error('Failed to fetch filling system');
      (getFillingSystemById as any).mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useFillingSystemById('1'), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });
  
  describe('useFillingSystemMutations', () => {
    it('should create a filling system successfully', async () => {
      const newFillingSystem = {
        name: 'New Filling System',
        tank_ids: ['tank4', 'tank5'],
        is_active: true
      };
      
      const createdFillingSystem = {
        id: '3',
        ...newFillingSystem,
        created_at: '2023-01-03',
        updated_at: '2023-01-03'
      };
      
      (createFillingSystem as any).mockResolvedValue(createdFillingSystem);
      
      const { result } = renderHook(() => useFillingSystemMutations(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.createFillingSystem.mutate(newFillingSystem);
      });
      
      await waitFor(() => {
        expect(result.current.createFillingSystem.isSuccess).toBe(true);
        expect(result.current.createFillingSystem.data).toEqual(createdFillingSystem);
      });
      
      expect(createFillingSystem).toHaveBeenCalledWith(newFillingSystem);
    });
    
    it('should update a filling system successfully', async () => {
      const fillingSystemId = '1';
      const updateData = {
        name: 'Updated Filling System',
        tank_ids: ['tank1', 'tank2', 'tank6']
      };
      
      const updatedFillingSystem = {
        id: fillingSystemId,
        name: 'Updated Filling System',
        tank_ids: ['tank1', 'tank2', 'tank6'],
        is_active: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-04'
      };
      
      (updateFillingSystem as any).mockResolvedValue(updatedFillingSystem);
      
      const { result } = renderHook(() => useFillingSystemMutations(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.updateFillingSystem.mutate({ id: fillingSystemId, data: updateData });
      });
      
      await waitFor(() => {
        expect(result.current.updateFillingSystem.isSuccess).toBe(true);
        expect(result.current.updateFillingSystem.data).toEqual(updatedFillingSystem);
      });
      
      expect(updateFillingSystem).toHaveBeenCalledWith(fillingSystemId, updateData);
    });
    
    it('should delete a filling system successfully', async () => {
      const fillingSystemId = '2';
      
      (deleteFillingSystem as any).mockResolvedValue(true);
      
      const { result } = renderHook(() => useFillingSystemMutations(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.deleteFillingSystem.mutate(fillingSystemId);
      });
      
      await waitFor(() => {
        expect(result.current.deleteFillingSystem.isSuccess).toBe(true);
        expect(result.current.deleteFillingSystem.data).toBe(true);
      });
      
      expect(deleteFillingSystem).toHaveBeenCalledWith(fillingSystemId);
    });
    
    it('should validate tank IDs successfully', async () => {
      const tankIds = ['tank1', 'tank2'];
      
      (validateTankIds as any).mockResolvedValue(true);
      
      const { result } = renderHook(() => useFillingSystemMutations(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.validateTankIds.mutate(tankIds);
      });
      
      await waitFor(() => {
        expect(result.current.validateTankIds.isSuccess).toBe(true);
        expect(result.current.validateTankIds.data).toBe(true);
      });
      
      expect(validateTankIds).toHaveBeenCalledWith(tankIds);
    });
    
    it('should handle validation failure for tank IDs', async () => {
      const tankIds = ['invalidTank1', 'invalidTank2'];
      
      (validateTankIds as any).mockResolvedValue(false);
      
      const { result } = renderHook(() => useFillingSystemMutations(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.validateTankIds.mutate(tankIds);
      });
      
      await waitFor(() => {
        expect(result.current.validateTankIds.isSuccess).toBe(true);
        expect(result.current.validateTankIds.data).toBe(false);
      });
      
      expect(validateTankIds).toHaveBeenCalledWith(tankIds);
    });
  });
}); 