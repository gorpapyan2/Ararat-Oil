import type { Meta, StoryObj } from "@storybook/react";
import { DateRangePicker } from "@/core/components/ui/daterangepicker";
import { useState } from "react";
import { addDays } from "date-fns";

/**
 * DateRangePicker component for selecting date ranges
 * Styled with the Ararat OIL olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
 */

// Define the date range type to match what DateRangePicker expects
type DateRangeType = { from: Date; to?: Date } | undefined;

const meta = {
  title: "Core/UI/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultComponent = (args: React.ComponentProps<typeof DateRangePicker>) => {
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Handler function for date range changes
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
  };

  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={handleDateRangeChange}
      {...args}
    />
  );
};

export const Default: Story = {
  render: DefaultComponent,
};

const WithPlaceholderComponent = (args: React.ComponentProps<typeof DateRangePicker>) => {
  const [dateRange, setDateRange] = useState<DateRangeType>(undefined);

  // Handler function for date range changes
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
  };

  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={handleDateRangeChange}
      placeholder="Select date range"
      {...args}
    />
  );
};

export const WithPlaceholder: Story = {
  render: WithPlaceholderComponent,
};

const DisabledComponent = (args: React.ComponentProps<typeof DateRangePicker>) => {
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Handler function for date range changes
  const handleDateRangeChange = (range: DateRangeType) => {
    setDateRange(range);
  };

  return (
    <DateRangePicker
      dateRange={dateRange}
      onDateRangeChange={handleDateRangeChange}
      disabled
      {...args}
    />
  );
};

export const Disabled: Story = {
  render: DisabledComponent,
};
