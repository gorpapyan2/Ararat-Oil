import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankLevelEditor } from "../TankLevelEditor";
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
    adjustTankLevel: vi.fn(),
  },
}));

describe("TankLevelEditor", () => {
  const mockTank = {
    id: "1",
    name: "Tank 1",
    fuel_type: { id: "1", name: "Diesel" },
    capacity: 1000,
    current_level: 500,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const defaultProps = {
    tank: mockTank,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    return render(<TankLevelEditor {...defaultProps} {...props} />);
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

  it("handles add fuel adjustment", async () => {
    const mockResponse = { success: true };
    (tanksService.adjustTankLevel as any).mockResolvedValueOnce(mockResponse);

    renderComponent();
    
    // Select "Add Fuel" option
    fireEvent.click(screen.getByLabelText("tanks.adjustmentType"));
    fireEvent.click(screen.getByText("tanks.addFuel"));
    
    // Enter amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "100" },
    });
    
    // Submit form
    fireEvent.click(screen.getByText("common.save"));
    
    await waitFor(() => {
      expect(tanksService.adjustTankLevel).toHaveBeenCalledWith("1", {
        amount: 100,
        type: "add",
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("handles remove fuel adjustment", async () => {
    const mockResponse = { success: true };
    (tanksService.adjustTankLevel as any).mockResolvedValueOnce(mockResponse);

    renderComponent();
    
    // Select "Remove Fuel" option
    fireEvent.click(screen.getByLabelText("tanks.adjustmentType"));
    fireEvent.click(screen.getByText("tanks.removeFuel"));
    
    // Enter amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "50" },
    });
    
    // Submit form
    fireEvent.click(screen.getByText("common.save"));
    
    await waitFor(() => {
      expect(tanksService.adjustTankLevel).toHaveBeenCalledWith("1", {
        amount: 50,
        type: "subtract",
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("validates amount input", async () => {
    renderComponent();
    
    // Try to submit without amount
    fireEvent.click(screen.getByText("common.save"));
    expect(screen.getByText("tanks.amountRequired")).toBeInTheDocument();
    
    // Try to submit with negative amount
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "-10" },
    });
    fireEvent.click(screen.getByText("common.save"));
    expect(screen.getByText("tanks.amountMustBePositive")).toBeInTheDocument();
    
    // Try to submit with amount exceeding capacity
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "2000" },
    });
    fireEvent.click(screen.getByText("common.save"));
    expect(screen.getByText("tanks.amountExceedsCapacity")).toBeInTheDocument();
  });

  it("handles API error", async () => {
    const mockError = new Error("API Error");
    (tanksService.adjustTankLevel as any).mockRejectedValueOnce(mockError);

    renderComponent();
    
    // Enter amount and submit
    fireEvent.change(screen.getByLabelText("tanks.amount"), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByText("common.save"));
    
    await waitFor(() => {
      expect(screen.getByText("tanks.adjustmentFailed")).toBeInTheDocument();
    });
  });

  it("handles cancel button click", () => {
    renderComponent();
    fireEvent.click(screen.getByText("common.cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
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