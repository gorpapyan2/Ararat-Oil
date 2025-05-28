import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankManager } from "../TankManager";
import { tanksService } from "../../services/tanksService";
import { vi, describe, it, expect, beforeEach, type MockedFunction } from "vitest";
import { setupComponentWrapper } from "@/test/utils/test-wrappers";
import type { FuelTank, FuelType } from "../../types";

// Mock the tanks service
vi.mock("../../services/tanksService", () => ({
  tanksService: {
    getTanks: vi.fn(),
    getFuelTypes: vi.fn(),
  },
}));

// Mock the useDialog hook
vi.mock("@/hooks/useDialog", () => ({
  useDialog: () => ({
    isOpen: false,
    onOpenChange: vi.fn(),
    open: vi.fn(),
  }),
}));

describe("TankManager", () => {
  const mockTanks: FuelTank[] = [
    {
      id: "1",
      name: "Tank 1",
      fuel_type_id: "1",
      capacity: 1000,
      current_level: 500,
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ];

  const mockFuelTypes: FuelType[] = [
    { id: "1", name: "Diesel" },
    { id: "2", name: "Petrol" },
  ];

  const setup = () => {
    // Use the shared test utility
    const { renderWithProviders, mockTranslation } = setupComponentWrapper();

    beforeEach(() => {
      vi.clearAllMocks();
      (tanksService.getTanks as MockedFunction<typeof tanksService.getTanks>).mockResolvedValue(mockTanks);
      (tanksService.getFuelTypes as MockedFunction<typeof tanksService.getFuelTypes>).mockResolvedValue(mockFuelTypes);
      mockTranslation.mockImplementation((key) => key);
    });

    const renderComponent = (props = {}) => {
      return renderWithProviders(<TankManager {...props} />);
    };

    return { renderComponent };
  };

  const { renderComponent } = setup();

  it("renders loading state initially", () => {
    renderComponent();
    expect(screen.getByText("tanks.noTanksFound")).toBeInTheDocument();
  });

  it("renders tanks after loading", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("Tank 1")).toBeInTheDocument();
    });
  });

  it("renders action buttons", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("tanks.editLevels")).toBeInTheDocument();
      expect(screen.getByText("tanks.addNew")).toBeInTheDocument();
    });
  });

  it("handles edit mode toggle", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("tanks.editLevels")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("tanks.editLevels"));
    expect(screen.getByText("tanks.editLevels")).toBeInTheDocument();
  });

  it("handles custom action rendering", async () => {
    const onRenderAction = vi.fn();
    renderComponent({ onRenderAction });

    await waitFor(() => {
      expect(onRenderAction).toHaveBeenCalled();
    });
  });

  it("handles error state", async () => {
    (tanksService.getTanks as MockedFunction<typeof tanksService.getTanks>).mockRejectedValue(
      new Error("Failed to fetch")
    );
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("tanks.noTanksFound")).toBeInTheDocument();
    });
  });

  it("refetches data on interval", async () => {
    vi.useFakeTimers();
    renderComponent();

    await waitFor(() => {
      expect(tanksService.getTanks).toHaveBeenCalledTimes(1);
    });

    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(tanksService.getTanks).toHaveBeenCalledTimes(2);
    });

    vi.useRealTimers();
  });
});
