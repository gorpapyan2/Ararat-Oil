import { useState, useCallback } from "react";
import { useToast } from "@/core/hooks/useToast";
import { z } from "zod";

// Types for report parameters
export interface ReportParameters {
  startDate: string;
  endDate: string;
  reportType: ReportType;
  includeDetails: boolean;
  format: ReportFormat;
}

// Report types
export enum ReportType {
  SALES = "sales",
  INVENTORY = "inventory",
  EXPENSES = "expenses",
  EMPLOYEE_PERFORMANCE = "employee_performance",
  FUEL_SUPPLY = "fuel_supply",
}

// Report formats
export enum ReportFormat {
  PDF = "pdf",
  EXCEL = "excel",
  CSV = "csv",
}

// Report result
export interface ReportResult {
  id: string;
  name: string;
  createdAt: string;
  downloadUrl: string;
  size: number;
  format: ReportFormat;
}

// Validation schema for report parameters
export const reportParametersSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
    reportType: z.nativeEnum(ReportType, {
      errorMap: () => ({ message: "Please select a valid report type" }),
    }),
    includeDetails: z.boolean(),
    format: z.nativeEnum(ReportFormat, {
      errorMap: () => ({ message: "Please select a valid format" }),
    }),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Start date must be before or equal to end date",
    path: ["startDate"],
  });

// Mock function to generate report
const generateReport = async (
  params: ReportParameters
): Promise<ReportResult> => {
  // Simulate API call with 2 second delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    id: Math.random().toString(36).substring(2, 9),
    name: `${params.reportType}_${params.startDate}_to_${params.endDate}`,
    createdAt: new Date().toISOString(),
    downloadUrl: `#/reports/download/${Math.random().toString(36).substring(2, 9)}`,
    size: Math.floor(Math.random() * 1000) + 100, // Random size between 100-1100KB
    format: params.format,
  };
};

// Hook options
export interface UseReportGeneratorOptions {
  /**
   * Callback when a report is successfully generated
   */
  onReportGenerated?: (report: ReportResult) => void;

  /**
   * Default report parameters
   */
  defaultParameters?: Partial<ReportParameters>;
}

/**
 * Hook for generating reports with loading state, validation and error handling
 *
 * This hook demonstrates composing multiple hooks (useToast)
 * to create a feature-specific hook for report generation.
 */
export function useReportGenerator(options?: UseReportGeneratorOptions) {
  const [reportResult, setReportResult] = useState<ReportResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { success, error: showError } = useToast();

  // State for report parameters form
  const [parameters, setParameters] = useState<ReportParameters>({
    startDate: options?.defaultParameters?.startDate || getDefaultStartDate(),
    endDate: options?.defaultParameters?.endDate || getDefaultEndDate(),
    reportType: options?.defaultParameters?.reportType || ReportType.SALES,
    includeDetails: options?.defaultParameters?.includeDetails ?? true,
    format: options?.defaultParameters?.format || ReportFormat.PDF,
  });

  // Function to get default start date (1 month ago)
  function getDefaultStartDate(): string {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  }

  // Function to get default end date (today)
  function getDefaultEndDate(): string {
    return new Date().toISOString().split("T")[0];
  }

  // Update report parameters
  const updateParameters = useCallback(
    (newParams: Partial<ReportParameters>) => {
      setParameters((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  // Function to generate report
  const generateReportHandler = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Validate parameters
      reportParametersSchema.parse(parameters);

      // Generate report
      const result = await generateReport(parameters);

      // Set report result
      setReportResult(result);

      // Show success notification
      success({
        title: "Report Generated",
        description: `Your ${parameters.reportType} report has been generated successfully.`,
      });

      // Call callback if provided
      options?.onReportGenerated?.(result);

      return result;
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors.map((e) => e.message).join(", ");
        showError({
          title: "Validation Error",
          description: errorMessage,
        });
      } else {
        // Handle other errors
        console.error("Error generating report:", error);
        showError({
          title: "Report Generation Failed",
          description: "Failed to generate report. Please try again.",
        });
      }

      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [parameters, success, showError, options]);

  // Function to download report
  const downloadReport = useCallback(() => {
    if (!reportResult) {
      showError({
        title: "No Report Available",
        description:
          "Please generate a report first before trying to download.",
      });
      return;
    }

    // In a real application, this would trigger the download
    window.open(reportResult.downloadUrl, "_blank");

    success({
      title: "Download Started",
      description: `Your ${reportResult.format} report is being downloaded.`,
    });
  }, [reportResult, success, showError]);

  return {
    // Report parameters
    parameters,
    updateParameters,

    // Report generation
    generateReport: generateReportHandler,
    isGenerating,

    // Report result
    reportResult,
    downloadReport,

    // Clear report result
    clearReport: () => setReportResult(null),
  };
}
