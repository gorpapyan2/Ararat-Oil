import { renderHook, act } from "@testing-library/react-hooks";
import { useToast } from "./useToast";

describe("useToast", () => {
  // Save original console.log
  const originalConsoleLog = console.log;

  // Mock console.log
  beforeEach(() => {
    console.log = jest.fn();
  });

  // Restore console.log after tests
  afterAll(() => {
    console.log = originalConsoleLog;
  });

  it("should return toast function and convenience methods", () => {
    const { result } = renderHook(() => useToast());

    expect(result.current).toHaveProperty("toast");
    expect(result.current).toHaveProperty("dismiss");
    expect(result.current).toHaveProperty("success");
    expect(result.current).toHaveProperty("error");
    expect(result.current).toHaveProperty("warning");
    expect(result.current).toHaveProperty("info");

    expect(typeof result.current.toast).toBe("function");
    expect(typeof result.current.dismiss).toBe("function");
    expect(typeof result.current.success).toBe("function");
    expect(typeof result.current.error).toBe("function");
    expect(typeof result.current.warning).toBe("function");
    expect(typeof result.current.info).toBe("function");
  });

  it("should call console.log when toast is called", () => {
    const { result } = renderHook(() => useToast());

    const toastOptions = {
      title: "Test Toast",
      description: "This is a test",
    };

    act(() => {
      result.current.toast(toastOptions);
    });

    expect(console.log).toHaveBeenCalledWith("TOAST:", toastOptions);
  });

  it("should return toast controls", () => {
    const { result } = renderHook(() => useToast());

    const toastOptions = {
      title: "Test Toast",
      description: "This is a test",
    };

    let toastResult;
    act(() => {
      toastResult = result.current.toast(toastOptions);
    });

    expect(toastResult).toHaveProperty("id");
    expect(toastResult).toHaveProperty("dismiss");
    expect(toastResult).toHaveProperty("update");

    expect(typeof toastResult.dismiss).toBe("function");
    expect(typeof toastResult.update).toBe("function");
  });

  it("should log when dismiss is called", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.dismiss();
    });

    expect(console.log).toHaveBeenCalledWith("DISMISS TOAST:", "all");

    act(() => {
      result.current.dismiss("test-id");
    });

    expect(console.log).toHaveBeenCalledWith("DISMISS TOAST:", "test-id");
  });

  it("should call toast with appropriate variant for success", () => {
    const { result } = renderHook(() => useToast());

    const toastOptions = {
      title: "Success",
      description: "This succeeded",
    };

    act(() => {
      result.current.success(toastOptions);
    });

    expect(console.log).toHaveBeenCalledWith("TOAST:", {
      ...toastOptions,
      variant: "success",
    });
  });

  it("should call toast with appropriate variant for error", () => {
    const { result } = renderHook(() => useToast());

    const toastOptions = {
      title: "Error",
      description: "This failed",
    };

    act(() => {
      result.current.error(toastOptions);
    });

    expect(console.log).toHaveBeenCalledWith("TOAST:", {
      ...toastOptions,
      variant: "destructive",
    });
  });

  it("should call toast with appropriate variant for warning", () => {
    const { result } = renderHook(() => useToast());

    const toastOptions = {
      title: "Warning",
      description: "This is a warning",
    };

    act(() => {
      result.current.warning(toastOptions);
    });

    expect(console.log).toHaveBeenCalledWith("TOAST:", {
      ...toastOptions,
      variant: "warning",
    });
  });

  it("should call toast with appropriate variant for info", () => {
    const { result } = renderHook(() => useToast());

    const toastOptions = {
      title: "Info",
      description: "This is information",
    };

    act(() => {
      result.current.info(toastOptions);
    });

    expect(console.log).toHaveBeenCalledWith("TOAST:", {
      ...toastOptions,
      variant: "info",
    });
  });
});
