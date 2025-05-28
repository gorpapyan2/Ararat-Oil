import { render, screen } from "@testing-library/react";
import { DropdownMenu } from "./dropdownmenu";

describe("DropdownMenu", () => {
  it("renders correctly", () => {
    render(<DropdownMenu>Test content</DropdownMenu>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<DropdownMenu className="custom-class">Test content</DropdownMenu>);
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
