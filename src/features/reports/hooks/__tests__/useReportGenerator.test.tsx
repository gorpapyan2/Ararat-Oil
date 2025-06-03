import { renderHook, act } from "@testing-library/react";
import {
  useReportGenerator,
  ReportType,
  ReportFormat,
  reportParametersSchema,
} from "../useReportGenerator";
import { vi, describe, it, expect, beforeEach } from "vitest";

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

// Mock the useFormSubmitHandler hook
vi.mock("@/shared/hooks/form", () => ({
  useFormSubmitHandler: ({ onSubmit }: { onSubmit: () => Promise<void> }) => ({
    handleSubmit: async () => await onSubmit(),
    isSubmitting: false,
    error: null,
  }),
}));

describe("useReportGenerator", () => {
  // Get the current date for testing
  const currentDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(currentDate.getMonth() - 1);
  const formattedStartDate = defaultStartDate.toISOString().split("T")[0];
  const formattedEndDate = currentDate.toISOString().split("T")[0];

  // Default test parameters
  const testParameters = {
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    reportType: ReportType.SALES,
    includeDetails: true,
    format: ReportFormat.PDF,
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it("should initialize with default parameters", () => {
    const { result } = renderHook(() => useReportGenerator());

    expect(result.current.parameters).toEqual({
      startDate: expect.any(String),
      endDate: expect.any(String),
      reportType: ReportType.SALES,
      includeDetails: true,
      format: ReportFormat.PDF,
    });
  });

  it("should initialize with provided default parameters", () => {
    const defaultParameters = {
      startDate: "2025-02-01",
      endDate: "2025-02-28",
      reportType: ReportType.INVENTORY,
      includeDetails: false,
      format: ReportFormat.EXCEL,
    };

    const { result } = renderHook(() =>
      useReportGenerator({ defaultParameters })
    );

    expect(result.current.parameters).toEqual(defaultParameters);
  });

  it("should update parameters correctly", () => {
    const { result } = renderHook(() => useReportGenerator());

    act(() => {
      result.current.updateParameters({ reportType: ReportType.EXPENSES });
    });

    expect(result.current.parameters.reportType).toBe(ReportType.EXPENSES);
  });

  it("should validate parameters using zod schema", () => {
    // Valid parameters
    expect(() => reportParametersSchema.parse(testParameters)).not.toThrow();

    // Invalid start date format
    expect(() =>
      reportParametersSchema.parse({
        ...testParameters,
        startDate: "01/01/2025", // Wrong format
      })
    ).toThrow();

    // End date before start date
    expect(() =>
      reportParametersSchema.parse({
        ...testParameters,
        startDate: "2025-02-01",
        endDate: "2025-01-01",
      })
    ).toThrow();

    // Invalid report type
    expect(() =>
      reportParametersSchema.parse({
        ...testParameters,
        reportType: "invalid_type" as ReportType,
      })
    ).toThrow();
  });

  it("should generate report and set result", async () => {
    const onReportGenerated = vi.fn();
    const { result } = renderHook(() =>
      useReportGenerator({
        defaultParameters: testParameters,
        onReportGenerated,
      })
    );

    // Initial state should have no report result
    expect(result.current.reportResult).toBeNull();

    // Generate report
    await act(async () => {
      await result.current.generateReport();
    });

    // Should have a report result
    expect(result.current.reportResult).not.toBeNull();
    expect(result.current.reportResult).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.stringContaining(testParameters.reportType),
        createdAt: expect.any(String),
        downloadUrl: expect.any(String),
        size: expect.any(Number),
        format: testParameters.format,
      })
    );

    // Callback should be called
    expect(onReportGenerated).toHaveBeenCalledWith(result.current.reportResult);
  });

  it("should clear report result", async () => {
    const { result } = renderHook(() =>
      useReportGenerator({ defaultParameters: testParameters })
    );

    // Generate report
    await act(async () => {
      await result.current.generateReport();
    });

    // Should have a report result
    expect(result.current.reportResult).not.toBeNull();

    // Clear report
    act(() => {
      result.current.clearReport();
    });

    // Report result should be null
    expect(result.current.reportResult).toBeNull();
  });

  it("should provide a download report function", async () => {
    const { result } = renderHook(() =>
      useReportGenerator({ defaultParameters: testParameters })
    );

    // Mock window.open
    const originalWindowOpen = window.open;
    window.open = vi.fn();

    // Generate report
    await act(async () => {
      await result.current.generateReport();
    });

    // Download report
    act(() => {
      result.current.downloadReport();
    });

    // window.open should be called with the download URL
    expect(window.open).toHaveBeenCalledWith(
      result.current.reportResult?.downloadUrl,
      "_blank"
    );

    // Restore original window.open
    window.open = originalWindowOpen;
  });
});
