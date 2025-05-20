import { render, screen } from '@testing-library/react';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch>Test content</Switch>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Switch className="custom-class">Test content</Switch>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
