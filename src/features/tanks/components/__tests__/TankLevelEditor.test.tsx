import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankLevelEditor } from "../TankLevelEditor";
import { vi, describe, it, expect, beforeEach, type MockedFunction } from "vitest";
import { tanksService } from "../../services/tanksService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FuelTank, TankLevelAdjustment, TankLevelChange } from "../../types";

// Mock the useTranslation hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the tanksService
vi.mock("../../services/tanksService", () => ({
  tanksService: {
    adjustTankLevel: vi.fn(),
  },
}));

// Mock the useToast hook
vi.mock("@/hooks", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Create a new QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe("TankLevelEditor", () => {
  const mockTank: FuelTank = {
    id: "1",
    name: "Tank 1",
    fuel_type_id: "1",
    fuel_type: { id: "1", name: "Diesel" },
    capacity: 1000,
    current_level: 500,
    is_active: true,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const defaultProps = {
    tank: mockTank,
    onComplete: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    const testQueryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={testQueryClient}>
        <TankLevelEditor {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with tank details", () => {
    renderComponent();
    expect(screen.getByText("Tank 1")).toBeInTheDocument();
    expect(screen.getByText("Diesel")).toBeInTheDocument();
    expect(screen.getByText("500 liters")).toBeInTheDocument();
  });

  it("renders the component with form elements", () => {
    renderComponent();
    expect(screen.getByLabelText("tanks.amount")).toBeInTheDocument();
    expect(screen.getByText("tanks.add")).toBeInTheDocument();
    expect(screen.getByText("tanks.subtract")).toBeInTheDocument();
    expect(screen.getByText("common.save")).toBeInTheDocument();
    expect(screen.getByText("common.cancel")).toBeInTheDocument();
  });

  it("handles add fuel adjustment", async () => {
    const mockResponse: TankLevelChange = {
      id: "new-change-id",
      tank_id: "1",
      previous_level: 500,
      new_level: 600,
      change_amount: 100,
      change_type: "add",
      created_by: "user-1",
      created_at: "2024-01-01T10:00:00Z",
      reason: "Tank level editor",
    };
    (tanksService.adjustTankLevel as MockedFunction<typeof tanksService.adjustTankLevel>).mockResolvedValueOnce(mockResponse);

    renderComponent();

    // Select "Add" option
    fireEvent.click(screen.getByLabelText("add"));

    // Enter amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "100" },
    });

    // Submit form
    fireEvent.click(screen.getByText("common.save"));

    await waitFor(() => {
      expect(tanksService.adjustTankLevel).toHaveBeenCalledWith("1", {
        change_amount: 100,
        change_type: "add",
        reason: "Tank level editor",
      });
      expect(defaultProps.onComplete).toHaveBeenCalled();
    });
  });

  it("handles remove fuel adjustment", async () => {
    const mockResponse: TankLevelChange = {
      id: "new-change-id",
      tank_id: "1",
      previous_level: 500,
      new_level: 450,
      change_amount: 50,
      change_type: "subtract",
      created_by: "user-1",
      created_at: "2024-01-01T10:00:00Z",
      reason: "Tank level editor",
    };
    (tanksService.adjustTankLevel as MockedFunction<typeof tanksService.adjustTankLevel>).mockResolvedValueOnce(mockResponse);

    renderComponent();

    // Select "Subtract" option
    fireEvent.click(screen.getByLabelText("subtract"));

    // Enter amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "50" },
    });

    // Submit form
    fireEvent.click(screen.getByText("common.save"));

    await waitFor(() => {
      expect(tanksService.adjustTankLevel).toHaveBeenCalledWith("1", {
        change_amount: 50,
        change_type: "subtract",
        reason: "Tank level editor",
      });
      expect(defaultProps.onComplete).toHaveBeenCalled();
    });
  });

  it("validates amount input", async () => {
    // Mock the toast function
    const toastMock = vi.fn();
    vi.mock("@/hooks", () => ({
      useToast: () => ({
        toast: toastMock,
      }),
    }));

    renderComponent();

    // Try to submit without amount
    fireEvent.click(screen.getByText("common.save"));

    // Try to submit with negative amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "-10" },
    });
    fireEvent.click(screen.getByText("common.save"));
  });

  it("handles API error", async () => {
    const mockError = new Error("API Error");
    (tanksService.adjustTankLevel as MockedFunction<typeof tanksService.adjustTankLevel>).mockRejectedValueOnce(mockError);

    renderComponent();

    // Enter amount and submit
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByText("common.save"));
  });

  it("handles cancel button click", () => {
    renderComponent();
    fireEvent.click(screen.getByText("common.cancel"));
    expect(defaultProps.onComplete).toHaveBeenCalled();
  });

  it("updates preview when amount changes", () => {
    renderComponent();

    // Enter amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "100" },
    });

    // Check preview
    expect(screen.getByText("600 liters")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("updates preview when adjustment type changes", () => {
    renderComponent();

    // Enter amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "100" },
    });

    // Change to remove fuel
    fireEvent.click(screen.getByLabelText("tanks.adjustmentType"));
    fireEvent.click(screen.getByText("tanks.removeFuel"));

    // Check preview
    expect(screen.getByText("400 liters")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
  });
});
