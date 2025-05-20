import { render, screen } from '@testing-library/react';
import { Tooltip } from './tooltip';

describe('Tooltip', () => {
  it('renders correctly', () => {
    render(<Tooltip>Test content</Tooltip>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Tooltip className="custom-class">Test content</Tooltip>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
