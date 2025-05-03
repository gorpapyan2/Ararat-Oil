import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { 
  PageHeader, 
  PageHeaderTitle, 
  PageHeaderDescription, 
  PageHeaderActions, 
  PageHeaderBreadcrumbs,
  PageHeaderSkeleton 
} from '../page-header';

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      // Simple mock translator that returns the key with a prefix
      return `translated_${key}`;
    }
  })
}));

describe('PageHeader Components', () => {
  describe('PageHeader', () => {
    it('renders with a title', () => {
      render(<PageHeader title="Dashboard" />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
    });

    it('renders with a translation key', () => {
      render(<PageHeader titleKey="dashboard.title" />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('translated_dashboard.title');
    });

    it('renders with a description', () => {
      render(<PageHeader title="Dashboard" description="Overview of system metrics" />);
      expect(screen.getByText('Overview of system metrics')).toBeInTheDocument();
    });

    it('renders with a description translation key', () => {
      render(<PageHeader title="Dashboard" descriptionKey="dashboard.description" />);
      expect(screen.getByText('translated_dashboard.description')).toBeInTheDocument();
    });

    it('renders with actions', () => {
      render(
        <PageHeader 
          title="Dashboard" 
          actions={<button>Add New</button>} 
        />
      );
      
      expect(screen.getByRole('button')).toHaveTextContent('Add New');
    });

    it('renders with breadcrumbs', () => {
      render(
        <PageHeader 
          title="Dashboard" 
          breadcrumbs={<div>Home / Dashboard</div>} 
        />
      );
      
      expect(screen.getByText('Home / Dashboard')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <PageHeader 
          title="Dashboard" 
          className="custom-header-class"
          data-testid="page-header"
        />
      );
      
      expect(screen.getByTestId('page-header')).toHaveClass('custom-header-class');
    });
  });

  describe('PageHeaderTitle', () => {
    it('renders children correctly', () => {
      render(<PageHeaderTitle>Custom Title</PageHeaderTitle>);
      expect(screen.getByRole('heading')).toHaveTextContent('Custom Title');
    });

    it('applies custom className', () => {
      render(
        <PageHeaderTitle className="custom-title" data-testid="header-title">
          Title
        </PageHeaderTitle>
      );
      
      expect(screen.getByTestId('header-title')).toHaveClass('custom-title');
    });
  });

  describe('PageHeaderDescription', () => {
    it('renders children correctly', () => {
      render(<PageHeaderDescription>Custom Description</PageHeaderDescription>);
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <PageHeaderDescription className="custom-desc" data-testid="header-desc">
          Description
        </PageHeaderDescription>
      );
      
      expect(screen.getByTestId('header-desc')).toHaveClass('custom-desc');
    });
  });

  describe('PageHeaderActions', () => {
    it('renders children correctly', () => {
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
      render(
        <PageHeaderActions className="custom-actions" data-testid="header-actions">
          <button>Action</button>
        </PageHeaderActions>
      );
      
      expect(screen.getByTestId('header-actions')).toHaveClass('custom-actions');
    });
  });

  describe('PageHeaderBreadcrumbs', () => {
    it('renders children correctly', () => {
      render(
        <PageHeaderBreadcrumbs>
          <span>Home</span> / <span>Section</span>
        </PageHeaderBreadcrumbs>
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('/')).toBeInTheDocument();
      expect(screen.getByText('Section')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <PageHeaderBreadcrumbs className="custom-breadcrumbs" data-testid="header-breadcrumbs">
          <span>Home</span>
        </PageHeaderBreadcrumbs>
      );
      
      expect(screen.getByTestId('header-breadcrumbs')).toHaveClass('custom-breadcrumbs');
    });
  });

  describe('PageHeaderSkeleton', () => {
    it('renders the skeleton loading state', () => {
      render(<PageHeaderSkeleton data-testid="header-skeleton" />);
      const skeleton = screen.getByTestId('header-skeleton');
      
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });
  });

  describe('Component Integration', () => {
    it('composes all components correctly', () => {
      render(
        <PageHeader data-testid="page-header">
          <PageHeaderBreadcrumbs data-testid="breadcrumbs">
            Home / Dashboard
          </PageHeaderBreadcrumbs>
          <PageHeaderTitle data-testid="title">Dashboard</PageHeaderTitle>
          <PageHeaderDescription data-testid="description">
            Overview of all metrics
          </PageHeaderDescription>
          <PageHeaderActions data-testid="actions">
            <button>New Report</button>
          </PageHeaderActions>
        </PageHeader>
      );
      
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home / Dashboard');
      expect(screen.getByTestId('title')).toHaveTextContent('Dashboard');
      expect(screen.getByTestId('description')).toHaveTextContent('Overview of all metrics');
      expect(screen.getByTestId('actions')).toHaveTextContent('New Report');
    });
  });
}); 