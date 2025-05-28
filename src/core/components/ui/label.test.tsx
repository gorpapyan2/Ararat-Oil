import { render, screen } from "@testing-library/react";
import { Label } from "./label";

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Test content</Label>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Label className="custom-class">Test content</Label>);
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
