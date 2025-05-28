import { render, screen } from "@testing-library/react";
import { DateRangePicker } from "./daterangepicker";

describe("DateRangePicker", () => {
  it("renders correctly", () => {
    render(<DateRangePicker>Test content</DateRangePicker>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <DateRangePicker className="custom-class">Test content</DateRangePicker>
    );
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
