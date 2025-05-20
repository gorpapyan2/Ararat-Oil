import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankFormDialog } from "../TankFormDialog";
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
    createTank: vi.fn(),
    updateTank: vi.fn(),
    getFuelTypes: vi.fn(),
  },
}));

describe("TankFormDialog", () => {
  const mockFuelTypes = [
    { id: "1", name: "Diesel" },
    { id: "2", name: "Petrol" },
  ];

  const mockTank = {
    id: "1",
    name: "Tank 1",
    fuel_type_id: "1",
    capacity: 1000,
    current_level: 500,
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSuccess: vi.fn(),
    tank: undefined,
  };

  const renderComponent = (props = {}) => {
    return render(<TankFormDialog {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (tanksService.getFuelTypes as any).mockResolvedValue(mockFuelTypes);
  });

  it("renders create form when no tank is provided", async () => {
    renderComponent();
    
    expect(screen.getByText("tanks.createTank")).toBeInTheDocument();
    expect(screen.getByLabelText("tanks.name")).toBeInTheDocument();
    expect(screen.getByLabelText("tanks.fuelType")).toBeInTheDocument();
    expect(screen.getByLabelText("tanks.capacity")).toBeInTheDocument();
  });

  it("renders edit form when tank is provided", async () => {
    renderComponent({ tank: mockTank });
    
    expect(screen.getByText("tanks.editTank")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Tank 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1000")).toBeInTheDocument();
  });

  it("loads fuel types on mount", async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(tanksService.getFuelTypes).toHaveBeenCalled();
    });
    
    expect(screen.getByText("Diesel")).toBeInTheDocument();
    expect(screen.getByText("Petrol")).toBeInTheDocument();
  });

  it("handles create tank submission", async () => {
    const mockResponse = { success: true };
    (tanksService.createTank as any).mockResolvedValueOnce(mockResponse);

    renderComponent();
    
    // Fill form
    fireEvent.change(screen.getByLabelText("tanks.name"), {
      target: { value: "New Tank" },
    });
    fireEvent.click(screen.getByLabelText("tanks.fuelType"));
    fireEvent.click(screen.getByText("Diesel"));
    fireEvent.change(screen.getByLabelText("tanks.capacity"), {
      target: { value: "2000" },
    });
    
    // Submit form
    fireEvent.click(screen.getByText("common.save"));
    
    await waitFor(() => {
      expect(tanksService.createTank).toHaveBeenCalledWith({
        name: "New Tank",
        fuel_type_id: "1",
        capacity: 2000,
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("handles update tank submission", async () => {
    const mockResponse = { success: true };
    (tanksService.updateTank as any).mockResolvedValueOnce(mockResponse);

    renderComponent({ tank: mockTank });
    
    // Update form
    fireEvent.change(screen.getByLabelText("tanks.name"), {
      target: { value: "Updated Tank" },
    });
    fireEvent.change(screen.getByLabelText("tanks.capacity"), {
      target: { value: "1500" },
    });
    
    // Submit form
    fireEvent.click(screen.getByText("common.save"));
    
    await waitFor(() => {
      expect(tanksService.updateTank).toHaveBeenCalledWith("1", {
        name: "Updated Tank",
        fuel_type_id: "1",
        capacity: 1500,
      });
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it("validates required fields", async () => {
    renderComponent();
    
    // Try to submit without filling required fields
    fireEvent.click(screen.getByText("common.save"));
    
    expect(screen.getByText("tanks.nameRequired")).toBeInTheDocument();
    expect(screen.getByText("tanks.fuelTypeRequired")).toBeInTheDocument();
    expect(screen.getByText("tanks.capacityRequired")).toBeInTheDocument();
  });

  it("validates capacity input", async () => {
    renderComponent();
    
    // Try to submit with invalid capacity
    fireEvent.change(screen.getByLabelText("tanks.capacity"), {
      target: { value: "-100" },
    });
    fireEvent.click(screen.getByText("common.save"));
    
    expect(screen.getByText("tanks.capacityMustBePositive")).toBeInTheDocument();
  });

  it("handles API error", async () => {
    const mockError = new Error("API Error");
    (tanksService.createTank as any).mockRejectedValueOnce(mockError);

    renderComponent();
    
    // Fill form
    fireEvent.change(screen.getByLabelText("tanks.name"), {
      target: { value: "New Tank" },
    });
    fireEvent.click(screen.getByLabelText("tanks.fuelType"));
    fireEvent.click(screen.getByText("Diesel"));
    fireEvent.change(screen.getByLabelText("tanks.capacity"), {
      target: { value: "2000" },
    });
    
    // Submit form
    fireEvent.click(screen.getByText("common.save"));
    
    await waitFor(() => {
      expect(screen.getByText("tanks.saveFailed")).toBeInTheDocument();
    });
  });

  it("handles cancel button click", () => {
    renderComponent();
    fireEvent.click(screen.getByText("common.cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("handles dialog close", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: "close" }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
}); 