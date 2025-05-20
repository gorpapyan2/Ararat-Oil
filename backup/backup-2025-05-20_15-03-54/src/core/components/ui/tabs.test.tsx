import { render, screen } from '@testing-library/react';
import { Tabs } from './tabs';

describe('Tabs', () => {
  it('renders correctly', () => {
    render(<Tabs>Test content</Tabs>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Tabs className="custom-class">Test content</Tabs>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
