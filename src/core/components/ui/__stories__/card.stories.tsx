import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/primitives/button";

/**
 * Card component for displaying grouped content
 * Follows the Ararat OIL olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
 */
const meta = {
  title: "Core/UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args: React.ComponentProps<typeof Card>) => (
    <Card className="w-[350px]" {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
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
            <span className="font-semibold">$1,245.89</span>
          </div>
          <div className="flex justify-between">
            <span>Pending:</span>
            <span className="font-semibold">$125.00</span>
          </div>
          <div className="flex justify-between">
            <span>Available:</span>
            <span className="font-semibold">$1,120.89</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Submit</Button>
      </CardFooter>
    </Card>
  ),
};
