import type { Meta, StoryObj } from "@storybook/react";
import { DateRangePicker } from "@/core/components/ui/date-range-picker";

const meta = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithClassName: Story = {
  args: {
    className: "border-2 border-dashed border-blue-500",
  },
};

export const CustomStyle: Story = {
  args: {
    style: { minHeight: "200px", padding: "2rem" },
  },
};
