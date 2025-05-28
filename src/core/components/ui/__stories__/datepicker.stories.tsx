import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@/core/components/ui/datepicker";
import { useState } from "react";

/**
 * DatePicker component for selecting dates
 * Styled with the Ararat OIL olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
 */
const meta = {
  title: "Core/UI/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultComponent = (args: React.ComponentProps<typeof DatePicker>) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return <DatePicker date={date} onDateChange={setDate} {...args} />;
};

export const Default: Story = {
  render: DefaultComponent,
};

const WithPlaceholderComponent = (args: React.ComponentProps<typeof DatePicker>) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <DatePicker
      date={date}
      onDateChange={setDate}
      placeholder="Select a date"
      {...args}
    />
  );
};

export const WithPlaceholder: Story = {
  render: WithPlaceholderComponent,
};

const DisabledComponent = (args: React.ComponentProps<typeof DatePicker>) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return <DatePicker date={date} onDateChange={setDate} disabled {...args} />;
};

export const Disabled: Story = {
  render: DisabledComponent,
};
