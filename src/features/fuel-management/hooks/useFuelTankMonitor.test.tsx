import { renderHook, act, waitFor } from "@testing-library/react";
import { useFuelTankMonitor, FuelType, TankStatus } from "./useFuelTankMonitor";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock React Query
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

// Mock the useToast hook
vi.mock("@/shared/hooks/ui", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    toast: vi.fn(),
  }),
}));

// Mock API calls
const mockFetchTankData = vi.fn();
const mockUpdateTankLevel = vi.fn();
const mockStartRefilling = vi.fn();

// Setup test data
const mockTankData = {
  id: "tank123",
  name: "Tank T1",
  capacity: 10000,
  currentLevel: 5000,
  fuelType: FuelType.DIESEL,
  location: "Main Station",
  lastChecked: "2025-05-01T12:00:00Z",
  status: TankStatus.NORMAL,
};

// Mock our fetch tank function
global.fetch = vi.fn();

describe("useFuelTankMonitor", () => {
  beforeEach(() => {
    // Setup mocks for each test
    mockFetchTankData.mockResolvedValue(mockTankData);
    mockUpdateTankLevel.mockImplementation((tankId, newLevel) => ({
      ...mockTankData,
      currentLevel: newLevel,
      status: newLevel < 2000 ? TankStatus.LOW : TankStatus.NORMAL,
    }));
    mockStartRefilling.mockResolvedValue({
      ...mockTankData,
      status: TankStatus.REFILLING,
    });

    // Clear all timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it("should initialize with the provided tank ID", async () => {
    // Mock implementation for this test
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTankData,
    });

    const { result } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
      })
    );

    // Initial state should be loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have tank data
    expect(result.current.tank).not.toBeNull();
  });

  it("should calculate level percentage correctly", async () => {
    // Mock implementation for this test
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockTankData,
        capacity: 1000,
        currentLevel: 250, // 25%
      }),
    });

    const { result } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
      })
    );

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Level percentage should be 25%
    expect(result.current.getLevelPercentage()).toBe(25);
  });

  it("should detect low and critical tank levels", async () => {
    // Test for low level (25%)
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockTankData,
        capacity: 1000,
        currentLevel: 250, // 25%
      }),
    });

    const { result, rerender } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
        thresholds: {
          lowLevel: 30, // 30% for low level
          criticalLevel: 15, // 15% for critical level
        },
      })
    );

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should detect low level
    expect(result.current.isLow).toBe(true);
    expect(result.current.isCritical).toBe(false);

    // Test for critical level (10%)
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockTankData,
        capacity: 1000,
        currentLevel: 100, // 10%
      }),
    });

    // Re-render with critical level
    rerender();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should detect critical level
    expect(result.current.isLow).toBe(true);
    expect(result.current.isCritical).toBe(true);
  });

  it("should handle refilling the tank", async () => {
    // Mock implementation for this test
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTankData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTankData,
          status: TankStatus.REFILLING,
        }),
      });

    const onRefillStart = vi.fn();

    const { result } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
        onRefillStart,
      })
    );

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Start refilling
    await act(async () => {
      await result.current.startRefill();
    });

    // Should be refilling
    expect(result.current.isRefilling).toBe(true);

    // Callback should be called
    expect(onRefillStart).toHaveBeenCalled();
  });

  it("should update tank level", async () => {
    // Mock implementation for this test
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTankData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTankData,
          currentLevel: 7500,
        }),
      });

    const { result } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
      })
    );

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Update tank level
    await act(async () => {
      await result.current.updateLevel(7500);
    });

    // Tank level should be updated
    expect(result.current.tank?.currentLevel).toBe(7500);
  });

  it("should poll for tank data at the specified interval", async () => {
    // Mock implementation for this test
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTankData,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTankData,
          currentLevel: 4800,
        }),
      });

    const { result } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
        pollingInterval: 5000, // 5 seconds
      })
    );

    // Wait for initial data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Initial level should be 5000
    expect(result.current.tank?.currentLevel).toBe(5000);

    // Fast-forward time by polling interval
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Wait for updated data
    await waitFor(() => {
      expect(result.current.tank?.currentLevel).toBe(4800);
    });
  });

  it("should trigger auto-refill when level drops below threshold", async () => {
    // Mock implementation for this test
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTankData,
          capacity: 1000,
          currentLevel: 150, // 15%
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockTankData,
          capacity: 1000,
          currentLevel: 150,
          status: TankStatus.REFILLING,
        }),
      });

    const { result } = renderHook(() =>
      useFuelTankMonitor({
        tankId: "tank123",
        thresholds: {
          lowLevel: 30,
          criticalLevel: 15,
          autoRefillLevel: 20,
        },
        enableAutoRefill: true,
      })
    );

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Auto-refill should trigger
    expect(result.current.isRefilling).toBe(true);
  });
});
