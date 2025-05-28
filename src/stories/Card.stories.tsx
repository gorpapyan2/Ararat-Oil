import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithoutDescription: Story = {
  render: (args: React.ComponentProps<typeof Card>) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card doesn't have a description.</p>
      </CardContent>
    </Card>
  ),
};

export const WithActions: Story = {
  render: (args: React.ComponentProps<typeof Card>) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Account Summary</CardTitle>
        <CardDescription>Overview of your account status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Balance:</span>
            <span className="font-bold">$1,250.00</span>
          </div>
          <div className="flex justify-between">
            <span>Pending:</span>
            <span className="font-bold">$120.00</span>
          </div>
          <div className="flex justify-between">
            <span>Available:</span>
            <span className="font-bold">$1,130.00</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  ),
};
