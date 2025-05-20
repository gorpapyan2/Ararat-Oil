import { render, screen } from '@testing-library/react';
import { DatePicker } from './datepicker';

describe('DatePicker', () => {
  it('renders correctly', () => {
    render(<DatePicker>Test content</DatePicker>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<DatePicker className="custom-class">Test content</DatePicker>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
