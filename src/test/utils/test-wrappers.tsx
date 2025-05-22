/**
 * Shared test wrapper components and utilities
 * This file provides wrapper components for testing
 */
import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';

type TestWrapperProps = {
  children: React.ReactNode;
};

/**
 * Setup component wrapper with common providers
 * This reduces duplication in component tests that need similar providers
 */
export function setupComponentWrapper() {
  // Create QueryClient
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Mock translations
  const mockTranslation = vi.fn((key: string) => key);
  
  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: mockTranslation,
      i18n: {
        changeLanguage: vi.fn(),
      },
    }),
  }));

  /**
   * Standard wrapper with QueryClient provider
   */
  function QueryWrapper({ children }: TestWrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  /**
   * Helper function to render components with all providers
   */
  function renderWithProviders(ui: React.ReactElement) {
    return render(ui, {
      wrapper: QueryWrapper,
    });
  }

  return {
    QueryWrapper,
    renderWithProviders,
    mockTranslation,
    queryClient,
  };
} 