import { render, screen } from "@testing-library/react";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders correctly", () => {
    render(<Slider>Test content</Slider>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Slider className="custom-class">Test content</Slider>);
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
