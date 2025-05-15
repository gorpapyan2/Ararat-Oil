import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankList } from "../TankList";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the useTranslation hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("TankList", () => {
  const mockTanks = [
    {
      id: "1",
      name: "Tank 1",
      fuel_type_id: "1",
      fuel_type: { id: "1", name: "Diesel" },
      capacity: 1000,
      current_level: 500,
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
    {
      id: "2",
      name: "Tank 2",
      fuel_type_id: "2",
      fuel_type: { id: "2", name: "Petrol" },
      capacity: 2000,
      current_level: 100,
      is_active: true,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ];

  const defaultProps = {
    tanks: mockTanks,
    isLoading: false,
    isEditMode: false,
    onEditComplete: vi.fn(),
  };

  const renderComponent = (props = {}) => {
    const testQueryClient = createTestQueryClient();
    return render(
      <QueryClientProvider client={testQueryClient}>
        <TankList {...defaultProps} {...props} />
      </QueryClientProvider>
    );
  };

  it("renders loading state", () => {
    renderComponent({ isLoading: true });
    // Check for skeleton elements
    expect(screen.getAllByTestId("skeleton")).toHaveLength(9); // 3 cards * 3 skeletons each
  });

  it("renders empty state", () => {
    renderComponent({ tanks: [] });
    expect(screen.getByText("tanks.noTanksFound")).toBeInTheDocument();
    expect(screen.getByText("tanks.addTankPrompt")).toBeInTheDocument();
  });

  it("renders tank cards", () => {
    renderComponent();
    expect(screen.getByText("Tank 1")).toBeInTheDocument();
    expect(screen.getByText("Tank 2")).toBeInTheDocument();
    expect(screen.getByText("Diesel")).toBeInTheDocument();
    expect(screen.getByText("Petrol")).toBeInTheDocument();
  });

  it("displays correct tank levels and percentages", () => {
    renderComponent();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("common.liters", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("5%")).toBeInTheDocument();
  });

  it("opens history dialog when clicking a tank card", async () => {
    renderComponent();
    fireEvent.click(screen.getByText("Tank 1"));
    
    await waitFor(() => {
      expect(screen.getByText("Tank 1 history")).toBeInTheDocument();
    });
  });

  it("shows edit button in edit mode", () => {
    renderComponent({ isEditMode: true });
    expect(screen.getAllByText("tanks.editLevels")).toHaveLength(2);
  });

  it("handles edit level button click", () => {
    renderComponent({ isEditMode: true });
    fireEvent.click(screen.getAllByText("tanks.editLevels")[0]);
    
    // Check if TankLevelEditor is rendered
    expect(screen.getByLabelText("tanks.amount")).toBeInTheDocument();
  });

  it("applies correct progress bar colors based on level", () => {
    renderComponent();
    
    // Tank 1: 50% - should be blue
    const tank1Progress = screen.getAllByRole("progressbar")[0];
    expect(tank1Progress).toHaveClass("bg-blue-500");
    
    // Tank 2: 5% - should be red
    const tank2Progress = screen.getAllByRole("progressbar")[1];
    expect(tank2Progress).toHaveClass("bg-red-500");
  });

  it("handles edit complete callback", () => {
    const onEditComplete = vi.fn();
    renderComponent({ isEditMode: true, onEditComplete });
    
    fireEvent.click(screen.getAllByText("tanks.editLevels")[0]);
    fireEvent.click(screen.getByText("common.cancel"));
    
    expect(onEditComplete).toHaveBeenCalled();
  });

  it("disables click events in edit mode", () => {
    renderComponent({ isEditMode: true });
    fireEvent.click(screen.getByText("Tank 1"));
    
    // History dialog should not be opened
    expect(screen.queryByText("Tank 1 history")).not.toBeInTheDocument();
  });
}); 