import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardMedia,
  CardActions,
} from "./card";
import "@testing-library/jest-dom";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders with default variant", () => {
      render(<Card>Card Content</Card>);
      const card = screen.getByText("Card Content");
      expect(card).toBeInTheDocument();
      expect(card.parentElement).toHaveClass("bg-card");
      expect(card.parentElement).toHaveClass("border-border/40");
    });

    it("renders with outline variant", () => {
      render(<Card variant="outline">Card Content</Card>);
      const card = screen.getByText("Card Content");
      expect(card.parentElement).toHaveClass("bg-transparent");
      expect(card.parentElement).toHaveClass("border-border");
    });

    it("renders with elevated variant", () => {
      render(<Card variant="elevated">Card Content</Card>);
      const card = screen.getByText("Card Content");
      expect(card.parentElement).toHaveClass("bg-card");
      expect(card.parentElement).toHaveClass("border-0");
      expect(card.parentElement).toHaveClass("shadow-lg");
    });

    it("renders with subtle variant", () => {
      render(<Card variant="subtle">Card Content</Card>);
      const card = screen.getByText("Card Content");
      expect(card.parentElement).toHaveClass("bg-muted/50");
      expect(card.parentElement).toHaveClass("border-0");
    });

    it("applies custom className", () => {
      render(<Card className="test-class">Card Content</Card>);
      const card = screen.getByText("Card Content");
      expect(card.parentElement).toHaveClass("test-class");
    });
  });

  describe("CardHeader", () => {
    it("renders correctly", () => {
      render(<CardHeader>Header Content</CardHeader>);
      const header = screen.getByText("Header Content");
      expect(header).toBeInTheDocument();
      expect(header.parentElement).toHaveClass("border-b");
      expect(header.parentElement).toHaveClass("p-6");
    });
  });

  describe("CardTitle", () => {
    it("renders with small size", () => {
      render(<CardTitle size="sm">Small Title</CardTitle>);
      const title = screen.getByText("Small Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("text-lg");
    });

    it("renders with medium size", () => {
      render(<CardTitle size="md">Medium Title</CardTitle>);
      const title = screen.getByText("Medium Title");
      expect(title).toHaveClass("text-xl");
    });

    it("renders with large size", () => {
      render(<CardTitle size="lg">Large Title</CardTitle>);
      const title = screen.getByText("Large Title");
      expect(title).toHaveClass("text-2xl");
    });
  });

  describe("CardDescription", () => {
    it("renders correctly", () => {
      render(<CardDescription>Card description</CardDescription>);
      const desc = screen.getByText("Card description");
      expect(desc).toBeInTheDocument();
      expect(desc).toHaveClass("text-muted-foreground");
    });
  });

  describe("CardContent", () => {
    it("renders with default padding", () => {
      render(<CardContent>Content with padding</CardContent>);
      const content = screen.getByText("Content with padding");
      expect(content).toBeInTheDocument();
      expect(content.parentElement).toHaveClass("p-6");
    });

    it("renders without padding when noPadding is true", () => {
      render(<CardContent noPadding>Content without padding</CardContent>);
      const content = screen.getByText("Content without padding");
      expect(content.parentElement).toHaveClass("p-0");
      expect(content.parentElement).not.toHaveClass("p-6");
    });
  });

  describe("CardFooter", () => {
    it("renders with default alignment (between)", () => {
      render(<CardFooter>Footer Content</CardFooter>);
      const footer = screen.getByText("Footer Content");
      expect(footer).toBeInTheDocument();
      expect(footer.parentElement).toHaveClass("justify-between");
    });

    it("renders with start alignment", () => {
      render(<CardFooter align="start">Start Aligned</CardFooter>);
      const footer = screen.getByText("Start Aligned");
      expect(footer.parentElement).toHaveClass("justify-start");
    });

    it("renders with center alignment", () => {
      render(<CardFooter align="center">Center Aligned</CardFooter>);
      const footer = screen.getByText("Center Aligned");
      expect(footer.parentElement).toHaveClass("justify-center");
    });

    it("renders with end alignment", () => {
      render(<CardFooter align="end">End Aligned</CardFooter>);
      const footer = screen.getByText("End Aligned");
      expect(footer.parentElement).toHaveClass("justify-end");
    });
  });

  describe("CardMedia", () => {
    it("renders correctly", () => {
      render(<CardMedia>Media Content</CardMedia>);
      const media = screen.getByText("Media Content");
      expect(media).toBeInTheDocument();
      expect(media.parentElement).toHaveClass("rounded-t-xl");
      expect(media.parentElement).toHaveClass("overflow-hidden");
    });
  });

  describe("CardActions", () => {
    it("renders correctly", () => {
      render(<CardActions>Actions Content</CardActions>);
      const actions = screen.getByText("Actions Content");
      expect(actions).toBeInTheDocument();
      expect(actions.parentElement).toHaveClass("flex");
      expect(actions.parentElement).toHaveClass("justify-end");
      expect(actions.parentElement).toHaveClass("gap-2");
    });
  });

  describe("Full Card Example", () => {
    it("renders a complete card with all components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Example Card</CardTitle>
            <CardDescription>This is a description</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Example Card")).toBeInTheDocument();
      expect(screen.getByText("This is a description")).toBeInTheDocument();
      expect(screen.getByText("Card content goes here")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });
});

// Mock Button component
function Button({ children }: { children: React.ReactNode }) {
  return <button>{children}</button>;
} 