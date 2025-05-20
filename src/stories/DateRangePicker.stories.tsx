import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker } from '@/core/components/ui/daterangepicker';
import { useState } from 'react';
import { addDays } from 'date-fns';

// Define the date range type to match what DateRangePicker expects
type DateRangeType = { from: Date; to?: Date } | undefined;

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: any) => {
    // @ts-ignore - This is a Storybook pattern
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
  },
};

export const WithPlaceholder: Story = {
  render: (args: any) => {
    // @ts-ignore - This is a Storybook pattern
    const [dateRange, setDateRange] = useState<DateRangeType>(undefined);
    
    // Handler function for date range changes
    const handleDateRangeChange = (range: DateRangeType) => {
      setDateRange(range);
    };
    
    return (
      <DateRangePicker 
        dateRange={dateRange} 
        onDateRangeChange={handleDateRangeChange} 
        placeholder="Select a date range" 
        {...args} 
      />
    );
  },
};

export const Disabled: Story = {
  render: (args: any) => {
    // @ts-ignore - This is a Storybook pattern
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
        disabled={true} 
        {...args} 
      />
    );
  },
}; 