import { render, screen } from '@testing-library/react';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox>Test content</Checkbox>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-class">Test content</Checkbox>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
