import { render, screen } from '@testing-library/react';
import { Accordion } from './accordion';

describe('Accordion', () => {
  it('renders correctly', () => {
    render(<Accordion>Test content</Accordion>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Accordion className="custom-class">Test content</Accordion>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
