import { render, screen } from '@testing-library/react';
import { Popover } from './popover';

describe('Popover', () => {
  it('renders correctly', () => {
    render(<Popover>Test content</Popover>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Popover className="custom-class">Test content</Popover>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
