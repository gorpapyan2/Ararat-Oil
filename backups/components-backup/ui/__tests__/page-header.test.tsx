import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions } from '../page-header';

describe('PageHeader', () => {
  it('renders children correctly', () => {
    render(
      <PageHeader>
        <div data-testid="test-child">Test Content</div>
      </PageHeader>
    );
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageHeader className="custom-class">
        <div>Test Content</div>
      </PageHeader>
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('PageHeaderTitle', () => {
  it('renders title text correctly', () => {
    render(<PageHeaderTitle>Page Title</PageHeaderTitle>);
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('renders as h1 by default', () => {
    const { container } = render(<PageHeaderTitle>Page Title</PageHeaderTitle>);
    expect(container.querySelector('h1')).toBeInTheDocument();
  });

  it('renders as specified heading level', () => {
    const { container } = render(<PageHeaderTitle as="h3">Page Title</PageHeaderTitle>);
    expect(container.querySelector('h3')).toBeInTheDocument();
  });
});

describe('PageHeaderDescription', () => {
  it('renders description text correctly', () => {
    render(<PageHeaderDescription>Page description text</PageHeaderDescription>);
    expect(screen.getByText('Page description text')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageHeaderDescription className="custom-desc-class">
        Description
      </PageHeaderDescription>
    );
    
    expect(container.firstChild).toHaveClass('custom-desc-class');
  });
});

describe('PageHeaderActions', () => {
  it('renders action buttons correctly', () => {
    render(
      <PageHeaderActions>
        <button>Action 1</button>
        <button>Action 2</button>
      </PageHeaderActions>
    );
    
    expect(screen.getByText('Action 1')).toBeInTheDocument();
    expect(screen.getByText('Action 2')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageHeaderActions className="custom-actions-class">
        <button>Action</button>
      </PageHeaderActions>
    );
    
    expect(container.firstChild).toHaveClass('custom-actions-class');
  });
});
