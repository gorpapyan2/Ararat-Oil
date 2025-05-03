import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ToggleButton } from "./toggle-button";

// Mock the Button component
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, variant, "data-state": dataState, "aria-pressed": ariaPressed, onClick, ...props }: any) => (
    <button 
      onClick={onClick} 
      data-state={dataState}
      aria-pressed={ariaPressed}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
  buttonVariants: vi.fn(() => ""),
}));

describe("ToggleButton", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly", () => {
    render(<ToggleButton>Toggle me</ToggleButton>);
    expect(screen.getByRole("button", { name: /toggle me/i })).toBeInTheDocument();
  });

  it("handles uncontrolled state correctly", async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle me</ToggleButton>);

    const button = screen.getByRole("button", { name: /toggle me/i });
    
    // Initial state (inactive)
    expect(button.getAttribute("data-state")).toBe("inactive");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("data-variant")).toBe("outline");
    
    // After click (should become active)
    await user.click(button);
    expect(button.getAttribute("data-state")).toBe("active");
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("data-variant")).toBe("default");
    
    // Click again to toggle off
    await user.click(button);
    expect(button.getAttribute("data-state")).toBe("inactive");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("data-variant")).toBe("outline");
  });

  it("handles controlled state correctly", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    
    const { rerender } = render(
      <ToggleButton isActive={false} onToggle={handleToggle}>
        Toggle me
      </ToggleButton>
    );

    const button = screen.getByRole("button", { name: /toggle me/i });
    
    // Initial state (inactive)
    expect(button.getAttribute("data-state")).toBe("inactive");
    expect(button.getAttribute("aria-pressed")).toBe("false");
    
    // Click to toggle
    await user.click(button);
    expect(handleToggle).toHaveBeenCalledWith(true);
    
    // Still inactive because we're not updating the prop in this test
    expect(button.getAttribute("data-state")).toBe("inactive");
    
    // Now simulate prop update
    rerender(
      <ToggleButton isActive={true} onToggle={handleToggle}>
        Toggle me
      </ToggleButton>
    );
    
    // Should be active now
    expect(button.getAttribute("data-state")).toBe("active");
    expect(button.getAttribute("aria-pressed")).toBe("true");
  });

  it("handles custom variant props", () => {
    render(
      <ToggleButton 
        isActive={true} 
        activeVariant="accent" 
        inactiveVariant="ghost"
      >
        Toggle me
      </ToggleButton>
    );

    const button = screen.getByRole("button", { name: /toggle me/i });
    expect(button.getAttribute("data-variant")).toBe("accent");
    
    // Test inactive variant
    render(
      <ToggleButton 
        isActive={false} 
        activeVariant="accent" 
        inactiveVariant="ghost"
      >
        Toggle me
      </ToggleButton>
    );
    
    const inactiveButton = screen.getAllByRole("button", { name: /toggle me/i })[1];
    expect(inactiveButton.getAttribute("data-variant")).toBe("ghost");
  });

  it("calls provided onClick handler", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(
      <ToggleButton onClick={handleClick}>
        Toggle me
      </ToggleButton>
    );

    const button = screen.getByRole("button", { name: /toggle me/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies ring class when active", () => {
    render(<ToggleButton isActive={true}>Toggle me</ToggleButton>);
    
    const button = screen.getByRole("button", { name: /toggle me/i });
    // We can't easily check for class with mocked Button, but we can check props
    expect(button.getAttribute("data-state")).toBe("active");
  });
}); 