import { renderHook, act } from "@testing-library/react-hooks";
import { useBaseDialog } from "./useBaseDialog";

describe("useBaseDialog", () => {
  it("should initialize with closed state", () => {
    const { result } = renderHook(() => useBaseDialog());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.entity).toBe(null);
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should open dialog", () => {
    const { result } = renderHook(() => useBaseDialog());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it("should close dialog", () => {
    const { result } = renderHook(() => useBaseDialog());

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it("should set entity", () => {
    const { result } = renderHook(() => useBaseDialog<{ id: number }>());
    const testEntity = { id: 1 };

    act(() => {
      result.current.setEntity(testEntity);
    });

    expect(result.current.entity).toEqual(testEntity);
  });

  it("should set isSubmitting", () => {
    const { result } = renderHook(() => useBaseDialog());

    act(() => {
      result.current.setIsSubmitting(true);
    });

    expect(result.current.isSubmitting).toBe(true);

    act(() => {
      result.current.setIsSubmitting(false);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it("should handle open change callback", () => {
    const mockOnOpenChange = jest.fn();
    const { result } = renderHook(() =>
      useBaseDialog({
        onOpenChange: mockOnOpenChange,
      })
    );

    act(() => {
      result.current.onOpenChange(true);
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onOpenChange(false);
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    expect(result.current.isOpen).toBe(false);
  });

  it("should handle error", () => {
    const mockOnError = jest.fn();
    const { result } = renderHook(() =>
      useBaseDialog({
        onError: mockOnError,
      })
    );

    const testError = new Error("Test error");

    act(() => {
      result.current.handleError(testError);
    });

    expect(mockOnError).toHaveBeenCalledWith(testError);
  });
});
