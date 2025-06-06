import { waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  useTanks,
  useTank,
  useTankLevelChanges,
  useFuelTypes,
  useTankMutations,
  useTanksManager,
} from "../useTanks";

// Import our shared test utilities
import {
  setupHookTest,
  setupErrorTest,
  setupMutationTest,
} from "@/test/utils/test-setup";

// Mock the services
vi.mock("../../services", () => ({
  getTanks: vi.fn(),
  getTankById: vi.fn(),
  getTankLevelChanges: vi.fn(),
  createTank: vi.fn(),
  updateTank: vi.fn(),
  deleteTank: vi.fn(),
  getFuelTypes: vi.fn(),
  adjustTankLevel: vi.fn(),
}));

import {
  getTanks,
  getTankById,
  getTankLevelChanges,
  createTank,
  updateTank,
  deleteTank,
  getFuelTypes,
  adjustTankLevel,
} from "../../services";

describe("Tanks Hooks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("useTanks", () => {
    it("should fetch tanks successfully", async () => {
      const mockTanks = [
        {
          id: "1",
          name: "Tank 1",
          fuel_type_id: "ft1",
          capacity: 1000,
          current_level: 700,
          is_active: true,
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
        },
        {
          id: "2",
          name: "Tank 2",
          fuel_type_id: "ft2",
          capacity: 2000,
          current_level: 1500,
          is_active: true,
          created_at: "2023-01-02",
          updated_at: "2023-01-02",
        },
      ];

      // Use shared setup utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockTanks);

      const { result } = renderTestHook(() => useTanks());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockTanks);
      expect(getTanks).toHaveBeenCalledTimes(1);
    });

    it("should handle tank fetch error", async () => {
      // Use shared error test setup
      const { renderTestHook, mockFetch } = setupErrorTest();
      mockFetch.mockRejectedValue(new Error("Failed to fetch tanks"));

      const { result } = renderTestHook(() => useTanks());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe("useTank", () => {
    it("should fetch a single tank successfully", async () => {
      const mockTank = {
        id: "1",
        name: "Tank 1",
        fuel_type_id: "ft1",
        capacity: 1000,
        current_level: 700,
        is_active: true,
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      };

      // Use shared setup utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockTank);

      const { result } = renderTestHook(() => useTank("1"));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockTank);
      expect(getTankById).toHaveBeenCalledWith("1");
    });

    it("should not fetch tank if id is empty", async () => {
      // Use shared setup utility
      const { renderTestHook } = setupHookTest();

      const { result } = renderTestHook(() => useTank(""));

      // It should not load or fetch
      expect(result.current.isLoading).toBe(false);
      expect(getTankById).not.toHaveBeenCalled();
    });
  });

  describe("useTankLevelChanges", () => {
    it("should fetch tank level changes successfully", async () => {
      const mockLevelChanges = [
        {
          id: "1",
          tank_id: "1",
          previous_level: 600,
          new_level: 700,
          change_amount: 100,
          change_type: "add",
          reason: "Refill",
          created_at: "2023-01-01",
          created_by: "user1",
        },
        {
          id: "2",
          tank_id: "1",
          previous_level: 700,
          new_level: 650,
          change_amount: 50,
          change_type: "subtract",
          reason: "Usage",
          created_at: "2023-01-02",
          created_by: "user1",
        },
      ];

      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockLevelChanges);

      const { result } = renderTestHook(() => useTankLevelChanges("1"));

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockLevelChanges);
      expect(getTankLevelChanges).toHaveBeenCalledWith("1");
    });
  });

  describe("useFuelTypes", () => {
    it("should fetch fuel types successfully", async () => {
      const mockFuelTypes = [
        { id: "ft1", name: "Diesel" },
        { id: "ft2", name: "Petrol" },
        { id: "ft3", name: "CNG" },
      ];

      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockFuelTypes);

      const { result } = renderTestHook(() => useFuelTypes());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockFuelTypes);
      expect(getFuelTypes).toHaveBeenCalledTimes(1);
    });
  });

  describe("useTankMutations", () => {
    it("should create a tank successfully", async () => {
      const newTank = {
        name: "New Tank",
        fuel_type_id: "ft1",
        capacity: 1500,
        current_level: 0,
        is_active: true,
      };

      const createdTank = {
        id: "3",
        ...newTank,
        created_at: "2023-01-03",
        updated_at: "2023-01-03",
      };

      // Use shared mutation test setup
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(createdTank);

      const { result } = renderTestHook(() => useTankMutations());

      await act(async () => {
        result.current.createTank.mutate(newTank);
      });

      await waitFor(() => {
        expect(result.current.createTank.isSuccess).toBe(true);
        expect(result.current.createTank.data).toEqual(createdTank);
      });

      expect(createTank).toHaveBeenCalledWith(newTank);
    });

    it("should update a tank successfully", async () => {
      const tankId = "1";
      const updateData = {
        name: "Updated Tank",
        capacity: 2000,
      };

      const updatedTank = {
        id: tankId,
        name: "Updated Tank",
        fuel_type_id: "ft1",
        capacity: 2000,
        current_level: 700,
        is_active: true,
        created_at: "2023-01-01",
        updated_at: "2023-01-04",
      };

      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(updatedTank);

      const { result } = renderTestHook(() => useTankMutations());

      await act(async () => {
        result.current.updateTank.mutate({ id: tankId, data: updateData });
      });

      await waitFor(() => {
        expect(result.current.updateTank.isSuccess).toBe(true);
        expect(result.current.updateTank.data).toEqual(updatedTank);
      });

      expect(updateTank).toHaveBeenCalledWith(tankId, updateData);
    });

    it("should delete a tank successfully", async () => {
      const tankId = "2";

      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(true);

      const { result } = renderTestHook(() => useTankMutations());

      await act(async () => {
        result.current.deleteTank.mutate(tankId);
      });

      await waitFor(() => {
        expect(result.current.deleteTank.isSuccess).toBe(true);
        expect(result.current.deleteTank.data).toBe(true);
      });

      expect(deleteTank).toHaveBeenCalledWith(tankId);
    });

    it("should adjust tank level successfully", async () => {
      const adjustmentData = {
        tankId: "1",
        changeAmount: 200,
        changeType: "add" as const,
        reason: "Scheduled refill",
      };

      const levelChangeResult = {
        id: "3",
        tank_id: "1",
        previous_level: 700,
        new_level: 900,
        change_amount: 200,
        change_type: "add",
        reason: "Scheduled refill",
        created_at: "2023-01-05",
        created_by: "system",
      };

      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(levelChangeResult);

      const { result } = renderTestHook(() => useTankMutations());

      await act(async () => {
        result.current.adjustTankLevel.mutate(adjustmentData);
      });

      await waitFor(() => {
        expect(result.current.adjustTankLevel.isSuccess).toBe(true);
        expect(result.current.adjustTankLevel.data).toEqual(levelChangeResult);
      });

      expect(adjustTankLevel).toHaveBeenCalledWith(adjustmentData.tankId, {
        change_amount: adjustmentData.changeAmount,
        change_type: adjustmentData.changeType,
        reason: adjustmentData.reason,
      });
    });
  });

  describe("useTanksManager", () => {
    it("should combine all tank hooks and provide aggregate data", async () => {
      const mockTanks = [
        {
          id: "1",
          name: "Tank 1",
          fuel_type_id: "ft1",
          capacity: 1000,
          current_level: 700,
          is_active: true,
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
        },
        {
          id: "2",
          name: "Tank 2",
          fuel_type_id: "ft2",
          capacity: 2000,
          current_level: 1500,
          is_active: true,
          created_at: "2023-01-02",
          updated_at: "2023-01-02",
        },
      ];

      const mockFuelTypes = [
        { id: "ft1", name: "Diesel" },
        { id: "ft2", name: "Petrol" },
      ];

      const { renderTestHook, mockFetch } = setupHookTest();

      // Mock both API calls
      mockFetch.mockImplementation((endpoint: string) => {
        if (endpoint.includes("fuel-types")) {
          return Promise.resolve(mockFuelTypes);
        }
        return Promise.resolve(mockTanks);
      });

      const { result } = renderTestHook(() => useTanksManager());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.tanks).toEqual(mockTanks);
        expect(result.current.fuelTypes).toEqual(mockFuelTypes);
      });

      // Check that mutation functions are available
      expect(result.current.createTank).toBeDefined();
      expect(result.current.updateTank).toBeDefined();
      expect(result.current.deleteTank).toBeDefined();
      expect(result.current.adjustTankLevel).toBeDefined();
    });
  });
});
