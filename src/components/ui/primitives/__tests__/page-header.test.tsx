import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  PageHeaderPrimitive,
  PageHeaderTitlePrimitive,
  PageHeaderDescriptionPrimitive,
  PageHeaderActionsPrimitive,
  PageHeaderBreadcrumbsPrimitive,
} from '../page-header';

describe('PageHeader Primitives', () => {
  describe('PageHeaderPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <PageHeaderPrimitive data-testid="page-header">
          <div>Header Content</div>
        </PageHeaderPrimitive>
      );
      
      const header = screen.getByTestId('page-header');
      expect(header).toHaveTextContent('Header Content');
    });

    it('applies custom classNames', () => {
      render(
        <PageHeaderPrimitive data-testid="page-header" className="custom-class">
          Header Content
        </PageHeaderPrimitive>
      );
      
      const header = screen.getByTestId('page-header');
      expect(header).toHaveClass('custom-class');
    });

    it('forwards additional props', () => {
      render(
        <PageHeaderPrimitive data-testid="page-header" aria-label="Page Header">
          Header Content
        </PageHeaderPrimitive>
      );
      
      const header = screen.getByTestId('page-header');
      expect(header).toHaveAttribute('aria-label', 'Page Header');
    });
  });

  describe('PageHeaderTitlePrimitive', () => {
    it('renders children correctly', () => {
      render(
        <PageHeaderTitlePrimitive data-testid="header-title">
          Page Title
        </PageHeaderTitlePrimitive>
      );
      
      const title = screen.getByTestId('header-title');
      expect(title).toHaveTextContent('Page Title');
    });

    it('applies custom classNames', () => {
      render(
        <PageHeaderTitlePrimitive data-testid="header-title" className="custom-title-class">
          Page Title
        </PageHeaderTitlePrimitive>
      );
      
      const title = screen.getByTestId('header-title');
      expect(title).toHaveClass('custom-title-class');
    });
  });

  describe('PageHeaderDescriptionPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <PageHeaderDescriptionPrimitive data-testid="header-description">
          Description text
        </PageHeaderDescriptionPrimitive>
      );
      
      const description = screen.getByTestId('header-description');
      expect(description).toHaveTextContent('Description text');
    });

    it('applies custom classNames', () => {
      render(
        <PageHeaderDescriptionPrimitive data-testid="header-description" className="custom-desc-class">
          Description text
        </PageHeaderDescriptionPrimitive>
      );
      
      const description = screen.getByTestId('header-description');
      expect(description).toHaveClass('custom-desc-class');
    });
  });

  describe('PageHeaderActionsPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <PageHeaderActionsPrimitive data-testid="header-actions">
          <button>Action 1</button>
          <button>Action 2</button>
        </PageHeaderActionsPrimitive>
      );
      
      const actions = screen.getByTestId('header-actions');
      expect(actions).toHaveTextContent('Action 1');
      expect(actions).toHaveTextContent('Action 2');
    });

    it('applies custom classNames', () => {
      render(
        <PageHeaderActionsPrimitive data-testid="header-actions" className="custom-actions-class">
          <button>Action</button>
        </PageHeaderActionsPrimitive>
      );
      
      const actions = screen.getByTestId('header-actions');
      expect(actions).toHaveClass('custom-actions-class');
    });
  });

  describe('PageHeaderBreadcrumbsPrimitive', () => {
    it('renders children correctly', () => {
      render(
        <PageHeaderBreadcrumbsPrimitive data-testid="header-breadcrumbs">
          <span>Home</span> / <span>Section</span>
        </PageHeaderBreadcrumbsPrimitive>
      );
      
      const breadcrumbs = screen.getByTestId('header-breadcrumbs');
      expect(breadcrumbs).toHaveTextContent('Home / Section');
    });

    it('applies custom classNames', () => {
      render(
        <PageHeaderBreadcrumbsPrimitive data-testid="header-breadcrumbs" className="custom-breadcrumbs-class">
          <span>Home</span>
        </PageHeaderBreadcrumbsPrimitive>
      );
      
      const breadcrumbs = screen.getByTestId('header-breadcrumbs');
      expect(breadcrumbs).toHaveClass('custom-breadcrumbs-class');
    });
  });

  describe('Component Composition', () => {
    it('composes all primitives correctly', () => {
      render(
        <PageHeaderPrimitive data-testid="page-header">
          <PageHeaderBreadcrumbsPrimitive data-testid="header-breadcrumbs">
            Home / Section
          </PageHeaderBreadcrumbsPrimitive>
          <PageHeaderTitlePrimitive data-testid="header-title">
            Page Title
          </PageHeaderTitlePrimitive>
          <PageHeaderDescriptionPrimitive data-testid="header-description">
            Page Description
          </PageHeaderDescriptionPrimitive>
          <PageHeaderActionsPrimitive data-testid="header-actions">
            <button>Action</button>
          </PageHeaderActionsPrimitive>
        </PageHeaderPrimitive>
      );
      
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('header-breadcrumbs')).toHaveTextContent('Home / Section');
      expect(screen.getByTestId('header-title')).toHaveTextContent('Page Title');
      expect(screen.getByTestId('header-description')).toHaveTextContent('Page Description');
      expect(screen.getByTestId('header-actions')).toHaveTextContent('Action');
    });
  });
}); 