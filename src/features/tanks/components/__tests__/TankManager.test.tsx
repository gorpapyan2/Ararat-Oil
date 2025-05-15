import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TankManager } from "../TankManager";
import { tanksService } from "../../services/tanksService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

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

// Mock the useTranslation hook
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("TankManager", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockTanks = [
    {
      id: "1",
      name: "Tank 1",
      fuel_type_id: "1",
      capacity: 1000,
      current_level: 500,
      created_at: "2024-01-01",
      updated_at: "2024-01-01",
    },
  ];

  const mockFuelTypes = [
    { id: "1", name: "Diesel" },
    { id: "2", name: "Petrol" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (tanksService.getTanks as any).mockResolvedValue(mockTanks);
    (tanksService.getFuelTypes as any).mockResolvedValue(mockFuelTypes);
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <TankManager />
      </QueryClientProvider>
    );
  };

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
    render(
      <QueryClientProvider client={queryClient}>
        <TankManager onRenderAction={onRenderAction} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(onRenderAction).toHaveBeenCalled();
    });
  });

  it("handles error state", async () => {
    (tanksService.getTanks as any).mockRejectedValue(new Error("Failed to fetch"));
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