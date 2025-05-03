import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  StatsCard,
  MetricCard,
  ActionCard,
  SummaryCard,
  CardGrid,
} from "./cards";
import "@testing-library/jest-dom";

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  TrendingUpIcon: () => <svg data-testid="trending-up" />,
  TrendingDownIcon: () => <svg data-testid="trending-down" />,
  ArrowRightIcon: () => <svg data-testid="arrow-right" />,
}));

describe("Composed Card Components", () => {
  describe("StatsCard", () => {
    it("renders with all props", () => {
      const props = {
        title: "Revenue",
        value: "$45,231",
        change: {
          value: "12%",
          direction: "up",
        },
        icon: <span data-testid="custom-icon" />,
        className: "test-class",
      };

      render(<StatsCard {...props} />);
      
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("$45,231")).toBeInTheDocument();
      expect(screen.getByText("12%")).toBeInTheDocument();
      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      expect(screen.getByText("$45,231").closest(".card")).toHaveClass("test-class");
    });

    it("renders with down direction", () => {
      render(
        <StatsCard
          title="Expenses"
          value="$12,543"
          change={{
            value: "5%",
            direction: "down",
          }}
        />
      );
      
      const changeText = screen.getByText("5%");
      expect(changeText).toBeInTheDocument();
      expect(changeText.parentElement).toHaveClass("text-red-600");
    });
  });

  describe("MetricCard", () => {
    it("renders with all props", () => {
      const mockOnClick = jest.fn();
      
      render(
        <MetricCard
          title="Total Sales"
          value="1,234"
          description="Monthly sales volume"
          icon={<span data-testid="sales-icon" />}
          trend={{
            value: "23%",
            positive: true,
            label: "vs last month",
          }}
          footer={<span>View details</span>}
          onClick={mockOnClick}
        />
      );
      
      expect(screen.getByText("Total Sales")).toBeInTheDocument();
      expect(screen.getByText("1,234")).toBeInTheDocument();
      expect(screen.getByText("Monthly sales volume")).toBeInTheDocument();
      expect(screen.getByTestId("sales-icon")).toBeInTheDocument();
      expect(screen.getByText("23%")).toBeInTheDocument();
      expect(screen.getByText("vs last month")).toBeInTheDocument();
      expect(screen.getByText("View details")).toBeInTheDocument();
      expect(screen.getByTestId("trending-up")).toBeInTheDocument();
      
      fireEvent.click(screen.getByText("1,234").closest(".card"));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
    
    it("renders with loading state", () => {
      render(
        <MetricCard
          title="Total Sales"
          value="1,234"
          loading={true}
        />
      );
      
      expect(screen.getByText("Total Sales")).toBeInTheDocument();
      const card = screen.getByText("Total Sales").closest(".card");
      expect(card).toHaveClass("animate-pulse");
    });
  });

  describe("ActionCard", () => {
    it("renders with all props", () => {
      const mockAction = jest.fn();
      
      render(
        <ActionCard
          title="System Status"
          description="All systems operational"
          status="success"
          actionLabel="View details"
          onAction={mockAction}
          icon={<span data-testid="status-icon" />}
        />
      );
      
      expect(screen.getByText("System Status")).toBeInTheDocument();
      expect(screen.getByText("All systems operational")).toBeInTheDocument();
      expect(screen.getByText("View details")).toBeInTheDocument();
      expect(screen.getByTestId("status-icon")).toBeInTheDocument();
      
      // Find status indicator
      const statusIndicator = document.querySelector(".bg-green-500");
      expect(statusIndicator).toBeInTheDocument();
      
      fireEvent.click(screen.getByText("View details"));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
    
    it("renders different status colors", () => {
      const { rerender } = render(
        <ActionCard
          title="Warning"
          status="warning"
        />
      );
      
      expect(document.querySelector(".bg-amber-500")).toBeInTheDocument();
      
      rerender(
        <ActionCard
          title="Error"
          status="error"
        />
      );
      
      expect(document.querySelector(".bg-red-500")).toBeInTheDocument();
    });
  });

  describe("SummaryCard", () => {
    it("renders with metrics and action", () => {
      const mockAction = jest.fn();
      
      render(
        <SummaryCard
          title="Sales Overview"
          metrics={[
            { label: "Total Sales", value: "$12,345", color: "default" },
            { label: "Revenue", value: "$9,876", color: "success" },
            { label: "Refunds", value: "$1,234", color: "danger" }
          ]}
          action={{
            label: "View Report",
            onClick: mockAction
          }}
        />
      );
      
      expect(screen.getByText("Sales Overview")).toBeInTheDocument();
      expect(screen.getByText("Total Sales")).toBeInTheDocument();
      expect(screen.getByText("$12,345")).toBeInTheDocument();
      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("$9,876")).toBeInTheDocument();
      expect(screen.getByText("Refunds")).toBeInTheDocument();
      expect(screen.getByText("$1,234")).toBeInTheDocument();
      expect(screen.getByText("View Report")).toBeInTheDocument();
      
      fireEvent.click(screen.getByText("View Report"));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("CardGrid", () => {
    it("renders a grid of metrics", () => {
      render(
        <CardGrid
          metrics={[
            { title: "Sales", value: "$12,345", icon: <span data-testid="sales-icon" /> },
            { title: "Customers", value: "1,234", icon: <span data-testid="customers-icon" /> }
          ]}
          className="test-grid-class"
        />
      );
      
      expect(screen.getByText("Sales")).toBeInTheDocument();
      expect(screen.getByText("$12,345")).toBeInTheDocument();
      expect(screen.getByText("Customers")).toBeInTheDocument();
      expect(screen.getByText("1,234")).toBeInTheDocument();
      expect(screen.getByTestId("sales-icon")).toBeInTheDocument();
      expect(screen.getByTestId("customers-icon")).toBeInTheDocument();
      
      const grid = document.querySelector(".grid");
      expect(grid).toHaveClass("test-grid-class");
      expect(grid).toHaveClass("grid-cols-1");
    });
  });
}); 