import { renderHook, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { 
  useFillingSystem, 
  useFillingSystemById, 
  useFillingSystemMutations 
} from '../useFillingSystem';
import { setupHookTest, setupErrorTest, setupMutationTest } from '@/test/utils/test-setup';

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
      
      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockFillingSystems);
      
      const { result } = renderTestHook(() => useFillingSystem());
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFillingSystems);
      expect(getFillingSystems).toHaveBeenCalledTimes(1);
    });
    
    it('should handle filling system fetch error', async () => {
      // Use shared error test utility
      const { renderTestHook, mockFetch } = setupErrorTest();
      mockFetch.mockRejectedValue(new Error('Failed to fetch filling systems'));
      
      const { result } = renderTestHook(() => useFillingSystem());
      
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
      
      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockFillingSystems);
      
      const { result } = renderTestHook(() => useFillingSystem(filters));
      
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
      
      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockFillingSystem);
      
      const { result } = renderTestHook(() => useFillingSystemById('1'));
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.data).toEqual(mockFillingSystem);
      expect(getFillingSystemById).toHaveBeenCalledWith('1');
    });
    
    it('should not fetch filling system if id is empty', async () => {
      // Use shared test utility
      const { renderTestHook } = setupHookTest();
      
      const { result } = renderTestHook(() => useFillingSystemById(''));
      
      // It should not load or fetch
      expect(result.current.isLoading).toBe(false);
      expect(getFillingSystemById).not.toHaveBeenCalled();
    });
    
    it('should handle fetch error for a single filling system', async () => {
      // Use shared error test utility
      const { renderTestHook, mockFetch } = setupErrorTest();
      mockFetch.mockRejectedValue(new Error('Failed to fetch filling system'));
      
      const { result } = renderTestHook(() => useFillingSystemById('1'));
      
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
      
      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(createdFillingSystem);
      
      const { result } = renderTestHook(() => useFillingSystemMutations());
      
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
      
      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(updatedFillingSystem);
      
      const { result } = renderTestHook(() => useFillingSystemMutations());
      
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
      
      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(true);
      
      const { result } = renderTestHook(() => useFillingSystemMutations());
      
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
      
      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(true);
      
      const { result } = renderTestHook(() => useFillingSystemMutations());
      
      let validationResult;
      
      await act(async () => {
        validationResult = await result.current.validateTankIds(tankIds);
      });
      
      expect(validationResult).toBe(true);
      expect(validateTankIds).toHaveBeenCalledWith(tankIds);
    });
    
    it('should handle tank ID validation error', async () => {
      const tankIds = ['invalidTank'];
      const validationError = new Error('Invalid tank IDs');
      
      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockRejectedValue(validationError);
      
      const { result } = renderTestHook(() => useFillingSystemMutations());
      
      let error;
      
      await act(async () => {
        try {
          await result.current.validateTankIds(tankIds);
        } catch (e) {
          error = e;
        }
      });
      
      expect(error).toEqual(validationError);
      expect(validateTankIds).toHaveBeenCalledWith(tankIds);
    });
    
    it('should invalidate queries after successful mutations', async () => {
      // Setup a mock query client and spies
      const { queryClient, renderTestHook, mockMutate } = setupMutationTest();
      const spyInvalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
      
      // Mock a successful filling system creation
      const newFillingSystem = { name: 'Test System', tank_ids: ['tank1'], is_active: true };
      mockMutate.mockResolvedValue({ id: '3', ...newFillingSystem, created_at: '2023-01-05', updated_at: '2023-01-05' });
      
      const { result } = renderTestHook(() => useFillingSystemMutations());
      
      await act(async () => {
        result.current.createFillingSystem.mutate(newFillingSystem);
      });
      
      await waitFor(() => {
        expect(result.current.createFillingSystem.isSuccess).toBe(true);
      });
      
      // Verify that the cache was invalidated
      expect(spyInvalidateQueries).toHaveBeenCalledWith({ queryKey: ['filling-systems'] });
    });
  });
}); 