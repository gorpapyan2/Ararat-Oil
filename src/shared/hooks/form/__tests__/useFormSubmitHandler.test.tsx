import { renderHook, act } from "@testing-library/react-hooks";
import { useFormSubmitHandler } from "../useFormSubmitHandler";
import { useToast } from "../../ui";
import type { UseFormReturn, FieldValues } from "react-hook-form";

// Mock the useToast hook
jest.mock("../ui", () => ({
  useToast: jest.fn(),
}));

describe("useFormSubmitHandler", () => {
  // Mock form
  const mockForm: Partial<UseFormReturn<FieldValues>> = {
    handleSubmit: jest.fn((fn) => fn),
    reset: jest.fn(),
  };

  // Mock toast functions
  const mockToast = jest.fn();
  const mockSuccess = jest.fn();
  const mockError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock implementation for useToast
    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
      success: mockSuccess,
      error: mockError,
    });
  });

  it("should initialize with isSubmitting set to false", () => {
    const { result } = renderHook(() =>
      useFormSubmitHandler(mockForm as UseFormReturn<FieldValues>, jest.fn())
    );

    expect(result.current.isSubmitting).toBe(false);
  });

  it("should handle successful submission", async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    const mockOnSuccess = jest.fn();

    const { result } = renderHook(() =>
      useFormSubmitHandler(mockForm as UseFormReturn<FieldValues>, mockOnSubmit, {
        successMessage: "Success message",
        onSuccess: mockOnSuccess,
        showSuccessToast: true,
      })
    );

    // Check initial state
    expect(result.current.isSubmitting).toBe(false);

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    // Check submission flow
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: "Test" });
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockSuccess).toHaveBeenCalledWith({
      title: "Success",
      description: "Success message",
    });

    // Check final state
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should handle submission failure", async () => {
    const testError = new Error("Test error");
    const mockOnSubmit = jest.fn().mockRejectedValue(testError);
    const mockOnError = jest.fn();

    const { result } = renderHook(() =>
      useFormSubmitHandler(mockForm as UseFormReturn<FieldValues>, mockOnSubmit, {
        errorMessage: "Custom error message",
        onError: mockOnError,
        showErrorToast: true,
      })
    );

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    // Check error handling
    expect(mockOnSubmit).toHaveBeenCalledWith({ name: "Test" });
    expect(mockOnError).toHaveBeenCalledWith(testError);
    expect(mockError).toHaveBeenCalledWith({
      title: "Error",
      description: "Custom error message",
    });

    // Check final state
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should reset form after success when resetOnSuccess is true", async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useFormSubmitHandler(mockForm as UseFormReturn<FieldValues>, mockOnSubmit, {
        resetOnSuccess: true,
      })
    );

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    // Check that form was reset
    expect(mockForm.reset).toHaveBeenCalled();
  });

  it("should not show success toast when showSuccessToast is false", async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useFormSubmitHandler(mockForm as UseFormReturn<FieldValues>, mockOnSubmit, {
        successMessage: "Success message",
        showSuccessToast: false,
      })
    );

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    // Check that success toast was not shown
    expect(mockSuccess).not.toHaveBeenCalled();
  });

  it("should not show error toast when showErrorToast is false", async () => {
    const testError = new Error("Test error");
    const mockOnSubmit = jest.fn().mockRejectedValue(testError);

    const { result } = renderHook(() =>
      useFormSubmitHandler(mockForm as UseFormReturn<FieldValues>, mockOnSubmit, {
        errorMessage: "Error message",
        showErrorToast: false,
      })
    );

    // Submit the form
    await act(async () => {
      await result.current.handleSubmit({ name: "Test" });
    });

    // Check that error toast was not shown
    expect(mockError).not.toHaveBeenCalled();
  });
});
