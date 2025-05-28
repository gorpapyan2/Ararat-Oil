import { render, screen } from "@testing-library/react";
import { Table } from "./table";

describe("Table", () => {
  it("renders correctly", () => {
    render(<Table>Test content</Table>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Table className="custom-class">Test content</Table>);
    const element = screen.getByText("Test content");
    expect(element).toHaveClass("custom-class");
  });

  // Add more tests as needed
});
