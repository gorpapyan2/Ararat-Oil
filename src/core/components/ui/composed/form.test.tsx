import { render, screen } from "@testing-library/react";
import { Form } from "./form";

describe("Form", () => {
  it("renders correctly", () => {
    render(<Form>Test content</Form>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Form className="custom-class">Test content</Form>);
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
