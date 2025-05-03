import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LoadingButton } from "./loading-button";

// Mock the Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, isLoading, loadingText, onClick, ...props }: any) => (
    <button 
      onClick={onClick} 
      data-loading={isLoading ? "true" : "false"}
      {...props}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  ),
}));

describe("LoadingButton", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly", () => {
    render(<LoadingButton onClick={() => {}}>Click me</LoadingButton>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("shows loading state during async operations", async () => {
    const user = userEvent.setup();
    const mockAsyncFunction = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    });

    render(
      <LoadingButton 
        onClick={mockAsyncFunction}
        loadingText="Loading..."
      >
        Click me
      </LoadingButton>
    );

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    // Check that the button shows loading state
    expect(button.getAttribute("data-loading")).toBe("true");
    expect(button).toHaveTextContent("Loading...");

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(button.getAttribute("data-loading")).toBe("false");
      expect(button).toHaveTextContent("Click me");
    });

    expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
  });

  it("handles sync operations", async () => {
    const user = userEvent.setup();
    const mockSyncFunction = vi.fn();

    render(<LoadingButton onClick={mockSyncFunction}>Click me</LoadingButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    // The button should briefly show loading state then return to normal
    await waitFor(() => {
      expect(button.getAttribute("data-loading")).toBe("false");
    });

    expect(mockSyncFunction).toHaveBeenCalledTimes(1);
  });

  it("handles errors in onClick", async () => {
    const user = userEvent.setup();
    const mockErrorFunction = vi.fn().mockImplementation(() => {
      throw new Error("Test error");
    });

    // Mock console.error to avoid test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(<LoadingButton onClick={mockErrorFunction}>Click me</LoadingButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    // Wait for the button to return to non-loading state
    await waitFor(() => {
      expect(button.getAttribute("data-loading")).toBe("false");
    });

    expect(mockErrorFunction).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalled();

    // Restore console.error
    console.error = originalConsoleError;
  });

  it("is initially in loading state when initialLoading is true", () => {
    render(
      <LoadingButton 
        onClick={() => {}} 
        initialLoading={true}
        loadingText="Loading..."
      >
        Click me
      </LoadingButton>
    );

    const button = screen.getByRole("button");
    expect(button.getAttribute("data-loading")).toBe("true");
    expect(button).toHaveTextContent("Loading...");
  });

  it("is disabled when in loading state", async () => {
    const user = userEvent.setup();
    let resolvePromise: Function;
    const mockAsyncFunction = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolvePromise = resolve;
      });
    });

    render(<LoadingButton onClick={mockAsyncFunction}>Click me</LoadingButton>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    // Check that the button is disabled
    expect(button).toHaveAttribute("disabled");

    // Resolve the promise to complete the async operation
    resolvePromise();

    // Wait for the button to be enabled again
    await waitFor(() => {
      expect(button).not.toHaveAttribute("disabled");
    });
  });
}); 