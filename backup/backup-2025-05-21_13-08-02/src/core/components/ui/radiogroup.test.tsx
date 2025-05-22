import { render, screen } from '@testing-library/react';
import { RadioGroup } from './radiogroup';

describe('RadioGroup', () => {
  it('renders correctly', () => {
    render(<RadioGroup>Test content</RadioGroup>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<RadioGroup className="custom-class">Test content</RadioGroup>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
