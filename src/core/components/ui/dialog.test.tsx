import { render, screen } from "@testing-library/react";
import { Dialog } from "./dialog";

describe("Dialog", () => {
  it("renders correctly", () => {
    render(<Dialog>Test content</Dialog>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Dialog className="custom-class">Test content</Dialog>);
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
