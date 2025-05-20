import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea>Test content</Textarea>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class">Test content</Textarea>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
