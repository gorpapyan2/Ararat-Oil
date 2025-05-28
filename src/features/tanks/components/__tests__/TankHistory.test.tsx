import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankHistory } from "../TankHistory";
import { vi } from "vitest";
import { tanksService } from "../../services/tanksService";

// Mock the useTranslation hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the tanksService
vi.mock("../../services/tanksService", () => ({
  tanksService: {
    getTankLevelChanges: vi.fn(),
  },
}));

describe("TankHistory", () => {
  const mockTank = {
    id: "1",
    name: "Tank 1",
    fuel_type: { id: "1", name: "Diesel" },
    capacity: 1000,
    current_level: 500,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const mockLevelChanges = [
    {
      id: "1",
      tank_id: "1",
      previous_level: 400,
      new_level: 500,
      change_amount: 100,
      change_type: "add",
      created_at: "2024-01-02T10:00:00Z",
      metadata: { reason: "Refill" },
    },
    {
      id: "2",
      tank_id: "1",
      previous_level: 500,
      new_level: 450,
      change_amount: 50,
      change_type: "subtract",
      created_at: "2024-01-03T10:00:00Z",
      metadata: { reason: "Usage" },
    },
  ];

  const defaultProps = {
    tank: mockTank,
    onClose: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<TankHistory {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (tanksService.getTankLevelChanges as any).mockResolvedValue(
      mockLevelChanges
    );
  });

  it("renders the component with tank details", () => {
    renderComponent();
    expect(screen.getByText("Tank 1 history")).toBeInTheDocument();
    expect(screen.getByText("Diesel")).toBeInTheDocument();
  });

  it("loads and displays level changes", async () => {
    renderComponent();

    // Check loading state
    expect(screen.getByText("common.loading")).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(tanksService.getTankLevelChanges).toHaveBeenCalledWith("1");
    });

    // Check if changes are displayed
    expect(screen.getByText("Refill")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
    expect(screen.getByText("+100 liters")).toBeInTheDocument();
    expect(screen.getByText("-50 liters")).toBeInTheDocument();
  });

  it("handles API error", async () => {
    const mockError = new Error("API Error");
    (tanksService.getTankLevelChanges as any).mockRejectedValueOnce(mockError);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("tanks.historyLoadFailed")).toBeInTheDocument();
    });
  });

  it("handles empty history", async () => {
    (tanksService.getTankLevelChanges as any).mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("tanks.noHistoryFound")).toBeInTheDocument();
    });
  });

  it("handles close button click", () => {
    renderComponent();
    fireEvent.click(screen.getByText("common.close"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("formats dates correctly", async () => {
    renderComponent();

    await waitFor(() => {
      // Check if dates are formatted correctly
      expect(screen.getByText("Jan 2, 2024, 10:00 AM")).toBeInTheDocument();
      expect(screen.getByText("Jan 3, 2024, 10:00 AM")).toBeInTheDocument();
    });
  });

  it("displays correct change indicators", async () => {
    renderComponent();

    await waitFor(() => {
      // Check for add indicator
      const addIndicator = screen.getByText("+100 liters");
      expect(addIndicator).toHaveClass("text-green-500");

      // Check for subtract indicator
      const subtractIndicator = screen.getByText("-50 liters");
      expect(subtractIndicator).toHaveClass("text-red-500");
    });
  });

  it("displays correct level percentages", async () => {
    renderComponent();

    await waitFor(() => {
      // Check previous level percentages
      expect(screen.getByText("40%")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();

      // Check new level percentages
      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("45%")).toBeInTheDocument();
    });
  });
});
