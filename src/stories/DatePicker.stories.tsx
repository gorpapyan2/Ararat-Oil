import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "@/core/components/ui/datepicker";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper components to avoid hook errors
const DefaultStory = (args: React.ComponentProps<typeof DatePicker>) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return <DatePicker date={date} onDateChange={setDate} {...args} />;
};

const PlaceholderStory = (args: React.ComponentProps<typeof DatePicker>) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      placeholder="Pick a date"
      {...args}
    />
  );
};

const DisabledStory = (args: React.ComponentProps<typeof DatePicker>) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      disabled={true}
      {...args}
    />
  );
};

export const Default: Story = {
  render: DefaultStory,
};

export const WithPlaceholder: Story = {
  render: PlaceholderStory,
};

export const Disabled: Story = {
  render: DisabledStory,
};
